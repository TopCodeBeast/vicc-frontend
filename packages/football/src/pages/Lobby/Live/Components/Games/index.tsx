import { gql, useSubscription } from '@apollo/client';
import qs from 'qs';
import { FormattedMessage } from 'react-intl';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import StyledSecondaryTabs from '@sorare/core/src/atoms/navigation/StyledSecondaryTabs';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useIsDesktop } from '@sorare/core/src/hooks/device/useIsDesktop';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import { sortBy, uniqueBy } from '@sorare/core/src/lib/arrays';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { Game } from '@football/components/stats/Game';
import { useLoadMore } from '@football/hooks/useLoadMore';
import { GameEventStatus, gameStatusMessages } from '@football/lib/so5';
import { ShowMoreButton } from '@football/pages/Lobby/Components/ShowMoreButton';

import { GamesQuery } from './__generated__/index.graphql';

const Root = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  margin-bottom: var(--unit);
`;

const GamesWrapper = styled.div`
  display: flex;
  gap: var(--unit);
  scroll-snap-type: x mandatory;
  overflow: auto;
  margin: 0 calc(var(--unit) * -1);
  padding: 0 var(--unit);
  & > * {
    scroll-snap-align: center;
    min-width: 90%;
    @media ${tabletAndAbove} {
      min-width: 45%;
    }
  }
  @media ${laptopAndAbove} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 0;
    margin: 0;
  }
`;
const StyledGame = styled(Game)`
  border-radius: var(--unit);
  background-color: var(--c-neutral-300);
  height: 100%;
`;

const TAB = {
  ALL: 'all',
  MINE: 'my-matches',
};

const PAGE_SIZE = 6;

// const subscription = gql`
//   subscription onGameForLobbyUpdated {
//     gameWasUpdated {
//       id
//       minute
//       status
//       awayGoals
//       homeGoals
//     }
//   }
// `;

const GAMES_QUERY = gql`
  query GamesQuery {
    so5: vicc5Root {
      so5Fixture: vicc5Fixture(type: LIVE) {
        slug
        games {
          id
          status
          ...So5Game_game
        }
        mySo5Games: myVicc5Games {
          id
          ...So5Game_game
        }
      }
    }
  }
  ${Game.fragments.game}
`;

const placeholderGame = (id: string) => ({
  __typename: 'Game' as const,
  id,
  date: '',
  minute: 0,
  status: 'scheduled',
  awayGoals: null,
  homeGoals: 0,
  awayTeam: null,
  homeTeam: null,
});

const STATUS: Record<GameEventStatus, number> = {
  playing: 1,
  played: 2,
  scheduled: 3,
  cancelled: 4,
  postponed: 4,
  suspended: 4,
};

export const Games = () => {
  // useSubscription(subscription);
  const isDesktop = useIsDesktop();
  const { formatMessage } = useIntlContext();
  const { data, loading } = useQuery<GamesQuery>(GAMES_QUERY, {
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });
  const { so5Fixture } = data?.so5 || {};
  const parseSearch = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  const games = {
    [TAB.MINE]: sortBy(
      g => STATUS[g.status as GameEventStatus],
      [...(so5Fixture?.mySo5Games || [])].filter(
        g => gameStatusMessages[g.status]
      )
    ),
    [TAB.ALL]: sortBy(
      g => STATUS[g.status as GameEventStatus],
      [
        ...(so5Fixture?.games?.filter(g => gameStatusMessages[g.status]) ||
          Array(PAGE_SIZE)
            .fill('')
            .map((_, i) => placeholderGame(`${i + 1}`))),
      ]
    ),
  };
  const matches = {
    [TAB.MINE]: games[TAB.MINE].filter(
      ({ status }) => !parseSearch.status || status === parseSearch.status
    ),
    [TAB.ALL]: games[TAB.ALL].filter(
      ({ status }) => !parseSearch.status || status === parseSearch.status
    ),
  };

  const currentTab = matches[`${parseSearch.tab}`]?.length
    ? `${parseSearch.tab}`
    : (matches[TAB.MINE]?.length && TAB.MINE) || TAB.ALL;
  const [displayed, loadMore, hasMoreMatches] = useLoadMore(
    matches[currentTab],
    PAGE_SIZE
  );
  const filterTabs = [
    ...uniqueBy(g => g.status, [...games[TAB.MINE], ...games[TAB.ALL]]),
  ].map(({ status }) => {
    return {
      to: `${window.location.pathname}?status=${
        status === parseSearch.status ? '' : status
      }`,
      disabled: loading || !games[currentTab].find(g => g.status === status),
      label: formatMessage(gameStatusMessages[status]),
      active: parseSearch.status === status,
    };
  });

  const { InfiniteScrollLoader } = useInfiniteScroll(
    loadMore,
    !!hasMoreMatches,
    false
  );

  if (!matches[TAB.ALL].length) {
    if (parseSearch.tab || parseSearch.status) {
      return <Navigate to={window.location.pathname} replace />;
    }
    return null;
  }

  if (!matches[currentTab].length) {
    return <Navigate to={window.location.pathname} replace />;
  }

  const displayShowMoreButton = hasMoreMatches && displayed.length <= PAGE_SIZE;
  const displayInfiniteScroll = hasMoreMatches && displayed.length > PAGE_SIZE;
  return (
    <Root>
      <header>
        <StyledSecondaryTabs
          noBorder
          items={[
            {
              to: `?tab=${TAB.ALL}`,
              label: formatMessage(
                {
                  id: 'Lobby.Live.Games.all',
                  defaultMessage: 'All matches <span>({nb_matches})</span>',
                },
                {
                  nb_matches: matches[TAB.ALL]?.length,
                  span: (c: any) => (loading ? null : <span>{c}</span>),
                }
              ),
              disabled: loading || !matches[TAB.ALL]?.length,
              active: !loading && currentTab === TAB.ALL,
            },
            {
              to: `?tab=${TAB.MINE}`,
              label: formatMessage(
                {
                  id: 'Lobby.Live.Games.mine',
                  defaultMessage: 'My matches <span>({nb_matches})</span>',
                },
                {
                  nb_matches: matches[TAB.MINE]?.length,
                  span: (c: any) => (loading ? null : <span>{c}</span>),
                }
              ),
              disabled: loading || !matches[TAB.MINE]?.length,
              active: !loading && currentTab === TAB.MINE,
            },
          ]}
        />
        {filterTabs.length > 1 && (
          <StyledSecondaryTabs noBorder items={filterTabs} />
        )}
      </header>
      <GamesWrapper>
        {displayed.map(match => (
          <StyledGame key={match.id} game={match} withMatchView />
        ))}
        {!isDesktop && hasMoreMatches && <InfiniteScrollLoader />}
      </GamesWrapper>
      {loading && !hasMoreMatches && <LoadingIndicator small />}
      {isDesktop && (
        <>
          {displayShowMoreButton ? (
            <ShowMoreButton
              onClick={loadMore}
              moreText={
                <FormattedMessage
                  id="Lobby.Live.Games.more"
                  defaultMessage="Show more games"
                />
              }
            />
          ) : (
            displayInfiniteScroll && <InfiniteScrollLoader />
          )}
        </>
      )}
    </Root>
  );
};

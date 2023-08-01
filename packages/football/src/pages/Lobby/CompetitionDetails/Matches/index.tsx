import { gql } from '@apollo/client';
import qs from 'qs';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import StyledSecondaryTabs from '@sorare/core/src/atoms/navigation/StyledSecondaryTabs';
import { Caption, Title5 } from '@sorare/core/src/atoms/typography';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';

import { Game } from '@football/components/stats/Game';
import { GameCoverageBadge } from '@football/components/stats/GameCoverageBadge';
import { useLoadMore } from '@football/hooks/useLoadMore';
import { ShowMoreButton } from '@football/pages/Lobby/Components/ShowMoreButton';

import {
  CompetitionDetailsMatchesTabQuery,
  CompetitionDetailsMatchesTabQueryVariables,
  CompetitionDetailsMatchesTabQuery_game,
} from './__generated__/index.graphql';

const Root = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding-bottom: var(--double-unit);
`;
const Games = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
  overflow: hidden;
  padding: var(--double-unit) 0;
`;
const StyledGame = styled(Game)`
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-300);
`;

const COMPETITION_DETAILS_MATCHES_TAB_QUERY = gql`
  query CompetitionDetailsMatchesTabQuery($leaderboardSlug: String!) {
    so5: vicc5Root {
      so5Leaderboard: vicc5Leaderboard(slug: $leaderboardSlug) {
        slug
        title
        so5League: vicc5League {
          slug
          games {
            ...CompetitionDetailsMatchesTabQuery_game
          }
          mySo5Games: myVicc5Games {
            ...CompetitionDetailsMatchesTabQuery_game
          }
        }
      }
    }
  }
  fragment CompetitionDetailsMatchesTabQuery_game on Game {
    id
    status
    date
    coverageStatus
    homeTeam {
      ...CompetitionDetailsMatchesTabQuery_team
    }
    awayTeam {
      ...CompetitionDetailsMatchesTabQuery_team
    }
    homeGoals
    awayGoals
    status
    competition {
      slug
      displayName
    }
    ...So5Game_game
  }
  fragment CompetitionDetailsMatchesTabQuery_team on TeamInterface {
    slug
    name
    code
    avatarUrl: pictureUrl(derivative: "avatar")
    country {
      slug
    }
  }
  ${Game.fragments.game}
`;

export const TAB = {
  ALL: 'all',
  MINE: 'my-matches',
};

export function formatMatches(games: CompetitionDetailsMatchesTabQuery_game[]) {
  const matches: {
    [key: string]: {
      slug: string;
      name: string;
      games: CompetitionDetailsMatchesTabQuery_game[];
    };
  } = {};
  if (!games) {
    return [];
  }
  games.forEach(({ id, competition, ...rest }) => {
    const { slug, displayName } = competition;
    const game = {
      id,
      competition,
      ...rest,
    };
    if (!matches[slug]) {
      matches[slug] = {
        slug,
        name: displayName,
        games: [game],
      };
    } else {
      matches[slug].games.push(game);
    }
  });
  return Object.values(matches);
}

const PAGE_SIZE = 10;

const CompetitionDetailsMatchesTab = () => {
  const { competition } = useParams();
  const { formatMessage } = useIntlContext();
  const qsParams = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  const currentTab = [TAB.ALL, TAB.MINE].includes(
    (qsParams.tab as string) || ''
  )
    ? `${qsParams.tab}`
    : TAB.ALL;
  const { data, loading } = useQuery<
    CompetitionDetailsMatchesTabQuery,
    CompetitionDetailsMatchesTabQueryVariables
  >(COMPETITION_DETAILS_MATCHES_TAB_QUERY, {
    variables: { leaderboardSlug: competition || '' },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  const matches = useMemo(() => {
    const { mySo5Games = [], games = [] } =
      data?.football.so5.so5Leaderboard?.so5League || {};
    return {
      [TAB.ALL]: formatMatches(games),
      [TAB.MINE]: formatMatches(mySo5Games),
    };
  }, [data?.football.so5.so5Leaderboard?.so5League]);

  const [displayed, loadMore, hasMoreMatches] = useLoadMore(
    matches[currentTab],
    3
  );
  const [itemsPerDisplayed, setItemsPerDisplayed] = useState<
    Record<string, number>
  >({});

  const { InfiniteScrollLoader } = useInfiniteScroll(
    loadMore,
    !!hasMoreMatches,
    false
  );

  if (!data && loading) {
    return <LoadingIndicator grow />;
  }

  return (
    <>
      <Root>
        <StyledSecondaryTabs
          noBorder
          items={[
            {
              to: qs.stringify(
                {
                  ...qsParams,
                  tab: TAB.ALL,
                },
                { addQueryPrefix: true }
              ),
              label: formatMessage({
                id: 'Lobby.CompetitionDetails.Matches.Tab.all',
                defaultMessage: 'All matches',
              }),
              active: currentTab === TAB.ALL,
            },
            {
              to: qs.stringify(
                {
                  ...qsParams,
                  tab: TAB.MINE,
                },
                { addQueryPrefix: true }
              ),
              label: formatMessage({
                id: 'Lobby.CompetitionDetails.Matches.Tab.mine',
                defaultMessage: 'My matches',
              }),
              active: currentTab === TAB.MINE,
            },
          ]}
        />
        {displayed.map(({ slug, name, games }) => {
          const gamesToDisplay = games.slice(
            0,
            itemsPerDisplayed[slug] || PAGE_SIZE
          );
          return (
            <article key={slug}>
              <header>
                <Title5>
                  {name} <small>({games.length})</small>
                </Title5>
              </header>
              <Games>
                {gamesToDisplay.map(game => (
                  <StyledGame
                    key={game.id}
                    game={game}
                    withMatchView
                    cardScore={
                      <Caption>
                        <GameCoverageBadge
                          coverageStatus={game.coverageStatus}
                          color="white"
                        />
                      </Caption>
                    }
                  />
                ))}
              </Games>
              {games.length > gamesToDisplay.length && (
                <ShowMoreButton
                  onClick={() =>
                    setItemsPerDisplayed(prev => {
                      return {
                        ...prev,
                        [slug]: (prev[slug] || PAGE_SIZE) + PAGE_SIZE,
                      };
                    })
                  }
                  moreText={
                    <FormattedMessage
                      id="LobbyUpcoming.more.matches"
                      defaultMessage="Show more matches"
                    />
                  }
                />
              )}
            </article>
          );
        })}
      </Root>
      <InfiniteScrollLoader />
    </>
  );
};

export default CompetitionDetailsMatchesTab;

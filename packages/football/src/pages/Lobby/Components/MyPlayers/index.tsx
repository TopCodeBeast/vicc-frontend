import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Vicc5State } from '@sorare/core/src/__generated__/globalTypes';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Empty } from '@sorare/core/src/components/cards/Empty';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { useLoadMore } from '@football/hooks/useLoadMore';
import { Player } from '@football/pages/Lobby/Components/Player';
import { ShowMoreButton } from '@football/pages/Lobby/Components/ShowMoreButton';

import {
  LobbyMyPlayersQuery,
  LobbyMyPlayersQueryVariables,
} from './__generated__/index.graphql';

type LobbyMyPlayersQuery_vicc5_vicc5Fixture_myVicc5Lineups_vicc5Appearances =
  NonNullable<
    LobbyMyPlayersQuery['football']['vicc5']['vicc5Fixture']
  >['myVicc5Lineups'][number]['vicc5Appearances'][number];

const Root = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--quadruple-unit);
`;
const PlayersWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--double-unit);
  @media ${tabletAndAbove} {
    grid-template-columns: repeat(2, 1fr);
  }
  @media ${laptopAndAbove} {
    grid-template-columns: repeat(3, 1fr);
  }
`;
const LoadingWrapper = styled.div`
  margin: var(--double-unit) 0;
`;

const messages = defineMessages({
  emptyTitle: {
    id: 'Lobby.Past.MyPlayers.Empty.title',
    defaultMessage: 'Quiet week',
  },
  emptyDescription: {
    id: 'Lobby.Past.MyPlayers.Empty.description',
    defaultMessage: 'No players were registered for this week',
  },
});

const LOBBY_MY_PLAYERS_QUERY = gql`
  query LobbyMyPlayersQuery($type: Vicc5State, $slug: String) {
    football {
      vicc5 {
        vicc5Fixture(type: $type, slug: $slug) {
          slug
          myVicc5Lineups {
            id
            vicc5Appearances {
              id
              ...LobbyPlayer_vicc5Appearance
            }
          }
        }
      }
    }
  }
  ${Player.fragments.vicc5Appearance}
` as TypedDocumentNode<LobbyMyPlayersQuery, LobbyMyPlayersQueryVariables>;

export const MyPlayers = ({ type }: { type: Vicc5State }) => {
  const { formatMessage } = useIntl();
  const { slug } = useParams();
  const { data, loading } = useQuery(LOBBY_MY_PLAYERS_QUERY, {
    variables: { type, slug: slug !== 'past' ? slug : null },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });
  const players = useMemo(() => {
    const lineups = data?.football.vicc5.vicc5Fixture?.myVicc5Lineups;
    const myPlayers: LobbyMyPlayersQuery_vicc5_vicc5Fixture_myVicc5Lineups_vicc5Appearances[] =
      [];
    if (!lineups) {
      return myPlayers;
    }
    lineups.forEach(({ vicc5Appearances }) => {
      myPlayers.push(
        ...vicc5Appearances.filter(({ vicc5Score }) => vicc5Score?.game)
      );
    });
    return myPlayers;
  }, [data?.football.vicc5.vicc5Fixture?.myVicc5Lineups]);

  const [displayed, loadMore, hasMoreMatches] = useLoadMore(players, 6);

  const { ref: refTriggeringInfiniteScroll } = useInfiniteScroll(
    useCallback(loadMore, [loadMore]),
    !!hasMoreMatches,
    false
  );

  if (!players.length && loading) {
    return (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    );
  }

  return (
    <Root>
      {!!displayed.length && (
        <PlayersWrapper>
          {displayed.map(player => {
            return <Player key={player.id} player={player} />;
          })}
        </PlayersWrapper>
      )}
      {hasMoreMatches && (
        <ShowMoreButton
          ref={
            (displayed?.length || 0) > 6 ? refTriggeringInfiniteScroll : null
          }
          moreText={
            <FormattedMessage
              id="LobbyMyPlayers.more.players"
              defaultMessage="Show more players"
            />
          }
          onClick={loadMore}
        />
      )}
      {!players.length && !loading && (
        <Empty
          title={formatMessage(messages.emptyTitle)}
          description={formatMessage(messages.emptyDescription)}
        />
      )}
    </Root>
  );
};

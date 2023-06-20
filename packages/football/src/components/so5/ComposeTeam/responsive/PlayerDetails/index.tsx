import { gql } from '@apollo/client';
import { useCallback } from 'react';
import styled from 'styled-components';

import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';

import LastScores from '@sorare/football/src/components/stats/LastScores';

import PlayerProperties from './PlayerProperties';
import PlayerUnavailabilityPanel from './PlayerUnavailabilityPanel';
import PlayerUpcomingGames from './PlayerUpcomingGames';
import {
  FixtureScoresQuery,
  FixtureScoresQueryVariables,
  PlayerDetailsQuery,
  PlayerDetailsQueryVariables,
  PlayerDetails_card,
} from './__generated__/index.graphql';

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
  padding: var(--double-unit);
  color: var(--c-neutral-1000);
  background: linear-gradient(
    0deg,
    var(--c-neutral-100) 0%,
    var(--c-neutral-100) calc(100% - 100px),
    #4d4b49 100%
  );
`;

const CloseButtonWrapper = styled.div`
  position: absolute;
  right: var(--double-unit);
  top: var(--double-unit);
`;

const FIXTURE_SCORES_QUERY = gql`
  query FixtureScoresQuery(
    $slug: String!
    $cursor: String
    $position: Position
  ) {
    football {
      player(slug: $slug) {
        slug
        lastFiveSo5AverageScore: averageScore(
          type: LAST_FIVE_SO5_AVERAGE_SCORE
          position: $position
        )
        lastFifteenSo5AverageScore: averageScore(
          type: LAST_FIFTEEN_SO5_AVERAGE_SCORE
          position: $position
        )
        allSo5Scores(first: 10, after: $cursor, position: $position) {
          nodes {
            id
            ...LastScores_so5Score
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
        ...LastScores_player
      }
    }
  }
  ${LastScores.fragments.so5Score}
  ${LastScores.fragments.player}
`;

const PLAYER_DETAILS_QUERY = gql`
  query PlayerDetailsQuery($slug: String!) {
    football {
      player(slug: $slug) {
        slug
        activeClub {
          slug
          upcomingGames(first: 3) {
            id
            ...PlayerUpcomingGames_game
          }
        }
        activeNationalTeam {
          slug
          upcomingGames(first: 3) {
            id
            ...PlayerUpcomingGames_game
          }
        }
        ...PlayerProperties_player
        ...PlayerUnavailabilityPanel_player
      }
    }
  }
  ${PlayerUpcomingGames.fragments.game}
  ${PlayerProperties.fragments.player}
  ${PlayerUnavailabilityPanel.fragments.player}
`;

type Props = {
  slug: string;
  pictureUrl?: string | null;
  card?: PlayerDetails_card;
  onClose: () => void;
  showCardBonusIndicator?: boolean;
};
const PlayerDetails = ({
  slug,
  pictureUrl,
  card,
  showCardBonusIndicator = true,
  onClose,
}: Props) => {
  const { data: playerDetailsData, loading: playerDetailsLoading } = useQuery<
    PlayerDetailsQuery,
    PlayerDetailsQueryVariables
  >(PLAYER_DETAILS_QUERY, {
    variables: {
      slug,
    },
  });
  const {
    data: fixtureScoresData,
    loading: fixtureScoresLoading,
    loadMore,
  } = usePaginatedQuery<FixtureScoresQuery, FixtureScoresQueryVariables>(
    FIXTURE_SCORES_QUERY,
    {
      variables: {
        slug,
        ...(card ? { position: card.position } : {}),
      },
      connection: 'So5ScoreConnection',
      nextFetchPolicy: 'cache-first',
      fetchPolicy: 'cache-and-network',
    }
  );

  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, {
        slug: slug!,
        cursor:
          fixtureScoresData?.football.player.allSo5Scores.pageInfo.endCursor,
        ...(card ? { position: card.position } : {}),
      });
    }, [
      card,
      slug,
      loadMore,
      fixtureScoresData?.football.player.allSo5Scores.pageInfo.endCursor,
    ]),
    fixtureScoresData?.football.player.allSo5Scores.pageInfo.hasNextPage ||
      false,
    fixtureScoresLoading
  );

  if (playerDetailsLoading || !(playerDetailsData && fixtureScoresData)) {
    return (
      <Root>
        <LoadingIndicator fullHeight />
      </Root>
    );
  }

  const upcomingGames = [
    ...(playerDetailsData?.football.player.activeClub?.upcomingGames || []),
    ...(playerDetailsData?.football.player.activeNationalTeam?.upcomingGames ||
      []),
  ];
  return (
    <Root>
      <CloseButtonWrapper>
        <CloseButton onClose={onClose} />
      </CloseButtonWrapper>
      <PlayerProperties
        player={playerDetailsData.football.player}
        pictureUrl={pictureUrl}
        card={card}
        showCardBonusIndicator={showCardBonusIndicator}
      />
      <PlayerUnavailabilityPanel player={playerDetailsData.football.player} />
      <LastScores
        lastFiveSo5AverageScore={
          fixtureScoresData?.football.player.lastFiveSo5AverageScore
        }
        lastFifteenSo5AverageScore={
          fixtureScoresData?.football.player.lastFifteenSo5AverageScore
        }
        player={fixtureScoresData?.football.player}
        so5Scores={fixtureScoresData?.football.player.allSo5Scores.nodes}
        InfiniteScrollLoader={<InfiniteScrollLoader />}
      />
      <PlayerUpcomingGames games={upcomingGames} />
    </Root>
  );
};

PlayerDetails.fragments = {
  card: gql`
    fragment PlayerDetails_card on Card {
      slug
      assetId
      position: positionTyped
      ...PlayerProperties_card
    }
    ${PlayerProperties.fragments.card}
  `,
};

export default PlayerDetails;

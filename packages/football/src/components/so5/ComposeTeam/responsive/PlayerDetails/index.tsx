import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode, useCallback } from 'react';
import styled from 'styled-components';

import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';

import LastScores from '@football/components/stats/LastScores';

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
const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--unit);
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
    #football {
      player(slug: $slug) {
        slug
        lastFiveVicc5AverageScore: averageScore(
          type: LAST_FIVE_VICC5_AVERAGE_SCORE
          position: $position
        )
        lastFifteenVicc5AverageScore: averageScore(
          type: LAST_FIFTEEN_VICC5_AVERAGE_SCORE
          position: $position
        )
        allVicc5Scores(first: 10, after: $cursor, position: $position) {
          nodes {
            id
            ...LastScores_vicc5Score
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
        ...LastScores_player
      }
    #}
  }
  ${LastScores.fragments.vicc5Score}
  ${LastScores.fragments.player}
` as TypedDocumentNode<FixtureScoresQuery, FixtureScoresQueryVariables>;

const PLAYER_DETAILS_QUERY = gql`
  query PlayerDetailsQuery($slug: String!) {
    #football {
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
    #}
  }
  ${PlayerUpcomingGames.fragments.game}
  ${PlayerProperties.fragments.player}
  ${PlayerUnavailabilityPanel.fragments.player}
` as TypedDocumentNode<PlayerDetailsQuery, PlayerDetailsQueryVariables>;

type Props = {
  slug: string;
  pictureUrl?: string | null;
  card?: PlayerDetails_card;
  onClose: () => void;
  showCardBonusIndicator?: boolean;
  budgetValue?: number;
  extraActions?: ReactNode;
};
const PlayerDetails = ({
  slug,
  pictureUrl,
  card,
  showCardBonusIndicator = true,
  onClose,
  extraActions,
  budgetValue,
}: Props) => {
  const { data: playerDetailsData, loading: playerDetailsLoading } = useQuery(
    PLAYER_DETAILS_QUERY,
    {
      variables: {
        slug,
      },
    }
  );
  const {
    data: fixtureScoresData,
    loading: fixtureScoresLoading,
    loadMore,
  } = usePaginatedQuery(FIXTURE_SCORES_QUERY, {
    variables: {
      slug,
      ...(card ? { position: card.position } : {}),
    },
    connection: 'Vicc5ScoreConnection',
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, {
        slug: slug!,
        cursor:
          fixtureScoresData?.football.player.allVicc5Scores.pageInfo.endCursor,
        ...(card ? { position: card.position } : {}),
      });
    }, [
      card,
      slug,
      loadMore,
      fixtureScoresData?.football.player.allVicc5Scores.pageInfo.endCursor,
    ]),
    fixtureScoresData?.football.player.allVicc5Scores.pageInfo.hasNextPage ||
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
        budgetValue={budgetValue}
        showCardBonusIndicator={showCardBonusIndicator}
      />
      {extraActions && <Actions>{extraActions}</Actions>}
      <PlayerUnavailabilityPanel player={playerDetailsData.football.player} />
      <LastScores
        lastFiveVicc5AverageScore={
          fixtureScoresData?.football.player.lastFiveVicc5AverageScore
        }
        lastFifteenVicc5AverageScore={
          fixtureScoresData?.football.player.lastFifteenVicc5AverageScore
        }
        player={fixtureScoresData?.football.player}
        vicc5Scores={fixtureScoresData?.football.player.allVicc5Scores.nodes}
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
  ` as TypedDocumentNode<PlayerDetails_card>,
};

export default PlayerDetails;

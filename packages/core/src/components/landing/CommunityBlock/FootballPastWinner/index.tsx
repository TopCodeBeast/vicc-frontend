import { TypedDocumentNode, gql } from '@apollo/client';

import { DumbPastWinner } from '@core/components/landing/CommunityBlock/DumbPastWinner';
import idFromObject from '@core/gql/idFromObject';
import useQuery from '@core/hooks/graphql/useQuery';

import {
  FootballPastLeaderboardQuery,
  FootballPastLeaderboardQueryVariables,
  FootballPastLeaderboardSlugQuery,
  FootballPastLeaderboardSlugQueryVariables,
  FootballPastLineupWinnerQuery,
  FootballPastLineupWinnerQueryVariables,
} from './__generated__/index.graphql';

const FOOTBALL_PAST_LEADERBOARD_SLUG_QUERY = gql`
  query FootballPastLeaderboardSlugQuery {
    football {
      so5 {
        so5Fixture(type: PAST) {
          slug
          displayName
          so5Leaderboards {
            slug
          }
        }
      }
    }
  }
` as TypedDocumentNode<
  FootballPastLeaderboardSlugQuery,
  FootballPastLeaderboardSlugQueryVariables
>;

const FOOTBALL_PAST_LEADERBOARD_QUERY = gql`
  query FootballPastLeaderboardQuery($leaderboardSlug: String!) {
    football {
      so5 {
        so5Leaderboard(slug: $leaderboardSlug) {
          slug
          displayName
          svgLogoUrl
          mainRarityType
          so5LineupsCount
          so5Rankings(first: 1) {
            nodes {
              score
              ranking
              so5Lineup {
                id
              }
            }
          }
        }
      }
    }
  }
` as TypedDocumentNode<
  FootballPastLeaderboardQuery,
  FootballPastLeaderboardQueryVariables
>;
const FOOTBALL_PAST_LINEUP_WINNER_QUERY = gql`
  query FootballPastLineupWinnerQuery($lineupId: ID!) {
    football {
      so5 {
        so5Lineup(id: $lineupId) {
          so5Appearances {
            card {
              slug
              assetId
              pictureUrl
            }
          }
          user {
            slug
            nickname
            profile {
              id
              pictureUrl
            }
          }
        }
      }
    }
  }
` as TypedDocumentNode<
  FootballPastLineupWinnerQuery,
  FootballPastLineupWinnerQueryVariables
>;

type Props = {
  leaderboardSlug: string;
};

export const FootballPastWinner = ({ leaderboardSlug }: Props) => {
  const { data: slugData } = useQuery(FOOTBALL_PAST_LEADERBOARD_SLUG_QUERY);
  const lastLeaderboard =
    slugData?.football.so5.so5Fixture?.so5Leaderboards.find(leaderboard =>
      leaderboard.slug.includes(leaderboardSlug)
    );

  const { data: leaderboardData } = useQuery(FOOTBALL_PAST_LEADERBOARD_QUERY, {
    skip: !lastLeaderboard?.slug,
    variables: { leaderboardSlug: lastLeaderboard?.slug ?? '' },
  });

  const leaderboardDataSimplified =
    leaderboardData?.football.so5.so5Leaderboard;

  const lineupId =
    leaderboardDataSimplified?.so5Rankings.nodes[0]?.so5Lineup?.id;

  const { data: lineupData } = useQuery(FOOTBALL_PAST_LINEUP_WINNER_QUERY, {
    skip: !idFromObject(lineupId),
    variables: { lineupId: idFromObject(lineupId)! },
  });

  const lineupDataSimplified = lineupData?.football.so5.so5Lineup;

  if (!lineupDataSimplified || !leaderboardDataSimplified?.so5LineupsCount)
    return null;
  return (
    <DumbPastWinner
      cards={lineupDataSimplified.so5Appearances.map(card => ({
        imageUrl: card.card.pictureUrl,
      }))}
      leaderboardIconUrl={leaderboardDataSimplified.svgLogoUrl}
      leaderboardName={leaderboardDataSimplified.displayName}
      leaderboardRarity={leaderboardDataSimplified.mainRarityType}
      lineupsCount={leaderboardDataSimplified.so5LineupsCount}
      winner={{
        nickname: lineupDataSimplified.user.nickname,
        avatarUrl: lineupDataSimplified.user.profile.pictureUrl,
      }}
      score={leaderboardDataSimplified.so5Rankings.nodes[0].score}
    />
  );
};

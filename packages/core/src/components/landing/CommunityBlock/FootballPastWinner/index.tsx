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
    #football {
      vicc5Root {
        vicc5Fixture(type: PAST) {
          slug
          displayName
          vicc5Leaderboards {
            slug
          }
        }
      }
    #}
  }
` as TypedDocumentNode<
  FootballPastLeaderboardSlugQuery,
  FootballPastLeaderboardSlugQueryVariables
>;

const FOOTBALL_PAST_LEADERBOARD_QUERY = gql`
  query FootballPastLeaderboardQuery($leaderboardSlug: String!) {
    #football {
      vicc5Root {
        vicc5Leaderboard(slug: $leaderboardSlug) {
          slug
          displayName
          svgLogoUrl
          mainRarityType
          vicc5LineupsCount
          vicc5Rankings(first: 1) {
            nodes {
              score
              ranking
              vicc5Lineup {
                id
              }
            }
          }
        }
      }
    #}
  }
` as TypedDocumentNode<
  FootballPastLeaderboardQuery,
  FootballPastLeaderboardQueryVariables
>;
const FOOTBALL_PAST_LINEUP_WINNER_QUERY = gql`
  query FootballPastLineupWinnerQuery($lineupId: ID!) {
    #football {
      vicc5Root {
        vicc5Lineup(id: $lineupId) {
          vicc5Appearances {
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
    #}
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
    slugData?.vicc5.vicc5Fixture?.vicc5Leaderboards.find(leaderboard =>
      leaderboard.slug.includes(leaderboardSlug)
    );

  const { data: leaderboardData } = useQuery(FOOTBALL_PAST_LEADERBOARD_QUERY, {
    skip: !lastLeaderboard?.slug,
    variables: { leaderboardSlug: lastLeaderboard?.slug ?? '' },
  });

  const leaderboardDataSimplified =
    leaderboardData?.vicc5.vicc5Leaderboard;

  const lineupId =
    leaderboardDataSimplified?.vicc5Rankings.nodes[0]?.vicc5Lineup?.id;

  const { data: lineupData } = useQuery(FOOTBALL_PAST_LINEUP_WINNER_QUERY, {
    skip: !idFromObject(lineupId),
    variables: { lineupId: idFromObject(lineupId)! },
  });

  const lineupDataSimplified = lineupData?.vicc5.vicc5Lineup;

  if (!lineupDataSimplified || !leaderboardDataSimplified?.vicc5LineupsCount)
    return null;
  return (
    <DumbPastWinner
      cards={lineupDataSimplified.vicc5Appearances.map(card => ({
        imageUrl: card.card.pictureUrl,
      }))}
      leaderboardIconUrl={leaderboardDataSimplified.svgLogoUrl}
      leaderboardName={leaderboardDataSimplified.displayName}
      leaderboardRarity={leaderboardDataSimplified.mainRarityType}
      lineupsCount={leaderboardDataSimplified.vicc5LineupsCount}
      winner={{
        nickname: lineupDataSimplified.user.nickname,
        avatarUrl: lineupDataSimplified.user.profile.pictureUrl,
      }}
      score={leaderboardDataSimplified.vicc5Rankings.nodes[0].score}
    />
  );
};

import { DumbPastWinner } from '@core/components/landing/NewLandingMultiSport/CommunityBlock/DumbPastWinner';
import { ACTUAL_ENV } from 'config';
import { useUSSportsQuery } from '@core/hooks/graphql/useUSSportsQuery';
import { NBAPastWinnerQuery } from '@core/lib/usSportsGraphql/__generated__/queries.graphql';
import { NBA_PAST_WINNER_QUERY } from '@core/lib/usSportsGraphql/queries';

type Props = {
  leaderboardSlug: string;
};

export const NBAPastWinner = ({ leaderboardSlug }: Props) => {
  const { data } = useUSSportsQuery<NBAPastWinnerQuery>(NBA_PAST_WINNER_QUERY, {
    skip: ACTUAL_ENV === 'mockprod',
  });

  const lastLeaderboard = data?.nbaPastFixtures.nodes[0]?.leaderboards?.find(
    leaderboard => leaderboard.slug.includes(leaderboardSlug)
  );

  if (!lastLeaderboard) return null;
  const winner = lastLeaderboard.lineups.nodes[0];
  return (
    <DumbPastWinner
      leaderboardIconUrl={lastLeaderboard.iconImageUrl}
      leaderboardName={lastLeaderboard.displayName}
      leaderboardRarity={lastLeaderboard.leaderboardRarity}
      lineupsCount={lastLeaderboard.lineupsCount}
      winner={{
        nickname: winner?.user?.nickname,
        avatarUrl: winner?.user?.avatarUrl,
      }}
      score={winner?.score}
      cards={winner?.cards.map(card => ({
        imageUrl: card.card.fullImageUrl,
      }))}
    />
  );
};

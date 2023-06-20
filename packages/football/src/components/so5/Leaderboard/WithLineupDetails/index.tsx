import { gql } from '@apollo/client';
import { useState } from 'react';

import Row from '@sorare/football/src/components/so5/Leaderboard/Row';
import { Leaderboard } from '@sorare/football/src/components/so5/Leaderboard/index';
import So5LineupDetails from '@sorare/football/src/components/so5/So5LineupDetails';

import { Leaderboard_so5Rankings } from './__generated__/index.graphql';

interface Props {
  rankings: Leaderboard_so5Rankings[];
  myRanking?: Leaderboard_so5Rankings;
  onlyFollowed?: boolean;
}

export const LeaderboardWithLineupDetails = ({
  rankings,
  myRanking,
  onlyFollowed,
}: Props) => {
  const [rankingId, setRankingId] = useState<string | null>(null);
  return (
    <>
      <Leaderboard
        Row={Row}
        onRowClick={ranking => setRankingId(ranking?.id || null)}
        isMe={item => item.id === myRanking?.id}
        rankings={rankings}
        myRanking={myRanking}
        onlyFollowed={onlyFollowed}
      />
      <So5LineupDetails
        so5RankingId={rankingId}
        onClose={() => setRankingId(null)}
      />
    </>
  );
};

LeaderboardWithLineupDetails.fragments = {
  so5Ranking: gql`
    fragment Leaderboard_so5Rankings on So5Ranking {
      id
      ...Row_so5Ranking
    }
    ${Row.fragments.so5Ranking}
  `,
};

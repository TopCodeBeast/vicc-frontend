import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';

import Row from '@football/components/so5/Leaderboard/Row';
import { Leaderboard } from '@football/components/so5/Leaderboard/index';
import Vicc5LineupDetails from '@football/components/so5/So5LineupDetails';

import { Leaderboard_vicc5Rankings } from './__generated__/index.graphql';

interface Props {
  rankings: Leaderboard_vicc5Rankings[];
  myRanking?: Leaderboard_vicc5Rankings;
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
      <Vicc5LineupDetails
        vicc5RankingId={rankingId}
        onClose={() => setRankingId(null)}
      />
    </>
  );
};

LeaderboardWithLineupDetails.fragments = {
  vicc5Ranking: gql`
    fragment Leaderboard_vicc5Rankings on Vicc5Ranking {
      id
      ...Row_vicc5Ranking
    }
    ${Row.fragments.vicc5Ranking}
  ` as TypedDocumentNode<Leaderboard_vicc5Rankings>,
};

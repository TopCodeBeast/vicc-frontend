import { TypedDocumentNode, gql } from '@apollo/client';
import { useMemo, useState } from 'react';

import { Leaderboard as BaseLeaderboard } from '@football/components/so5/Leaderboard/index';
import Vicc5LineupDetails from '@football/components/so5/So5LineupDetails';

import LeaderboardHeader from './Header';
import Row from './Row';
import {
  Leaderboard_membership,
  Leaderboard_vicc5Memberships,
} from './__generated__/index.graphql';

const toRanking = (membership: Membership) => ({
  ...membership,
  id: membership.user.id,
  liveScore: membership.liveVicc5Ranking?.score || 0,
});

type MyMembership = Leaderboard_vicc5Memberships['myMembership'];
type Membership =
  Leaderboard_vicc5Memberships['membershipsPaginated']['memberships'][number];
type Props = {
  myMembership?: MyMembership | null;
  memberships?: Membership[];
};
const UserGroupLeaderboard = ({ myMembership, memberships }: Props) => {
  const [myRanking, rankings] = useMemo(() => {
    return [
      myMembership ? toRanking(myMembership) : undefined,
      (memberships || []).map(toRanking),
    ];
  }, [myMembership, memberships]);
  const [rankingId, setRankingId] = useState<string | null>(null);
  return (
    <div>
      <LeaderboardHeader />
      <BaseLeaderboard
        Row={Row as any}
        onRowClick={manager => {
          const liveRankingId = manager?.liveVicc5Ranking?.id;
          if (liveRankingId) {
            setRankingId(liveRankingId);
          }
        }}
        rankings={rankings}
        myRanking={myRanking}
        isMe={ranking => ranking?.user?.id === myRanking?.id}
      />
      <Vicc5LineupDetails
        vicc5RankingId={rankingId}
        onClose={() => setRankingId(null)}
      />
    </div>
  );
};

const membershipFragment = gql`
  fragment Leaderboard_membership on Vicc5UserGroupMembership {
    id
    score
    liveVicc5Ranking {
      id
      score
    }
    ...Row_vicc5UserGroupMembership
    ranking
    user {
      slug
      id
      ...Row_user
    }
  }
  ${Row.fragments.user}
  ${Row.fragments.vicc5UserGroupMembership}
` as TypedDocumentNode<Leaderboard_membership>;

UserGroupLeaderboard.fragments = {
  vicc5Memberships: gql`
    fragment Leaderboard_vicc5Memberships on Vicc5UserGroup {
      slug
      myMembership {
        id
        ...Leaderboard_membership
      }
      membershipsPaginated(page: $page) {
        totalCount
        currentPage
        pages
        memberships {
          id
          ...Leaderboard_membership
        }
      }
    }
    ${membershipFragment}
  ` as TypedDocumentNode<Leaderboard_vicc5Memberships>,
};

export default UserGroupLeaderboard;

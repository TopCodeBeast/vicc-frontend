import { TypedDocumentNode, gql } from '@apollo/client';
import { useMemo, useState } from 'react';

import { Leaderboard as BaseLeaderboard } from '@football/components/so5/Leaderboard/index';
import So5LineupDetails from '@football/components/so5/So5LineupDetails';

import LeaderboardHeader from './Header';
import Row from './Row';
import {
  Leaderboard_membership,
  Leaderboard_so5Memberships,
} from './__generated__/index.graphql';

const toRanking = (membership: Membership) => ({
  ...membership,
  id: membership.user.id,
  liveScore: membership.liveSo5Ranking?.score || 0,
});

type MyMembership = Leaderboard_so5Memberships['myMembership'];
type Membership =
  Leaderboard_so5Memberships['membershipsPaginated']['memberships'][number];
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
          const liveRankingId = manager?.liveSo5Ranking?.id;
          if (liveRankingId) {
            setRankingId(liveRankingId);
          }
        }}
        rankings={rankings}
        myRanking={myRanking}
        isMe={ranking => ranking?.user?.id === myRanking?.id}
      />
      <So5LineupDetails
        so5RankingId={rankingId}
        onClose={() => setRankingId(null)}
      />
    </div>
  );
};

const membershipFragment = gql`
  fragment Leaderboard_membership on So5UserGroupMembership {
    id
    score
    liveSo5Ranking {
      id
      score
    }
    ...Row_so5UserGroupMembership
    ranking
    user {
      slug
      id
      ...Row_user
    }
  }
  ${Row.fragments.user}
  ${Row.fragments.so5UserGroupMembership}
` as TypedDocumentNode<Leaderboard_membership>;

UserGroupLeaderboard.fragments = {
  so5Memberships: gql`
    fragment Leaderboard_so5Memberships on So5UserGroup {
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
  ` as TypedDocumentNode<Leaderboard_so5Memberships>,
};

export default UserGroupLeaderboard;

import { gql } from '@apollo/client';
import { useMemo, useState } from 'react';

import { Leaderboard } from '@sorare/football/src/components/so5/Leaderboard/index';
import So5LineupDetails from '@sorare/football/src/components/so5/So5LineupDetails';

import UserGroupLeaderboardHeader from './Header';
import Row from './Row';
import { UserGroupLeaderboard_so5Memberships } from './__generated__/index.graphql';

type Membership =
  UserGroupLeaderboard_so5Memberships['membershipsPaginated']['memberships'][number];

type MyMembership = UserGroupLeaderboard_so5Memberships['myMembership'];

type Props = {
  myMembership?: MyMembership | null;
  memberships?: Membership[];
};

const toRanking = (membership: Membership) => ({
  ...membership,
  id: membership.user.id,
  liveScore: membership.liveSo5Ranking?.score || 0,
});

export const UserGroupLeaderboard = ({ myMembership, memberships }: Props) => {
  const [myRanking, rankings] = useMemo(() => {
    return [
      myMembership ? toRanking(myMembership) : undefined,
      (memberships || []).map(toRanking),
    ];
  }, [myMembership, memberships]);
  const [rankingId, setRankingId] = useState<string | null>(null);
  return (
    <div>
      <UserGroupLeaderboardHeader />
      <Leaderboard
        Row={Row}
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
  fragment UserGroupLeaderboard_membership on So5UserGroupMembership {
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
`;

UserGroupLeaderboard.fragments = {
  so5Memberships: gql`
    fragment UserGroupLeaderboard_so5Memberships on So5UserGroup {
      slug
      myMembership {
        id
        ...UserGroupLeaderboard_membership
      }
      membershipsPaginated(page: $page) {
        totalCount
        currentPage
        pages
        memberships {
          id
          ...UserGroupLeaderboard_membership
        }
      }
    }
    ${membershipFragment}
  `,
};

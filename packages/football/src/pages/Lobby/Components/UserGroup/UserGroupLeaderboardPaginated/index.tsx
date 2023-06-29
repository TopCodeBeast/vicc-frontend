import { gql } from '@apollo/client';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import Pagination from '@sorare/core/src/atoms/navigation/Pagination';

import { Leaderboard } from '@football/components/so5/Leaderboard';
import UserGroupLeaderboardHeader from '@football/components/so5/Leaderboard/UserGroupLeaderboard/Header';
import Row from '@football/components/so5/Leaderboard/UserGroupLeaderboard/Row';
import So5LineupDetails from '@football/components/so5/So5LineupDetails';

import { UserGroupLeaderboardPaginated_so5UserGroup as UserGroup } from './__generated__/index.graphql';

type Membership = NonNullable<UserGroup['myMembership']>;

const LeaderboardContent = styled.div`
  text-align: center;
`;
const Footer = styled.div`
  position: relative;
  display: inline-flex;
  align-self: center;
  margin-top: var(--double-unit);
`;

type Props = {
  group: UserGroup | undefined;
  loading: boolean;
  onChangePage: ({ leaderboardPage }: { leaderboardPage: string }) => void;
};

const toRanking = (membership: Membership) => ({
  ...membership,
  id: membership.user.id,
  liveScore: membership.liveSo5Ranking?.score || 0,
});

const UserGroupLeaderboardPaginated = ({
  group,
  loading,
  onChangePage,
}: Props) => {
  const membershipsPaginated = group?.membershipsPaginated;
  const currentPage = membershipsPaginated?.currentPage || 0;
  const pages = membershipsPaginated?.pages || 0;
  const [myRanking, rankings] = useMemo(() => {
    const memberships = membershipsPaginated?.memberships || [];
    return [
      group?.myMembership ? toRanking(group?.myMembership) : undefined,
      memberships.map(toRanking),
    ];
  }, [group?.myMembership, membershipsPaginated?.memberships]);
  const [rankingId, setRankingId] = useState<string | null>(null);

  return (
    <>
      <UserGroupLeaderboardHeader />
      <LeaderboardContent>
        {group && (
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
        )}
        <So5LineupDetails
          so5RankingId={rankingId}
          onClose={() => setRankingId(null)}
        />
        <Footer>
          <Pagination
            currentPage={currentPage}
            pages={pages}
            onSelect={p => onChangePage({ leaderboardPage: `${p}` })}
            inputPagination
          />
          {loading && <LoadingIndicator small />}
        </Footer>
      </LeaderboardContent>
    </>
  );
};

UserGroupLeaderboardPaginated.fragments = {
  so5UserGroup: gql`
    fragment UserGroupLeaderboardPaginated_so5UserGroup on So5UserGroup {
      slug
      id
      membershipsPaginated(page: $page) {
        currentPage
        pages
        memberships {
          id
          ...Row_so5UserGroupMembership
          liveSo5Ranking {
            id
            score
          }
          user {
            slug
            id
            ...Row_user
          }
        }
      }
      myMembership {
        id
        ...Row_so5UserGroupMembership
        liveSo5Ranking {
          id
          score
        }
        user {
          slug
          id
          ...Row_user
        }
      }
    }
    ${Row.fragments.user}
    ${Row.fragments.so5UserGroupMembership}
  `,
};

export default UserGroupLeaderboardPaginated;

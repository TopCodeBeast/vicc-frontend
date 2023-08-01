import { gql } from '@apollo/client/core';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import Pagination from '@sorare/core/src/atoms/navigation/Pagination';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { useQueryState } from '@sorare/core/src/hooks/useQueryState';

import useRemoveSo5UserFromGroup from '@football/pages/Lobby/Components/UserGroup/UserGroupDetails/useRemoveSo5UserFromGroup';
import Banner from '@football/pages/Lobby/Components/UserGroup/UserGroupInvitation/Banner';

import MemberRow from './MemberRow';
import RemoveUserDialog from './RemoveUserDialog';
import { GetUserGroupMembersTabQuery } from './__generated__/index.graphql';

type User =
  GetUserGroupMembersTabQuery['football']['so5']['so5UserGroup']['membershipsPaginated']['memberships'][number]['user'];

const InviteBanner = styled.div`
  margin: var(--triple-unit) 0;
`;
const Memberships = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  width: 100%;
`;
const Footer = styled.div`
  margin-top: var(--double-unit);
`;

const GET_USERGROUP_MEMBERS_QUERY = gql`
  query GetUserGroupMembersTabQuery($slug: String!, $page: Int) {
    so5: vicc5Root {
      so5UserGroup: vicc5UserGroup(slug: $slug) {
        id
        slug
        displayName
        administrator {
          slug
          id
          ...Avatar_publicUserInfoInterface
        }
        membershipsPaginated(page: $page) {
          totalCount
          currentPage
          pages
          memberships {
            id
            administrator
            createdAt
            user {
              slug
              id
              ...MemberRow_user
            }
          }
        }
        so5TournamentType: vicc5TournamentType {
          id
          so5LeaderboardType: vicc5LeaderboardType
        }
      }
    }
  }
  ${MemberRow.fragments.user}
`;

type Props = { slug: string; joinSecret: string; joinDisabled: boolean };

const UserGroupDetailsMembers = ({ slug, joinSecret, joinDisabled }: Props) => {
  const [{ membersPage: page = 0 }, onChangePage] = useQueryState({
    membersPage: undefined as string | undefined,
  });

  const [admin, setAdmin] = useState<User | null>(null);
  const { currentUser } = useCurrentUserContext();
  const removeSo5UserFromGroup = useRemoveSo5UserFromGroup();
  const { formatDate } = useIntlContext();
  const [userToRemove, setUserToRemove] = useState<User | null>(null);

  const { data, loading, refetch } = useQuery<GetUserGroupMembersTabQuery>(
    GET_USERGROUP_MEMBERS_QUERY,
    {
      variables: { slug, page: +page },
    }
  );

  useEffect(() => {
    if (!admin && data?.football.so5.so5UserGroup?.administrator) {
      setAdmin(data?.football.so5.so5UserGroup?.administrator);
    }
  }, [admin, data]);

  const group = data?.football.so5.so5UserGroup;
  const so5UserGroupId = group?.id || '';
  const currentPage = group?.membershipsPaginated?.currentPage || 0;
  const pages = group?.membershipsPaginated?.pages || 0;
  const memberships = group?.membershipsPaginated?.memberships || [];
  const so5LeaderboardType = group?.so5TournamentType?.so5LeaderboardType;
  const isAdmin = currentUser?.id === admin?.id;

  const removeMembership = useCallback(() => {
    if (group?.id && userToRemove) {
      removeSo5UserFromGroup(
        {
          userId: userToRemove.id,
          so5UserGroupId: group?.id,
        },
        userToRemove.nickname
      ).then(() => {
        setUserToRemove(null);
        refetch();
      });
    }
  }, [group, userToRemove, refetch, removeSo5UserFromGroup]);

  return (
    <>
      {!joinDisabled && (
        <InviteBanner>
          <Banner
            joinSecret={joinSecret}
            so5UserGroupId={so5UserGroupId}
            so5LeaderboardType={so5LeaderboardType}
          />
        </InviteBanner>
      )}
      <Memberships>
        {admin && (
          <MemberRow admin user={admin} isAdmin={isAdmin} isMe={isAdmin} />
        )}
        {group && (
          <>
            {memberships.map(
              ({ id, administrator, user, createdAt }) =>
                !administrator && (
                  <MemberRow
                    key={id}
                    user={user}
                    isAdmin={isAdmin}
                    isMe={currentUser?.id === user.id}
                    date={formatDate(createdAt, {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    })}
                    onDeleteButtonClick={() => setUserToRemove(user)}
                  />
                )
            )}
            <Footer>
              <Pagination
                currentPage={currentPage}
                pages={pages}
                onSelect={p => onChangePage({ membersPage: `${p}` })}
                inputPagination
              />
            </Footer>
            <RemoveUserDialog
              userToRemove={userToRemove}
              groupName={group?.displayName}
              onConfirm={removeMembership}
              onClose={() => setUserToRemove(null)}
            />
          </>
        )}
      </Memberships>
      {loading && <LoadingIndicator style={{ marginTop: 50 }} small />}
    </>
  );
};

export default UserGroupDetailsMembers;

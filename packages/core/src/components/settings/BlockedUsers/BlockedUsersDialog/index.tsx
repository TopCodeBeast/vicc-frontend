import { gql } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import LoadMoreButton from '@core/atoms/buttons/LoadMoreButton';
import Dialog from '@core/atoms/layout/Dialog';
import { Text16, Title5 } from '@core/atoms/typography';
import Avatar from '@core/components/user/Avatar';
import { Nickname } from '@core/components/user/Nickname';
import { extractConnectionData } from '@core/gql/extractData';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useCurrentUserPaginatedQuery from '@core/hooks/graphql/useCurrentUserPaginatedQuery';

import {
  BlockedUsersQuery,
  BlockedUsersQueryVariables,
} from './__generated__/index.graphql';
import useUnblockUser from './useUnblockUser';

type BlockedUsersQuery_currentUser_blockedUsers_nodes = NonNullable<
  BlockedUsersQuery['currentUser']
>['blockedUsers']['nodes'][number];

const messages = defineMessages({
  title: {
    id: 'Settings.blockedUsers.dialog.title',
    defaultMessage: 'Blocked Managers',
  },
  cta: {
    id: 'Settings.blockedUsers.dialog.cta',
    defaultMessage: 'Unblock',
  },
  empty: {
    id: 'Settings.blockedUsers.dialog.empty',
    defaultMessage: 'No blocked manager.',
  },
});

const BLOCKED_USERS_QUERY = gql`
  query BlockedUsersQuery($cursor: String) {
    currentUser {
      slug
      blockedUsers(first: 10, after: $cursor) {
        nodes {
          slug
          nickname
          #...Avatar_publicUserInfoInterface
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  #{Avatar.fragments.publicUserInfoInterface}
`;

const Line = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;
const StyledNickname = styled(Text16)`
  flex-grow: 1;
`;

const BlockedUser = ({
  user,
  removeBlockedUser,
}: {
  user: BlockedUsersQuery_currentUser_blockedUsers_nodes;
  removeBlockedUser: (
    user: BlockedUsersQuery_currentUser_blockedUsers_nodes
  ) => Promise<void>;
}) => {
  return (
    <Line>
      <Avatar user={user} />
      <StyledNickname bold>
        <Nickname user={user} />
      </StyledNickname>
      <Button
        onClick={() => {
          removeBlockedUser(user);
        }}
        small
        color="darkGray"
      >
        <FormattedMessage {...messages.cta} />
      </Button>
    </Line>
  );
};

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const LoadMore = styled.div`
  text-align: center;
`;

const BlockedUsersDialog = ({ onClose }: { onClose: () => void }) => {
  const { unblockUser } = useUnblockUser();
  const { up: isTablet } = useScreenSize('tablet');
  const { loading, data, loadMore } = useCurrentUserPaginatedQuery<
    'UserConnection',
    'blockedUsers',
    BlockedUsersQuery,
    BlockedUsersQueryVariables
  >(BLOCKED_USERS_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    connection: 'UserConnection',
  });

  const removeBlockedUser = useCallback(
    async (user: BlockedUsersQuery_currentUser_blockedUsers_nodes) => {
      await unblockUser({
        variables: {
          input: {
            userSlug: user.slug,
          },
        },
        update: cache => {
          const dataFromCache = cache.readQuery<BlockedUsersQuery>({
            query: BLOCKED_USERS_QUERY,
          });
          const updatedData = dataFromCache?.currentUser?.blockedUsers && {
            ...dataFromCache,
            currentUser: {
              ...dataFromCache.currentUser,
              blockedUsers: {
                ...dataFromCache.currentUser.blockedUsers,
                nodes: dataFromCache.currentUser.blockedUsers.nodes.filter(
                  u => u.slug !== user.slug
                ),
              },
            },
          };
          cache.writeQuery({
            query: BLOCKED_USERS_QUERY,
            data: updatedData,
          });
          return cache;
        },
      });
    },
    [unblockUser]
  );

  const { items, cursor, hasMore } = useMemo(
    () =>
      extractConnectionData(data?.currentUser?.blockedUsers, user => (
        <BlockedUser user={user} removeBlockedUser={removeBlockedUser} />
      )),
    [data?.currentUser?.blockedUsers, removeBlockedUser]
  );

  return (
    <Dialog
      open
      onClose={onClose}
      headerCentered
      fullScreen={!isTablet}
      title={
        <Title5>
          <FormattedMessage {...messages.title} />
        </Title5>
      }
    >
      <Items>
        {items && items?.length > 0 && items}
        {!loading && items && items?.length === 0 && (
          <Text16 color="var(--c-neutral-800)">
            <FormattedMessage {...messages.empty} />
          </Text16>
        )}
        {hasMore && (
          <LoadMore>
            <LoadMoreButton
              medium
              color="blue"
              hasMore={hasMore}
              loading={loading}
              loadMore={() => {
                loadMore(false, { cursor });
              }}
            />
          </LoadMore>
        )}
      </Items>
    </Dialog>
  );
};

export default BlockedUsersDialog;

import { gql } from '@apollo/client';
import { parse } from 'qs';
import { defineMessages, useIntl } from 'react-intl';

import StyledSecondaryTabs from '@sorare/core/src/atoms/navigation/StyledSecondaryTabs';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

import useNetworkTabPath from '@football/hooks/useNetworkTabPath';

import Followers from './Followers';
import Following from './Following';
import Recommended from './Recommended';
import { Network_user } from './__generated__/index.graphql';

const tabs = ['recommended', 'followers', 'following'] as const;
type Tab = (typeof tabs)[number];

const messages = defineMessages<Tab>({
  recommended: {
    id: 'Network.recommended',
    defaultMessage: 'Recommended',
  },
  following: {
    id: 'Network.following',
    defaultMessage: 'Following {following}',
  },
  followers: {
    id: 'Network.followers',
    defaultMessage: 'Followers {followers}',
  },
});

type Props = {
  user: Network_user;
};

export const Network = ({ user }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const qsParams = parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  const { formatMessage } = useIntl();
  const path = useNetworkTabPath(user);

  if (!user) return null;
  const actualTabs = tabs.filter(
    t => user.slug === currentUser?.slug || t !== 'recommended'
  );
  const tab = tabs.includes((qsParams.tab as Tab)) //*************Modifed */
    ? `${qsParams.tab}`
    : tabs[0];

  return (
    <div>
      <StyledSecondaryTabs
        items={actualTabs.map(t => ({
          to: path(t),
          label: formatMessage(messages[t], {
            following: user.followingCount,
            followers: user.followersCount,
          }),
          active: tab === t,
        }))}
      />
      {tab === 'recommended' && <Recommended />}
      {tab === 'following' && <Following user={user} />}
      {tab === 'followers' && <Followers user={user} />}
    </div>
  );
};

Network.fragments = {
  user: gql`
    fragment Network_user on PublicUserInfoInterface {
      slug
      followingCount
      followersCount
    }
  `,
};

export default Network;

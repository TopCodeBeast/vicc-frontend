import { TypedDocumentNode, gql } from '@apollo/client';
import { parse } from 'qs';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import {
  Badge,
  ScrollableTabBar,
  Tab,
} from '@sorare/core/src/components/TabBar';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

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
    defaultMessage: '<span>Following</span> <b>{following}</b>',
  },
  followers: {
    id: 'Network.followers',
    defaultMessage: '<span>Followers</span> <b>{followers}</b>',
  },
});

const TabBarWrapper = styled.div`
  margin: 0 calc(-1 * var(--double-unit));
`;

type Props = {
  user: Network_user;
};

export const Network = ({ user }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const qsParams = parse(window.location.search, {
    ignoreQueryPrefix: true,
  });

  if (!user) return null;
  const actualTabs = tabs.filter(
    t => user.slug === currentUser?.slug || t !== 'recommended'
  );
  const tab = tabs.includes((qsParams.tab as Tab) || '')
    ? `${qsParams.tab}`
    : tabs[0];

  return (
    <div>
      <TabBarWrapper>
        <ScrollableTabBar value={tab} variant="secondary">
          {actualTabs.map(t => (
            <Tab key={t} value={t} to={`?tab=${t}`}>
              <FormattedMessage
                {...messages[t]}
                values={{
                  following: user.followingCount,
                  followers: user.followersCount,
                  b: (...chunks: string[]) => <Badge>{chunks}</Badge>,
                  span: (...chunks: string[]) => <span>{chunks}</span>,
                }}
              />
            </Tab>
          ))}
        </ScrollableTabBar>
      </TabBarWrapper>
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
  ` as TypedDocumentNode<Network_user>,
};

export default Network;

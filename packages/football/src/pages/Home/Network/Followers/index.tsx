import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback } from 'react';

import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import Template from '@football/pages/Home/Network/Template';

import {
  NetworkFollowersQuery,
  NetworkFollowersQueryVariables,
} from './__generated__/index.graphql';

const NETWORK_FOLLOWERS_QUERY = gql`
  query NetworkFollowersQuery($slug: String!, $after: String) {
    user(slug: $slug) {
      slug
      followers(first: 18, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          slug
          subscriptionSlug
          ...NetworkTemplate_user
        }
      }
    }
  }
  ${Template.fragments.user}
` as TypedDocumentNode<NetworkFollowersQuery, NetworkFollowersQueryVariables>;

type Props = {
  user: {
    slug: string;
  };
};

export const Followers = ({ user }: Props) => {
  const { loading, data, loadMore } = usePaginatedQuery(
    NETWORK_FOLLOWERS_QUERY,
    {
      variables: { slug: user.slug },
      connection: 'UserWithSubscriptionSlugConnection',
    }
  );

  const load = useCallback(() => {
    loadMore(false, {
      after: data?.user?.followers.pageInfo.endCursor,
      slug: user.slug,
    });
  }, [loadMore, data?.user?.followers.pageInfo.endCursor, user.slug]);

  return (
    <Template
      users={data?.user?.followers.nodes}
      loading={loading}
      loadMore={load}
      hasNextPage={data?.user?.followers.pageInfo.hasNextPage || false}
    />
  );
};

export default Followers;

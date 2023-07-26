import { gql } from '@apollo/client';
import { useCallback } from 'react';

import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import Template from '@football/pages/Home/Network/Template';

import {
  NetworkFollowingQuery,
  NetworkFollowingQueryVariables,
} from './__generated__/index.graphql';

const NETWORK_FOLLOWING_QUERY = gql`
  query NetworkFollowingQuery($slug: String!, $after: String) {
    user(slug: $slug) {
      slug
      following(first: 18, after: $after) {
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
`;

type Props = {
  user: {
    slug: string;
  };
};

export const Following = ({ user }: Props) => {
  const { loading, data, loadMore } = usePaginatedQuery<
    NetworkFollowingQuery,
    NetworkFollowingQueryVariables
  >(NETWORK_FOLLOWING_QUERY, {
    variables: { slug: user.slug },
    connection: 'UserWithSubscriptionSlugConnection',
  });

  const load = useCallback(() => {
    loadMore(false, {
      after: data?.user?.following.pageInfo.endCursor,
      slug: user.slug,
    });
  }, [loadMore, data?.user?.following.pageInfo.endCursor, user.slug]);

  return (
    <Template
      users={data?.user?.following.nodes}
      loading={loading}
      loadMore={load}
      hasNextPage={data?.user?.following.pageInfo.hasNextPage || false}
    />
  );
};

export default Following;

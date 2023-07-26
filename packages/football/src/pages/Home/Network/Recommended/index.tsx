import { gql } from '@apollo/client';
import { useCallback } from 'react';

import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import Template from '@football/pages/Home/Network/Template';

import {
  NetworkRecommendedQuery,
  NetworkRecommendedQueryVariables,
} from './__generated__/index.graphql';

const NETWORK_RECOMMENDED_QUERY = gql`
  query NetworkRecommendedQuery($after: String) {
    currentUser {
      slug
      recommendedManagers(first: 18, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          slug
          ...NetworkTemplate_user
        }
      }
    }
  }
  ${Template.fragments.user}
`;

export const Recommended = () => {
  const { loading, data, loadMore } = usePaginatedQuery<
    NetworkRecommendedQuery,
    NetworkRecommendedQueryVariables
  >(NETWORK_RECOMMENDED_QUERY, {
    connection: 'UserConnection',
  });

  const load = useCallback(() => {
    loadMore(false, {
      after: data?.currentUser?.recommendedManagers.pageInfo.endCursor,
    });
  }, [loadMore, data?.currentUser?.recommendedManagers.pageInfo.endCursor]);

  return (
    <Template
      users={data?.currentUser?.recommendedManagers.nodes}
      loading={loading}
      loadMore={load}
      hasNextPage={
        data?.currentUser?.recommendedManagers.pageInfo.hasNextPage || false
      }
    />
  );
};

export default Recommended;

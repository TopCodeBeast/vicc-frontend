import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@core/hooks/graphql/useQuery';

import {
  UsersCount,
  UsersCountVariables,
} from './__generated__/useUsersCount.graphql';

const QUERY = gql`
  query UsersCount {
    config {
      id
      counts {
        usersCount
        #football {
          starterPacksCount
          managerSalesCount
          auctionsCount
        }
      }
    #}
  }
` as TypedDocumentNode<UsersCount, UsersCountVariables>;

export default () => {
  const { data, loading } = useQuery(QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  return {
    counts: data?.config?.counts || {
      usersCount: 0,
      starterPacksCount: 0,
      managerSalesCount: 0,
      auctionsCount: 0,
    },
    loading,
  };
};

import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@core/hooks/graphql/useQuery';

import {
  NoCardRoute,
  NoCardRouteVariables,
} from './__generated__/useNoCardRoute.graphql';

const QUERY = gql`
  query NoCardRoute {
    config {
      id
      vicc5Config {
        id
        noCardRoute {
          id
          nextOpenDate
          nextCloseDate
        }
      }
    }
  }
` as TypedDocumentNode<NoCardRoute, NoCardRouteVariables>;

export default () => {
  const { data, loading } = useQuery(QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  return {
    noCardRoute: data?.config?.vicc5?.noCardRoute || {
      nextOpenDate: '',
      nextCloseDate: '',
    },
    loading,
  };
};

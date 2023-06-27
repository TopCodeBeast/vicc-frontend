import {
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  useLazyQuery,
} from '@apollo/client';
import { DocumentNode } from 'graphql';
import { useCallback, useEffect } from 'react';

import { useUSSportsApolloClient } from '@sorare/core/src/hooks/graphql/usSports';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';
import {
  WithRelayPagination,
  mergeResults,
} from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

/*export const useUSSportsQuery: typeof useQuery = (query, options) => {
  const usSportsApolloClient = useUSSportsApolloClient();
  return useQuery(query, { ...options, client: usSportsApolloClient });
};

export const useUSSportsLazyQuery: typeof useLazyQuery = (query, options) => {
  const usSportsApolloClient = useUSSportsApolloClient();
  return useLazyQuery(query, { ...options, client: usSportsApolloClient });
};

export const useUSSportsMutation: typeof useMutation = (mutation, options) => {
  const usSportsApolloClient = useUSSportsApolloClient();
  return useMutation(mutation, { ...options, client: usSportsApolloClient });
};

export const usePaginatedUSSportsQuery = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode,
  options: QueryHookOptions<TData, TVariables> & { connection: string }
): QueryResult<TData, TVariables> & WithRelayPagination<TVariables> => {
  const { connection, ...rest } = options;
  const data = useUSSportsQuery(query, rest);
  const { fetchMore, variables } = data;

  const loadMore = useCallback(
    async (reload: boolean, loadMoreVariables: Partial<TVariables>) =>
      fetchMore({
        // We don't need to add query again here and that can lead to unwanted bugs: https://github.com/apollographql/apollo-client/issues/6354#issuecomment-664879778
        // https://www.apollographql.com/docs/react/pagination/core-api/#:~:text=executes%20a%20query%20with%20the%20exact%20same%20shape%20and%20variables%20as%20your%20original%20query
        variables: { ...variables, ...loadMoreVariables },
        updateQuery: (previousResult, { fetchMoreResult }) =>
          mergeResults(
            previousResult as TData,
            fetchMoreResult as TData,
            reload,
            connection
          )!,
      }),
    [connection, fetchMore, variables]
  );

  return {
    ...data,
    loadMore,
  };
};

export const useModernPaginatedUSSportsQuery = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode,
  options: QueryHookOptions<TData, TVariables>
) => {
  const data = useUSSportsQuery(query, options);
  const { fetchMore, variables } = data;

  const loadMore = useCallback(
    async (loadMoreVariables: Partial<Pick<TVariables, keyof TVariables>>) =>
      fetchMore({
        // We don't need to add query again here and that can lead to unwanted bugs: https://github.com/apollographql/apollo-client/issues/6354#issuecomment-664879778
        // https://www.apollographql.com/docs/react/pagination/core-api/#:~:text=executes%20a%20query%20with%20the%20exact%20same%20shape%20and%20variables%20as%20your%20original%20query
        variables: { ...variables, ...loadMoreVariables },
      }),
    [fetchMore, variables]
  );

  return {
    ...data,
    loadMore,
  };
};

export const useEvictQueryCache = (queryKey: string) => {
  const { cache } = useUSSportsApolloClient();
  const matchKey = new RegExp(`^${queryKey}`);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data } = cache.data;
  useEffect(() => {
    if (Object.keys(data).includes('ROOT_QUERY')) {
      Object.keys(data.ROOT_QUERY).forEach(
        key =>
          key.match(matchKey) &&
          cache.evict({
            id: cache.identify({
              id: key,
              __typename: 'Query',
            }),
          })
      );
      cache.gc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};*/

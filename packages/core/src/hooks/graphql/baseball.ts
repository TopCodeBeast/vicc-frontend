import {
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  useLazyQuery,
} from '@apollo/client';
import { DocumentNode } from 'graphql';
import { useCallback, useEffect } from 'react';

import { useUSSportsApolloClient } from './usSports';
import useMutation from './useMutation';
import { WithRelayPagination, mergeResults } from './usePaginatedQuery';
import useQuery from './useQuery';

export const useBaseballQuery: typeof useQuery = (query, options) => {
  const baseballApolloClient = useUSSportsApolloClient();
  return useQuery(query, { ...options, client: baseballApolloClient }, 401);
};

export const useBaseballLazyQuery: typeof useLazyQuery = (query, options) => {
  const baseballApolloClient = useUSSportsApolloClient();
  return useLazyQuery(query, { ...options, client: baseballApolloClient });
};

export const useBaseballMutation: typeof useMutation = (mutation, options) => {
  const baseballApolloClient = useUSSportsApolloClient();
  return useMutation(mutation, { ...options, client: baseballApolloClient });
};

/*export const useEvictQueryCache = (queryKey: string) => {
  const baseballApolloClient = useUSSportsApolloClient();
  const matchKey = new RegExp(`^${queryKey}`);
  const { cache } = baseballApolloClient;
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

export const usePaginatedBaseballQuery = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode,
  options: QueryHookOptions<TData, TVariables> & { connection: string }
): QueryResult<TData, TVariables> & WithRelayPagination<TVariables> => {
  const { connection, ...rest } = options;
  const data = useBaseballQuery(query, rest);
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

export const useModernPaginatedBaseballQuery = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode,
  options: QueryHookOptions<TData, TVariables>
) => {
  const data = useBaseballQuery(query, options);
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

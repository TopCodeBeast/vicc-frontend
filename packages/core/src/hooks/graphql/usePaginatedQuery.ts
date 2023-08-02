import {
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
} from '@apollo/client';
import { useCallback } from 'react';

import useQuery from '@core/hooks/graphql/useQuery';

export type LoadMore<V> = (
  reload: boolean,
  variables: V,
  forceConnection?: string
) => Promise<any>;

function mergeEdges<T extends { edges: any[]; pageInfo: any }>(
  previous: T,
  current: T,
  reload: boolean
) {
  const newEdges = current.edges;
  const { pageInfo } = current;
  let edges = [];

  if (reload) {
    edges = [...newEdges];
  } else if (previous) {
    edges = [...previous.edges, ...newEdges];
  } else {
    edges = newEdges;
  }
  return { ...previous, ...current, edges, pageInfo };
}

function mergeNodes<T extends { nodes: any[]; pageInfo: any }>(
  previous: T,
  current: T,
  reload: boolean
) {
  const newNodes = current.nodes;
  const { pageInfo } = current;
  let nodes = [];

  if (reload) {
    nodes = [...newNodes];
  } else if (previous) {
    nodes = [...previous.nodes, ...newNodes];
  } else {
    nodes = newNodes;
  }
  return { ...previous, ...current, nodes, pageInfo };
}

export function mergeResults(
  previous: any,
  current: any | undefined,
  reload: boolean,
  connection: string
): any {
  const result: { [key: string]: any } = {};

  if (previous === null || current === null) {
    return current;
  }
  if (Array.isArray(current) || Array.isArray(previous)) {
    return current;
  }
  if (typeof current === 'object') {
    if ((current as any).edges) {
      if ((current as any).__typename === connection) {
        return mergeEdges(previous, current, reload);
      }
      return current;
    }
    if (current.nodes) {
      if (current.__typename === connection) {
        return mergeNodes(previous, current, reload);
      }
      return previous;
    }

    Object.keys(current).forEach(key => {
      result[key] = mergeResults(
        (previous as any)[key],
        (current as any)[key],
        reload,
        connection
      );
    });

    return { ...previous, ...result };
  }
  return current;
}

export interface WithRelayPagination<V> {
  loadMore: LoadMore<Partial<V>>;
}

export default function usePaginatedQuery<
  TData = any,
  TVariables = OperationVariables
>(
  query: TypedDocumentNode<TData, TVariables>,
  options: QueryHookOptions<TData, TVariables> & { connection: string }
): QueryResult<TData, TVariables> & WithRelayPagination<TVariables> {
  const { connection, ...rest } = options;
  const data = useQuery(query, rest);
  const { fetchMore, variables } = data;

  const loadMore = useCallback(
    async (
      reload: boolean,
      loadMoreVariables: Partial<TVariables>,
      forceConnection?: string
    ) =>
      fetchMore({
        // We don't need to add query again here and that can lead to unwanted bugs: https://github.com/apollographql/apollo-client/issues/6354#issuecomment-664879778
        // https://www.apollographql.com/docs/react/pagination/core-api/#:~:text=executes%20a%20query%20with%20the%20exact%20same%20shape%20and%20variables%20as%20your%20original%20query
        variables: { ...variables, ...loadMoreVariables },
        updateQuery: (previousResult, { fetchMoreResult }) =>
          mergeResults(
            previousResult as TData,
            fetchMoreResult as TData,
            reload,
            forceConnection || connection
          )!,
      }),
    [connection, fetchMore, variables]
  );

  return {
    ...data,
    loadMore,
  };
}

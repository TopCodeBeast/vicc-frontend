import {
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
} from '@apollo/client';

import { useUSSportsApolloClient } from './usSports';
import useQuery from './useQuery';

export const useUSSportsQuery = <TData = any, TVariables = OperationVariables>(
  query: TypedDocumentNode<TData, TVariables>,
  options: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> => {
  const usSportsApolloClient = useUSSportsApolloClient();
  return useQuery(query, { ...options, client: usSportsApolloClient });
};

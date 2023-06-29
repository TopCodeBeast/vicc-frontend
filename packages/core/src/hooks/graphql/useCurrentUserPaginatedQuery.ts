import { QueryHookOptions, QueryResult, OperationVariables } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';

import { GqlType } from '@core/lib/gql';

import usePaginatedQuery, { WithRelayPagination } from './usePaginatedQuery';

export type SortType = 'ASC' | 'DESC';

interface Connected<ConnectionTypeName extends string> extends GqlType {
  __typename: ConnectionTypeName;
}

interface CursoredData {
  cursor?: string | null;
}

type PaginatedResult<TData, TVariables extends CursoredData> = QueryResult<
  TData,
  TVariables
> &
  WithRelayPagination<TVariables>;

type QueryOptions<TData, TVariables extends OperationVariables, ConnectionType> = QueryHookOptions<
  TData,
  TVariables
> & {
  connection: ConnectionType;
};

const useCurrentUserPaginatedQuery = <
  C extends string,
  contentKey extends string,
  TData extends Maybe<{
    currentUser: Maybe<{ [k in contentKey]: Connected<C> }>;
  }>,
  TVariables extends NonNullable<unknown>
>(
  query: DocumentNode,
  options: QueryOptions<TData, TVariables, C>
): PaginatedResult<TData, TVariables & CursoredData> =>
  usePaginatedQuery(query, options);

export default useCurrentUserPaginatedQuery;

export { default as mapNodes } from './mapNodes';

export interface GqlType {
  __typename: string;
}

export const isA = <T extends GqlType>(
  typename: string,
  item: GqlType | null | undefined
): item is T => {
  return item?.__typename === typename;
};

type GraphQLResult = { __typename: string };
type ValueOfTypename<T extends GraphQLResult> = T['__typename'];

export const isType = <
  Result extends GraphQLResult,
  Typename extends ValueOfTypename<Result>
>(
  result: Result,
  typename: Typename
): result is Extract<Result, { __typename: Typename }> => {
  return result?.__typename === typename;
};

export const withFragments = <T extends NonNullable<unknown>, U>(
  func: T,
  fragments: U
): T & { fragments: U } => {
  return Object.assign(func, { fragments });
};

interface OwnerType {
  account: {
    owner: {
      __typename: string;
    } | null;
  } | null;
}

export const isUserOwner = <T extends { __typename: string }>(
  owner: OwnerType | null | undefined
): owner is { account: { owner: T } } => {
  return owner?.account?.owner?.__typename === 'User';
};

export const replaceByIncoming = (_existing: any[], incoming: any[]) =>
  incoming;

export const mergeArrayOfUnnormalizedObjects = (
  existing: any[],
  incoming: any[],
  { mergeObjects }: { mergeObjects: (a: any, b: any) => any }
) => {
  if (!existing || existing.length !== incoming.length) {
    return incoming;
  }
  return incoming.map((item, index) => mergeObjects(existing[index], item));
};

export interface GraphQLError {
  path?: string[] | null;
  message: string;
  code?: number | null;
}

export const formatGqlErrors = (errors: GraphQLError[]) => {
  return errors.map(e => e.message);
};

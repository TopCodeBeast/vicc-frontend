import { SafeReadonly } from '@apollo/client/cache/core/types/common';
import { FieldFunctionOptions } from '@apollo/client/cache/inmemory/policies';
import { relayStylePagination } from '@apollo/client/utilities';
import { mergeDeep } from '@apollo/client/utilities/common/mergeDeep';
import { Reference } from '@apollo/client/utilities/graphql/storeUtils';

import { Vicc5LineupConnection, Vicc5LineupEdge } from '__generated__/globalTypes';

//TODO*****
type So5LineupConnection = Vicc5LineupConnection;
type So5LineupEdge = Vicc5LineupEdge;

// Cached data has an extra __ref property that allows links between elements of the cache. They are unique identifiers in the cache
type CachedSo5LineupEdge = So5LineupEdge & { node: Reference };
type CachedSo5LineupConnection = So5LineupConnection & {
  edges: CachedSo5LineupEdge[];
};

const getExtras = (obj: SafeReadonly<CachedSo5LineupConnection>) => {
  const { edges, pageInfo, ...rest } = obj;
  return rest;
};

function makeEmptyData(): SafeReadonly<CachedSo5LineupConnection> {
  return {
    __typename: 'Vicc5LineupConnection',
    nodes: [],
    edges: [],
    totalCount: 0,
    pageInfo: {
      __typename: 'PageInfo',
      hasPreviousPage: false,
      hasNextPage: true,
      startCursor: '',
      endCursor: '',
    },
  };
}

export default {
  ...relayStylePagination(['withTraining', 'vicc5LeaderboardSlug', 'draft']),

  // Override relayStylePagination merge function
  // Adapted from node_modules/@apollo/client/utilities/policies/pagination.js
  merge(
    exi: SafeReadonly<CachedSo5LineupConnection>,
    inc: SafeReadonly<CachedSo5LineupConnection>,
    { args, isReference, readField }: FieldFunctionOptions
  ) {
    const existing = !exi ? makeEmptyData() : exi;
    let incoming = inc;

    if (!incoming) {
      return existing;
    }

    let incomingEdges = incoming.edges
      ? incoming.edges.map((s5Edge: CachedSo5LineupEdge) => {
          const edge: CachedSo5LineupEdge = { ...s5Edge };
          if (isReference(edge)) {
            edge.cursor = readField('cursor', edge) || '';
          }
          return edge;
        })
      : [];

    if (incoming.pageInfo) {
      const { startCursor, endCursor } = incoming.pageInfo;
      const firstEdge = incomingEdges[0];
      const lastEdge = incomingEdges[incomingEdges.length - 1];
      if (firstEdge && startCursor) {
        firstEdge.cursor = startCursor;
      }
      if (lastEdge && endCursor) {
        lastEdge.cursor = endCursor;
      }
      const firstCursor = firstEdge?.cursor;
      if (firstCursor && !startCursor) {
        incoming = mergeDeep(incoming, {
          pageInfo: {
            startCursor: firstCursor,
          },
        });
      }
      const lastCursor = lastEdge?.cursor;
      if (lastCursor && !endCursor) {
        incoming = mergeDeep(incoming, {
          pageInfo: {
            endCursor: lastCursor,
          },
        });
      }
    }

    let prefix: CachedSo5LineupEdge[] = existing.edges;
    let suffix: CachedSo5LineupEdge[] = [];
    // Prepare existing data if incoming needs to be injected in the middle of existing
    if (args?.after) {
      const index = prefix.findIndex(edge => edge.cursor === args.after);
      if (index >= 0) {
        prefix = prefix.slice(0, index + 1);
      }
    } else if (args?.before) {
      const index = prefix.findIndex(edge => edge.cursor === args.before);
      suffix = index < 0 ? prefix : prefix.slice(index);
      prefix = [];
    } else if (incomingEdges) {
      const refetchedFullCache = incomingEdges.length >= prefix.length;
      const gotLessThanLimit = args?.first > incomingEdges.length;
      if (refetchedFullCache || gotLessThanLimit) {
        prefix = [];
      } else {
        prefix = [...prefix];
        const prefixIds = prefix.reduce((acc, e, idx) => {
          // eslint-disable-next-line no-underscore-dangle
          acc[e?.node?.__ref] = idx;
          return acc;
        }, {} as { [key: string]: number });

        incomingEdges.forEach((it: CachedSo5LineupEdge) => {
          // eslint-disable-next-line no-underscore-dangle
          const idx = prefixIds[it?.node?.__ref];
          if (idx >= 0) {
            prefix[idx] = it;
          } else {
            prefix.push(it);
            // eslint-disable-next-line no-underscore-dangle
            prefixIds[it?.node?.__ref] = prefix.length - 1;
          }
        });
        incomingEdges = [];
      }
    }
    const edges = [...prefix, ...incomingEdges, ...suffix];
    const pageInfo = {
      ...incoming.pageInfo,
      ...existing.pageInfo,
    };

    if (incoming.pageInfo) {
      const {
        hasPreviousPage,
        hasNextPage,
        startCursor,
        endCursor,
        ...extras
      } = incoming.pageInfo;

      Object.assign(pageInfo, extras);
      if (!prefix.length) {
        if (hasPreviousPage !== undefined) {
          pageInfo.hasPreviousPage = hasPreviousPage;
        }
        if (startCursor !== undefined) {
          pageInfo.startCursor = startCursor;
        }
        if (prefix.length > incomingEdges.length) {
          pageInfo.endCursor = endCursor;
        }
      }
      if (!suffix.length) {
        if (hasNextPage !== undefined) {
          pageInfo.hasNextPage = hasNextPage;
        }
        if (endCursor !== undefined) {
          pageInfo.endCursor = endCursor;
        }
      }
    }

    return {
      ...getExtras(existing),
      ...getExtras(incoming),
      ...{ edges, pageInfo },
    };
  },
};

// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  ApolloClient,
  ApolloLink,
  FieldPolicy,
  InMemoryCache,
  Reference,
  TypePolicies,
} from '@apollo/client';

import { SnackNotificationContext } from '@core/contexts/snackNotification';
import { dataIdFromObject } from '@core/gql/idFromObject';

import introspectionResult from '../../gql/usSportsIntrospectionResult.json';
import { afterwareLink } from './links/afterware';
import { authLink } from './links/auth';
import { httpLink } from './links/http';
import { retryLink } from './links/retry';

type CardForComposeLineup = {
  nodes: { card: { __ref: any } }[];
};

type Ref = {
  __ref: any;
};

const cardsFieldPolicy = (
  typename: string
): FieldPolicy<Record<string, any>> => ({
  read(existing, { args, toReference, canRead }) {
    if (!args) return existing;

    let { assetIds, ids } = args;
    if (args.input) {
      assetIds = args.input.assetIds;
      ids = args.input.ids;
    }

    if (assetIds || ids) {
      const assetIdsRefs: Reference[] = assetIds
        ? assetIds.map((assetId: string) =>
            toReference({ __typename: typename, assetId })
          )
        : [];

      const idsRefs: Reference[] = ids
        ? ids.map((s: string) => toReference({ __typename: typename, id: s }))
        : [];

      const refs = [...assetIdsRefs, ...idsRefs];
      if (refs.find(ref => !canRead(ref))) {
        return existing;
      }

      return refs;
    }
    return undefined;
  },
});

// TODO(haoliang): consolidate similar usage as to what's being done for:
// getPositionInitials() in baseball/src/components/onboarding/utils.tsx
const selectionIndexPositionArg = (index: number): string => {
  switch (true) {
    case index <= 2:
      return 'sp';
    case index <= 3:
      return 'rp';
    case index <= 5:
      return 'ci';
    case index <= 7:
      return 'mi';
    default:
      return 'of';
  }
};

/* eslint sort-keys: "error" */
export const typePolicies: TypePolicies = {
  // FIXME: we can't specify this yet because of packages/core/src/lib/usSportsGraphql/client.ts `toReference()`
  // BaseballCard: {
  //   keyFields: ['slug'],
  // },
  BaseballCollection: {
    keyFields: ['slug'],
  },
  BaseballCommonDraftAutofillSuggestionsResponse: {
    keyFields: [],
  },

  BaseballCommonDraftConfig: {
    fields: {
      baseballCommonDraftCardSamples: {
        keyArgs: args => {
          const exclude = ['selectedPlayerSlugs', 'first', 'after'];

          return Object.entries(args!)
            .reduce((acc, entry) => {
              const [k, v] = entry;

              if (exclude.includes(k)) {
                return acc;
              }

              if (k === 'selectionIndex') {
                acc.push(selectionIndexPositionArg(v));
              } else {
                acc.push(v);
              }

              return acc;
            }, [] as any[])
            .join(',');
        },
        merge(
          existing: { nodes: { __ref: string }[] } = { nodes: [] },
          incoming: { nodes: { __ref: string }[] }
        ) {
          const existingRefs = existing.nodes.map(
            // eslint-disable-next-line no-underscore-dangle
            node => node.__ref
          );
          return {
            ...incoming,
            nodes: [
              ...existing.nodes,
              ...incoming.nodes.filter(
                // eslint-disable-next-line no-underscore-dangle
                node => !existingRefs.includes(node.__ref)
              ),
            ],
          };
        },
      },
      commonDraftAutofillSuggestions: {
        keyArgs: ['selectedPlayersSlugs'],
        merge: true,
      },
    },

    // Singleton object
    // cf https://www.apollographql.com/docs/react/caching/cache-configuration/#customizing-cache-ids
    keyFields: [],
  },
  BaseballFixture: {
    fields: {
      leaderboards: {
        merge(_, incoming: any[] = []) {
          return [...incoming];
        },
      },
    },
  },
  BaseballLeaderboard: {
    fields: {
      myLineups: {
        merge(_, incoming: any[] = []) {
          return [...incoming];
        },
      },
      prizePool: {
        merge: true,
      },
      // Fix apollo merge
      // https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-non-normalized-objects
      requirements: {
        merge: true,
      },
    },
    keyFields: ['slug'],
  },
  BaseballLineup: {
    fields: {
      cards: {
        merge(existing = [], incoming, { mergeObjects }) {
          // CardInLineup does not have a ref
          // and CardInLineup.playerInFixture does not have a ref
          // and CardInLineup.playerInFixture.status does not have a rf
          // To merge Lineup objects effectively in the cache, we need to
          // do a deep merge, otherwise Apollo does not know what to do
          // and overrides everything with the latest object, causing
          // redundant and conflicting fetches, potentially nested loops
          const merged = [...incoming].map((incomingCardObject, i) => {
            const existingCardObject = existing[i] || {};
            const mergedCardObject = {
              ...mergeObjects(existingCardObject, incomingCardObject),
              playerInFixture: {
                ...mergeObjects(
                  existingCardObject.playerInFixture || {},
                  incomingCardObject.playerInFixture || {}
                ),
                status: {
                  ...mergeObjects(
                    existingCardObject.playerInFixture?.status || {},
                    incomingCardObject.playerInFixture?.status || {}
                  ),
                },
              },
            };
            return mergedCardObject;
          });
          return merged;
        },
      },
      projectedReward: {
        merge: true,
      },
    },
    keyFields: ['id'],
  },
  BaseballPlayer: {
    keyFields: ['slug'],
  },
  BaseballSubmitCommonDraftResponse: {
    keyFields: [],
  },
  BaseballTeam: {
    keyFields: ['slug'],
  },
  // FIXME: we can't specify this yet because of packages/core/src/lib/usSportsGraphql/client.ts `toReference()`
  // CardInterface: {
  //   keyFields: ['slug'],
  // },
  CashReward: {
    keyFields: ['id'],
  },
  CollectionInterface: {
    keyFields: ['slug'],
  },
  CurrentSportsUser: {
    fields: {
      baseballCardCounts: { merge: true },
      baseballCurrentUserData: { merge: true },
      baseballUnclaimedCardRewards: { merge: false },
      baseballUnclaimedCashRewards: { merge: false },
      baseballUnclaimedLineupRewards: { merge: false },
      nbaCardCounts: { merge: true },
      nbaUnclaimedCardRewards: { merge: false },
      nbaUnclaimedCashRewards: { merge: false },
      nbaUnclaimedLineupRewards: { merge: false },
    },
    keyFields: ['slug'],
  },
  CurrentUser: {
    fields: {
      baseballCardCounts: { merge: true },
      baseballCurrentUserData: { merge: true },
      baseballUnclaimedCardRewards: { merge: false },
      baseballUnclaimedCashRewards: { merge: false },
      baseballUnclaimedLineupRewards: { merge: false },
      nbaCardCounts: { merge: true },
      nbaUnclaimedCardRewards: { merge: false },
      nbaUnclaimedCashRewards: { merge: false },
      nbaUnclaimedLineupRewards: { merge: false },
    },
    keyFields: ['slug'],
  },
  LeaderboardInterface: {
    fields: {
      myComposeLineupCards: {
        keyArgs: [
          'query',
          'lineupid',
          'includeUsed',
          'indexInLineup',
          'cardsInLineupPartial',
          'includeOverTenGameAverageTotalLimit',
        ],
        merge(
          existing: CardForComposeLineup = { nodes: [] },
          incoming: CardForComposeLineup
        ) {
          const existingCardRefs = existing.nodes.map(
            // eslint-disable-next-line no-underscore-dangle
            node => node.card.__ref
          );
          return {
            ...incoming,
            nodes: [
              ...existing.nodes,
              ...incoming.nodes.filter(
                // eslint-disable-next-line no-underscore-dangle
                node => !existingCardRefs.includes(node.card.__ref)
              ),
            ],
          };
        },
      },
      myLineups(lineups, { canRead }) {
        return lineups ? lineups.filter(canRead) : [];
      },
      // Fix apollo merge
      // https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-non-normalized-objects
      requirements: {
        merge: true,
      },
    },
    keyFields: ['slug'],
  },
  League: {
    fields: {
      members: {
        keyArgs: false,
        merge: (existing: any[], incoming: any[], _a) => {
          const args = { limit: 100, offset: 0, ...(_a.args || {}) };
          const merged = [...(existing || [])];
          const { offset } = args;
          incoming.forEach((member, index) => {
            merged[offset + index] = member;
          });
          return merged;
        },
      },
    },
    keyFields: ['slug'],
  },
  LeagueLeaderboard: {
    fields: {
      lineups: {
        keyArgs: false,
        merge: (existing: any[], incoming: any[], _a) => {
          const args = { limit: 100, offset: 0, ...(_a.args || {}) };
          const merged = [...(existing || [])];
          const { offset } = args;
          incoming.forEach((member, index) => {
            merged[offset + index] = member;
          });
          return merged;
        },
      },
    },
    keyFields: ['leaderboard', ['slug'], 'league', ['slug']],
  },
  // FIXME: we can't specify this yet because of packages/core/src/lib/usSportsGraphql/client.ts `toReference()`
  // NBACard: {
  //   keyFields: ['slug'],
  // },
  NBACollection: {
    keyFields: ['slug'],
  },
  NBAFixture: {
    fields: {
      leaderboards: {
        merge(_, incoming: any[] = []) {
          return [...incoming];
        },
      },
      playerFixtureStats: {
        keyArgs: ['hideUnownedPlayers', 'order'],
        merge(
          existing: { nodes: { player: Ref }[] } = { nodes: [] },
          incoming: { nodes: { player: Ref }[] }
        ) {
          const existingRefs = existing.nodes.map(
            // eslint-disable-next-line no-underscore-dangle
            node => node.player.__ref
          );
          const result = {
            ...incoming,
            nodes: [
              ...existing.nodes,
              ...incoming.nodes.filter(
                // eslint-disable-next-line no-underscore-dangle
                node => !existingRefs.includes(node.player.__ref)
              ),
            ],
          };
          return result;
        },
      },
    },
  },
  NBALeaderboard: {
    fields: {
      beginnerLeaderboardDetails: {
        merge: true,
      },
      myLineups: {
        merge(_existing, incoming: any[] = []) {
          return [...incoming];
        },
      },
      prizePool: {
        merge: true,
      },
      // Fix apollo merge
      // https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-non-normalized-objects
      requirements: {
        merge: true,
      },
    },
    keyFields: ['slug'],
  },
  NBALineup: {
    fields: {
      cards: {
        merge(existing = [], incoming, { mergeObjects }) {
          // CardInLineup does not have a ref
          // and CardInLineup.playerInFixture does not have a ref
          // and CardInLineup.playerInFixture.status does not have a rf
          // To merge Lineup objects effectively in the cache, we need to
          // do a deep merge, otherwise Apollo does not know what to do
          // and overrides everything with the latest object, causing
          // redundant and conflicting fetches, potentially nested loops
          const merged = [...incoming].map((incomingCardObject, i) => {
            const existingCardObject = existing[i] || {};
            const mergedCardObject = {
              ...mergeObjects(existingCardObject, incomingCardObject),
              playerInFixture: {
                ...mergeObjects(
                  existingCardObject.playerInFixture || {},
                  incomingCardObject.playerInFixture || {}
                ),
                status: {
                  ...mergeObjects(
                    existingCardObject.playerInFixture?.status || {},
                    incomingCardObject.playerInFixture?.status || {}
                  ),
                },
              },
            };
            return mergedCardObject;
          });
          return merged;
        },
      },
      projectedReward: {
        merge: true,
      },
    },
    keyFields: ['id'],
  },
  NBAPlayer: {
    keyFields: ['slug'],
  },
  NBATeam: {
    keyFields: ['slug'],
  },
  PlayerInterface: {
    keyFields: ['slug'],
  },
  TeamInterface: {
    keyFields: ['slug'],
  },
  /* eslint-disable sort-keys */
  Query: {
    fields: {
      baseballCards: cardsFieldPolicy('BaseballCard'),
      baseballFixture: {
        read(_, { args, toReference }) {
          return toReference({
            __typename: 'BaseballFixture',
            slug: args?.slug,
          });
        },
      },
      nbaCards: cardsFieldPolicy('NBACard'),
      nbaFixture: {
        read(_, { args, toReference }) {
          return toReference({
            __typename: 'NBAFixture',
            slug: args?.slug,
          });
        },
      },
    },
  },
};

export const usSportsApolloCache = new InMemoryCache({
  dataIdFromObject,
  possibleTypes: introspectionResult.possibleTypes,
  typePolicies,
});

export const getUsSportsApolloClient = ({
  showNotification,
  debugLink,
  tmLink,
  uri,
}: {
  showNotification: SnackNotificationContext['showNotification'];
  debugLink?: ApolloLink;
  tmLink?: ApolloLink;
  uri: string;
}) => {
  const link = ApolloLink.from(
    [
      debugLink,
      tmLink,
      afterwareLink(showNotification),
      authLink,
      retryLink(showNotification),
      httpLink(uri),
    ].filter(Boolean)
  );

  return new ApolloClient({
    link,
    cache: usSportsApolloCache,
    assumeImmutableResults: true,
    resolvers: {},
  });
};

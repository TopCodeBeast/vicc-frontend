import { UnfollowableSubscription } from '../Follow/types';
import { Subscriptions_subscription } from './__generated__/index.graphql';

type CacheRegistry = {
  known: Set<string>;
  missing: string[];
};

export type SubscriptionsCacheRegistries = {
  players?: CacheRegistry;
  clubs?: CacheRegistry;
  countries?: CacheRegistry;
};

type RegistryArgs = Partial<
  Record<
    'players' | 'clubs' | 'countries',
    {
      graphqlType: string;
    }
  >
>;
export type BasicSubscriptionItemsQuery =
  | {
      players: { slug: string }[] | undefined;
      clubs: { slug: string }[] | undefined;
      countries: { slug: string }[] | undefined;
    }
  | {
      players: { slug: string }[] | undefined;
    };

const addMissingToCacheDataSection: (
  src: CacheRegistry,
  newMissing: string[]
) => CacheRegistry = ({ missing, ...rest }, newMissing) => {
  return {
    ...rest,
    missing: [...missing, ...newMissing],
  };
};

export const updateKnownSlugs: (
  src: CacheRegistry,
  newKnown: { slug: string }[]
) => CacheRegistry = ({ missing, known, ...rest }, newKnown) => {
  const knownResult = new Set(known);
  newKnown.forEach(({ slug }) => {
    knownResult.add(slug);
  });
  const newMissing = missing.filter(s => !knownResult.has(s));
  return {
    ...rest,
    known: knownResult,
    missing: newMissing,
  };
};

const isMissingAndNotReportedAsMissing: (
  cache: CacheRegistry,
  slug: string
) => boolean = (cache, slug) =>
  !cache.known.has(slug) && cache.missing.indexOf(slug) < 0;

export const getSubscribableSlugsByType = (
  type: string,
  follows: Subscriptions_subscription[]
) => {
  return follows
    .filter(follow => {
      return follow.subscribableType === type;
    })
    .map(follow => {
      return follow.subscribableSlug;
    });
};

const getMissingSubscribableSlugsForType = (
  src: CacheRegistry,
  follows: Subscriptions_subscription[],
  type: string
): string[] =>
  getSubscribableSlugsByType(type, follows).filter(slug =>
    isMissingAndNotReportedAsMissing(src, slug)
  );

export const refreshMissingRegistrySection = (
  key: keyof SubscriptionsCacheRegistries,
  type: string,
  subscriptionCacheRegistry: SubscriptionsCacheRegistries,
  subscriptions: UnfollowableSubscription[]
) => {
  if (subscriptionCacheRegistry[key] === undefined) return undefined;

  const missingSlugs = getMissingSubscribableSlugsForType(
    subscriptionCacheRegistry[key]!,
    subscriptions,
    type
  );
  if (missingSlugs.length > 0) {
    return addMissingToCacheDataSection(
      subscriptionCacheRegistry[key]!,
      missingSlugs
    );
  }
  return undefined;
};

export const refreshMissingRegistry = (
  subscriptionCacheRegistry: SubscriptionsCacheRegistries,
  subscriptions: UnfollowableSubscription[],
  registryArgs: RegistryArgs
) => {
  const partialCacheData: Partial<SubscriptionsCacheRegistries> =
    Object.fromEntries(
      Object.entries(registryArgs).map(entries => [
        entries[0],
        refreshMissingRegistrySection(
          entries[0] as keyof SubscriptionsCacheRegistries,
          entries[1].graphqlType,
          subscriptionCacheRegistry,
          subscriptions
        ),
      ])
    );
  return partialCacheData;
};

export const newItems = <T>(
  subscriptions: UnfollowableSubscription[],
  newItemsArgs: RegistryArgs
): { data: T | undefined; registry: SubscriptionsCacheRegistries } => {
  const registry = Object.fromEntries(
    Object.entries(newItemsArgs).map(entries => [
      entries[0],
      {
        known: new Set(),
        missing: getSubscribableSlugsByType(
          entries[1].graphqlType,
          subscriptions
        ),
      },
    ])
  );
  return {
    data: undefined,
    registry,
  };
};

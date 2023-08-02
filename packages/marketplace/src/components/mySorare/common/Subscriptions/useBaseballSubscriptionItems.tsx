import { useEffect, useMemo, useState } from 'react';

import { useBaseballQuery } from '@sorare/core/src/hooks/graphql/baseball';
import { BaseballSubscriptionItemsQuery } from '@sorare/core/src/lib/usSportsGraphql/__generated__/queries.graphql';
import { BASEBALL_SUBSCRIPTION_ITEMS_QUERY } from '@sorare/core/src/lib/usSportsGraphql/queries';

import { UnfollowableSubscription } from '../Follow/types';
import {
  SubscriptionsCacheRegistries,
  getSubscribableSlugsByType,
  newItems,
  refreshMissingRegistry,
  updateKnownSlugs,
} from './utils';

type Items = {
  data: BaseballSubscriptionItemsQuery | undefined;
  registry: SubscriptionsCacheRegistries;
};

const registryArgs = {
  players: {
    graphqlType: 'BaseballPlayer',
  },
};

const refreshMissingRegistryAndItemsSection = <
  K extends keyof SubscriptionsCacheRegistries &
    keyof BaseballSubscriptionItemsQuery
>(
  key: K,
  subscriptionsCacheRegistries: SubscriptionsCacheRegistries,
  data: BaseballSubscriptionItemsQuery,
  existingData: BaseballSubscriptionItemsQuery | undefined,
  updatedItems: {
    [key in K]?: BaseballSubscriptionItemsQuery[K][number][] | undefined;
  },
  partialDataSection: {
    [key in K]?: SubscriptionsCacheRegistries[K] | undefined;
  }
) => {
  const newContents: BaseballSubscriptionItemsQuery[K][number][] = data[key];
  if (newContents?.length > 0) {
    const subscriptionCacheRegistry = subscriptionsCacheRegistries[key];
    const { known } = subscriptionCacheRegistry!;
    const formerlyUnknownElements = newContents.filter(
      ({ slug }) => !known.has(slug)
    );
    if (formerlyUnknownElements.length > 0) {
      if (existingData) {
        updatedItems[key] = [...existingData[key], ...formerlyUnknownElements];
      } else {
        updatedItems[key] = formerlyUnknownElements;
      }
      partialDataSection[key] = updateKnownSlugs(
        subscriptionCacheRegistry!,
        formerlyUnknownElements
      );
    }
  }
};

const refreshMissingRegistryAndItems = (
  data: BaseballSubscriptionItemsQuery,
  cacheData: SubscriptionsCacheRegistries,
  existingData: BaseballSubscriptionItemsQuery | undefined
) => {
  const updatedItems: Partial<BaseballSubscriptionItemsQuery> = {};
  const partialDataSection: Partial<SubscriptionsCacheRegistries> = {};
  refreshMissingRegistryAndItemsSection(
    'players',
    cacheData,
    data,
    existingData,
    updatedItems,
    partialDataSection
  );

  return {
    updatedItems,
    partialDataSection,
  };
};

type Props = { subscriptions: UnfollowableSubscription[] };

export const useBaseballSubscriptionItems = ({ subscriptions }: Props) => {
  const [items, setItems] = useState<Items>(
    newItems<BaseballSubscriptionItemsQuery>(subscriptions, registryArgs)
  );

  const { players: playersRegistry } = items.registry;

  const { data: cachedData } = items;

  useEffect(() => {
    const { players } = refreshMissingRegistry(
      {
        players: playersRegistry,
      },
      subscriptions,
      registryArgs
    );
    if (players) {
      setItems(({ data }) => ({
        data,
        registry: {
          players: players || playersRegistry,
        },
      }));
    }
  }, [playersRegistry, subscriptions]);
  const { slugs } = useMemo(() => {
    // we don't want to query more than 50 elements at a time per section
    return {
      slugs: playersRegistry?.missing
        ? playersRegistry.missing.slice(0, 50)
        : [],
    };
  }, [playersRegistry?.missing]);

  const { data } = useBaseballQuery(BASEBALL_SUBSCRIPTION_ITEMS_QUERY, {
    variables: {
      slugs,
    },
    skip: !subscriptions || subscriptions.length === 0 || slugs.length === 0,
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  const { formerPlayers } = useMemo(() => {
    return {
      formerPlayers: cachedData?.players || [],
    };
  }, [cachedData?.players]);

  useEffect(() => {
    if (data) {
      const {
        updatedItems: { players },
        partialDataSection: { players: newPlayersRegistry },
      } = refreshMissingRegistryAndItems(
        data,
        {
          players: playersRegistry,
        },
        {
          players: formerPlayers,
        }
      );
      if (players) {
        setItems({
          data: {
            players: players || formerPlayers,
          },
          registry: {
            players: newPlayersRegistry || playersRegistry,
          },
        });
      }
    }
  }, [playersRegistry, data, formerPlayers]);
  const subscriptionsInput = useMemo(
    () => [...getSubscribableSlugsByType('BaseballPlayer', subscriptions)],
    [subscriptions]
  );
  return {
    baseballCachedData: cachedData,
    baseballSubscriptionsInput: subscriptionsInput,
    baseballSlugs: {
      slugs,
    },
  };
};

export default useBaseballSubscriptionItems;

import { TypedDocumentNode, gql } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import Follow from '../Follow';
import { UnfollowableSubscription } from '../Follow/types';
import {
  SubscriptionItemsQuery,
  SubscriptionItemsQueryVariables,
} from './__generated__/useSo5SubscriptionItems.graphql';
import {
  SubscriptionsCacheRegistries,
  getSubscribableSlugsByType,
  newItems,
  refreshMissingRegistry,
  updateKnownSlugs,
} from './utils';

export const SUBSCRIPTION_ITEMS_QUERY = gql`
  query SubscriptionItemsQuery(
    $slugs: [String!]!
    $clubSlugs: [String!]!
    $countrySlugs: [String!]!
  ) {
    players(slugs: $slugs) {
      slug
      ...Follow_player
    }
    clubs(slugs: $clubSlugs) {
      slug
      ...Follow_club
    }
    countries(slugs: $countrySlugs) {
      slug
      ...Follow_country
    }
  }
  ${Follow.fragments.player}
  ${Follow.fragments.club}
  ${Follow.fragments.country}
` as TypedDocumentNode<SubscriptionItemsQuery, SubscriptionItemsQueryVariables>;

export type Items = {
  data:
    | {
        players: SubscriptionItemsQuery['football']['players'];
        clubs: SubscriptionItemsQuery['football']['clubs'];
        countries: SubscriptionItemsQuery['countries'];
      }
    | undefined;
  registry: SubscriptionsCacheRegistries;
};

const so5RegistryArgs = {
  players: {
    graphqlType: 'Player',
  },
  clubs: {
    graphqlType: 'Club',
  },
  countries: {
    graphqlType: 'Country',
  },
};

const refreshMissingRegistryAndItemsSection = <
  K extends keyof SubscriptionsCacheRegistries &
    keyof NonNullable<Items['data']>
>(
  key: K,
  subscriptionsCacheRegistries: SubscriptionsCacheRegistries,
  newContents: NonNullable<Items['data']>[K][number][],
  existingData: Items['data'] | undefined,
  updatedItems: {
    [key in K]?: NonNullable<Items['data']>[K][number][] | undefined;
  },
  partialDataSection: {
    [key in K]?: SubscriptionsCacheRegistries[K] | undefined;
  }
) => {
  if (newContents.length > 0) {
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
  data: SubscriptionItemsQuery,
  cacheData: SubscriptionsCacheRegistries,
  existingData: Items['data'] | undefined
) => {
  const updatedItems: Partial<Items['data']> = {};
  const partialDataSection: Partial<SubscriptionsCacheRegistries> = {};
  refreshMissingRegistryAndItemsSection(
    'players',
    cacheData,
    data.football.players,
    existingData,
    updatedItems,
    partialDataSection
  );
  refreshMissingRegistryAndItemsSection(
    'clubs',
    cacheData,
    data.football.clubs,
    existingData,
    updatedItems,
    partialDataSection
  );
  refreshMissingRegistryAndItemsSection(
    'countries',
    cacheData,
    data.countries,
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

export const useSo5SubscriptionItems = ({ subscriptions }: Props) => {
  const [items, setItems] = useState<Items>(
    newItems<Items['data']>(subscriptions, so5RegistryArgs)
  );

  const {
    clubs: clubsRegistry,
    players: playersRegistry,
    countries: countriesRegistry,
  } = items.registry;

  const { data: cachedData } = items;

  useEffect(() => {
    const { countries, clubs, players } = refreshMissingRegistry(
      {
        clubs: clubsRegistry,
        players: playersRegistry,
        countries: countriesRegistry,
      },
      subscriptions,
      so5RegistryArgs
    );
    if (countries || clubs || players) {
      setItems(({ data }) => ({
        data,
        registry: {
          players: players || playersRegistry,
          clubs: clubs || clubsRegistry,
          countries: countries || countriesRegistry,
        },
      }));
    }
  }, [clubsRegistry, countriesRegistry, playersRegistry, subscriptions]);
  const { slugs, clubSlugs, countrySlugs } = useMemo(() => {
    // we don't want to query more than 100 elements at a time per section
    return {
      slugs: playersRegistry?.missing
        ? playersRegistry.missing.slice(0, 100)
        : [],
      clubSlugs: clubsRegistry?.missing
        ? clubsRegistry.missing.slice(0, 100)
        : [],
      countrySlugs: countriesRegistry?.missing
        ? countriesRegistry.missing.slice(0, 100)
        : [],
    };
  }, [
    playersRegistry?.missing,
    clubsRegistry?.missing,
    countriesRegistry?.missing,
  ]);
  const { data } = useQuery(SUBSCRIPTION_ITEMS_QUERY, {
    variables: {
      slugs,
      clubSlugs,
      countrySlugs,
    },
    skip:
      !subscriptions ||
      subscriptions.length === 0 ||
      (slugs.length === 0 &&
        clubSlugs.length === 0 &&
        countrySlugs.length === 0),
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  const { formerClubs, formerPlayers, formerCountries } = useMemo(() => {
    return {
      formerClubs: cachedData?.clubs || [],
      formerPlayers: cachedData?.players || [],
      formerCountries: cachedData?.countries || [],
    };
  }, [cachedData?.clubs, cachedData?.countries, cachedData?.players]);

  useEffect(() => {
    if (data) {
      const {
        updatedItems: { clubs, players, countries },
        partialDataSection: {
          clubs: newClubsRegistry,
          players: newPlayersRegistry,
          countries: newCountriesRegistry,
        },
      } = refreshMissingRegistryAndItems(
        data,
        {
          clubs: clubsRegistry,
          players: playersRegistry,
          countries: countriesRegistry,
        },
        {
          clubs: formerClubs,
          players: formerPlayers,
          countries: formerCountries,
        }
      );
      if (clubs || players || countries) {
        setItems({
          data: {
            clubs: clubs || formerClubs,
            players: players || formerPlayers,
            countries: countries || formerCountries,
          },
          registry: {
            clubs: newClubsRegistry || clubsRegistry,
            players: newPlayersRegistry || playersRegistry,
            countries: newCountriesRegistry || countriesRegistry,
          },
        });
      }
    }
  }, [
    clubsRegistry,
    countriesRegistry,
    playersRegistry,
    data,
    formerClubs,
    formerCountries,
    formerPlayers,
  ]);

  const subscriptionsInput = useMemo(
    () => [
      ...getSubscribableSlugsByType('Player', subscriptions),
      ...getSubscribableSlugsByType('Club', subscriptions),
      ...getSubscribableSlugsByType('Country', subscriptions),
    ],
    [subscriptions]
  );

  return {
    so5CachedData: cachedData,
    so5SubscriptionsInput: subscriptionsInput,
    so5Slugs: {
      slugs,
      clubSlugs,
      countrySlugs,
    },
  };
};

export default useSo5SubscriptionItems;

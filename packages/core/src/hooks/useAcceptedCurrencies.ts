import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback, useMemo } from 'react';

import { Sport } from '__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSportContext } from '@core/contexts/sport';

import {
  AcceptedCurrenciesQuery,
  AcceptedCurrenciesQueryVariables,
} from './__generated__/useAcceptedCurrencies.graphql';
import useQuery from './graphql/useQuery';
import useUpdateUserProfile from './useUpdateUserProfile';

const ACCEPTED_CURRENCIES_QUERY = gql`
  query AcceptedCurrenciesQuery {
    currentUser {
      slug
      profile {
        id
        marketplacePreferences(sports: [FOOTBALL, NBA, BASEBALL]) {
          sport
          preferences {
            name
            value
          }
        }
      }
    }
  }
` as TypedDocumentNode<
  AcceptedCurrenciesQuery,
  AcceptedCurrenciesQueryVariables
>;

export const MARKETPLACE_PREFERENCES_ACCEPTED_CURRENCIES =
  'accepted_currencies' as const;

export enum AcceptedCurrenciesValue {
  FIAT = 'fiat',
  ETH = 'eth',
  BOTH = 'both',
}

export const useAcceptedCurrencies = () => {
  const {
    walletPreferences: { onlyShowFiatCurrency },
  } = useCurrentUserContext();

  const { sport = Sport.CRICKET } = useSportContext();
  const updateUserProfile = useUpdateUserProfile();
  const { data } = useQuery(ACCEPTED_CURRENCIES_QUERY);
  const marketplacePreferences =
    data?.currentUser?.profile?.marketplacePreferences;

  const storedAcceptedCurrencies = marketplacePreferences
    // we currently use the same preferences for all sports
    ?.find(mp => mp && mp.sport === sport)
    ?.preferences?.find(
      p => p.name === MARKETPLACE_PREFERENCES_ACCEPTED_CURRENCIES
    )?.value;

  const acceptedCurrencies = useMemo(() => {
    if (onlyShowFiatCurrency) {
      return AcceptedCurrenciesValue.FIAT;
    }
    if (storedAcceptedCurrencies) {
      return storedAcceptedCurrencies as AcceptedCurrenciesValue;
    }
    return AcceptedCurrenciesValue.ETH;
  }, [onlyShowFiatCurrency, storedAcceptedCurrencies]);

  const updateAcceptedCurrencies = useCallback(
    async (value: AcceptedCurrenciesValue) => {
      return updateUserProfile({
        marketplacePreferences: [
          {
            sports: [Sport.BASEBALL, Sport.CRICKET, Sport.NBA],
            name: MARKETPLACE_PREFERENCES_ACCEPTED_CURRENCIES,
            value,
          },
        ],
      });
    },
    [updateUserProfile]
  );

  return {
    acceptedCurrencies,
    updateAcceptedCurrencies,
    acceptedCurrenciesHaveBeenSet: !!storedAcceptedCurrencies,
  };
};

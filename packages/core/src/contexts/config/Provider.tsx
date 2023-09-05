import {
  TypedDocumentNode,
  gql,
  useLazyQuery,
  useMutation,
} from '@apollo/client';
import { ReactNode, useEffect, useMemo } from 'react';
import { useInterval } from 'react-use';

import useFontFaceObserver from '@sorare/use-font-face-observer';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { useGraphqlContext } from '@core/contexts/graphql';
import { useTMContext } from '@core/contexts/tm';
import useQuery from '@core/hooks/graphql/useQuery';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { currency } from '@core/lib/fiat';
import { asObject } from '@core/lib/json';

import ConfigContextProvider, { AlgoliaCardIndexes, AlgoliaIndexes } from '.';
import { currentUser } from '../currentUser/queries';
import {
  ConfigQuery,
  ConfigQueryVariables,
  PingConfigQuery,
  PingConfigQueryVariables,
  ReportTelemetry,
  ReportTelemetryVariables,
} from './__generated__/Provider.graphql';
import { ConfigQuery_currentUser } from './types';

const CONFIG_QUERY = gql`
  query ConfigQuery {
    config {
      id
      algoliaIndexSuffix
      algoliaApplicationId
      algoliaSearchApiKey
      bankAddress
      relayAddress
      starkExchangeAddress
      ethereumNetworkId
      ethereumEndpoint
      landingTheme {
        slug
        cards
        subtitle
        userSource {
          id
          name
        }
        sport
      }
      viccTokensAddress
      baseballTokensAddress
      nbaTokensAddress
      viccCardsAddress
      cricketNationalSeriesTokensAddress
      viccEncryptionKey
      sponsorAccountAddress
      migratorAddress
      minimumReceiveWeiAmount
      marketFeeRateBasisPoints
      exchangeRate {
        id
        rates
      }
      defaultFiatCurrency
      ethAssetType
      ethQuantum
      vicc5 {
        id
        vicc5LeaguesAlgoliaFilters
      }
      currentLocation {
        countryCode
        regionCode
      }
    }
    currentUser {
      slug
      ...CurrentUserProvider_currentUser
    }
  }
  ${currentUser}
` as TypedDocumentNode<ConfigQuery, ConfigQueryVariables>;

const PING_QUERY = gql`
  query PingConfigQuery {
    config {
      id
      exchangeRate {
        id
        rates
      }
      minimumReceiveWeiAmount
    }
    currentUser {
      slug
    }
  }
` as TypedDocumentNode<PingConfigQuery, PingConfigQueryVariables>;

const TM_MUTATION = gql`
  mutation ReportTelemetry($input: reportTelemetryInput!) {
    reportTelemetry(input: $input) {
      errors {
        message
      }
    }
  }
` as TypedDocumentNode<ReportTelemetry, ReportTelemetryVariables>;

interface Props {
  children: ReactNode;
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

const pingInterval = 115_000 + getRandomInt(10_000);
const tmInterval = 30_000 + getRandomInt(5_000);

/**
 * Provides environment dependent configuration keys.
 * Aggregates all startup loading states so that initialization can be done in parallel
 */
export const ConfigProvider = ({ children }: Props) => {
  const { data, loading, refetch, updateQuery } = useQuery(CONFIG_QUERY);
  const [ping] = useLazyQuery(PING_QUERY, {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
    pollInterval: pingInterval,
  });
  const {
    flags: { useReportTelemetry },
  } = useFeatureFlags();

  const fontStatus = useFontFaceObserver([{ family: 'apercu-pro' }], {
    timeout: 1000,
  });
  const { refreshWsCable } = useGraphqlContext();

  const [tm] = useMutation(TM_MUTATION, {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  });
  const flushOperations = useTMContext()?.flushOperations;

  useEffect(() => {
    const timeout = setTimeout(() => {
      ping();
    }, pingInterval);
    return () => {
      clearTimeout(timeout);
    };
  }, [ping]);

  useInterval(
    () => {
      if (flushOperations) {
        const operations = flushOperations();
        if (!operations.length) {
          return;
        }
        tm({ variables: { input: { operations } } });
      }
    },
    useReportTelemetry ? tmInterval : null
  );

  const defaultFiatCurrency = useMemo(
    () => currency(data?.config?.defaultFiatCurrency),
    [data?.config]
  );

  if ((!data && loading) || fontStatus === 'initial') {
    return <LoadingIndicator fullHeight />;
  }

  if (!data?.config) {
    return null;
  }

  const { algoliaIndexSuffix, exchangeRate, minimumReceiveWeiAmount } =
    data.config;

  const algoliaCardIndexes: AlgoliaCardIndexes = {
    // cards indices
    'Cards New': `Card${algoliaIndexSuffix}`,
    'Cards Highest Average Score': `Card_HighestAverageScore${algoliaIndexSuffix}`,
    'Cards Highest Price': `Card_HighestPrice${algoliaIndexSuffix}`,
    'Cards Lowest Price': `Card_LowestPrice${algoliaIndexSuffix}`,
    'Cards Player Name': `Card_PlayerName${algoliaIndexSuffix}`,

    // blockchain cards indices
    'Ending Soon': `BlockchainCard_EndingSoon${algoliaIndexSuffix}`,
    'Newly Listed': `BlockchainCard_NewlyListed${algoliaIndexSuffix}`,
    'Highest Average Score': `BlockchainCard_HighestAverageScore${algoliaIndexSuffix}`,
    'Highest Price': `BlockchainCard${algoliaIndexSuffix}`,
    'Lowest Price': `BlockchainCard_LowestPrice${algoliaIndexSuffix}`,
    'Best Value': `BlockchainCard_BestValue${algoliaIndexSuffix}`,
    'Home Page Best Value': `BlockchainCard_BestValue${algoliaIndexSuffix}`,
    'Popular Player': `BlockchainCard_Popularity${algoliaIndexSuffix}`,
    'Home Page Popular Player': `BlockchainCard_Popularity${algoliaIndexSuffix}`,
    Hottest: `BlockchainCard_Hottest${algoliaIndexSuffix}`,
  };

  const algoliaIndexes: AlgoliaIndexes = {
    ...algoliaCardIndexes,
    User: `User${algoliaIndexSuffix}`,
    Player: `Player${algoliaIndexSuffix}`,
    Club: `Club${algoliaIndexSuffix}`,
    League: `League${algoliaIndexSuffix}`,
    Country: `Country${algoliaIndexSuffix}`,
    Competition: `Competition${algoliaIndexSuffix}`,
  };

  const { config } = data;

  return (
    <ConfigContextProvider
      value={{
        ...config,
        vicc5: {
          ...config.vicc5,
          vicc5LeaguesAlgoliaFilters: asObject(
            config.vicc5.vicc5LeaguesAlgoliaFilters
          ),
        },
        marketFeeRateBasisPoints: config.marketFeeRateBasisPoints / 10000,
        minimumReceiveWeiAmount,
        algoliaIndexes,
        algoliaCardIndexes,
        currentUser: data.currentUser,
        exchangeRate,
        refetch,
        updateQuery: (newCurrentUser: ConfigQuery_currentUser) => {
          updateQuery(() => ({ ...data, currentUser: newCurrentUser }));
          refreshWsCable();
        },
        defaultFiatCurrency,
      }}
    >
      {children}
    </ConfigContextProvider>
  );
};

export default ConfigProvider;

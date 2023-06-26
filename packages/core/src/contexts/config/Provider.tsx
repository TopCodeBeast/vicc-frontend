import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { ReactNode, useEffect, useMemo } from 'react';
import { useInterval } from 'react-use';

import useFontFaceObserver from '@sorare/use-font-face-observer';
import { Sport } from '__generated__/globalTypes';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { useGraphqlContext } from '@core/contexts/graphql';
import { useTMContext } from '@core/contexts/tm';
import useQuery from '@core/hooks/graphql/useQuery';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { currency } from '@core/lib/fiat';
import { asObject } from '@core/lib/json';
import { fromWei } from '@core/lib/wei';

import ConfigContextProvider, { AlgoliaCardIndexes, AlgoliaIndexes } from '.';
import { currentUser } from '../currentUser/queries';
import {
  ReportTelemetry,
  ReportTelemetryVariables,
} from './__generated__/Provider.graphql';
import { ConfigQuery, ConfigQuery_currentUser } from './types';

const contentfulData = gql`
  fragment ConfigQueryProvider_contentfulData on Config {
    responsiveBannerSet: responsiveBanners {
      id
      title
      responsiveBanners {
        id
        title
        description
        backgroundImageUrl
        mobileBackgroundImageUrl
        primaryButtonLabel
        primaryButton
        secondaryButtonLabel
        secondaryButton
        dark
        auctionDrop {
          id
          startDate
          endDate
          modalText
          livePrimaryButtonLabel
          livePrimaryButtonHref
          so5TournamentTypes {
            id
            so5LeaderboardType
          }
        }
      }
    }
    heroBannerSet: heroBanners {
      id
      title
      heroBanners {
        id
        title
        subtitle
        href
        hrefLabel
        pictureDesktopUrl
        videoDesktopUrl
        colorLeft
        colorRight
        background
        hrefColor
        secondaryHrefColor
        secondaryHref
        secondaryHrefLabel
      }
    }
    bannerSet: banners {
      id
      title
      banners {
        id
        title
        description
        url
        desktopPictureUrl
        mobilePictureUrl
      }
    }
    marketplacePromotionalEvents {
      sport
      events {
        name
        objectIds
        rewardDetailsHref
      }
    }
  }
`;

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
      sorareTokensAddress
      baseballTokensAddress
      nbaTokensAddress
      sorareCardsAddress
      footballNationalSeriesTokensAddress
      sorareEncryptionKey
      sponsorAccountAddress
      migratorAddress
      minimumReceiveWeiAmount
      walletChallenge
      footballMarketFeesBasisPoints: marketFeeRateBasisPoints(sport: FOOTBALL)
      nbaMarketFeesBasisPoints: marketFeeRateBasisPoints(sport: NBA)
      mlbMarketFeesBasisPoints: marketFeeRateBasisPoints(sport: BASEBALL)
      exchangeRate {
        id
        rates
      }
      defaultFiatCurrency
      ethAssetType
      ethQuantum
      so5 {
        id
        so5LeaguesAlgoliaFilters
        nextSo5FixtureTeams {
          ... on TeamInterface {
            slug
          }
        }
        noCardRoute {
          id
          nextOpenDate
          nextCloseDate
        }
      }
      currentLocation {
        countryCode
        regionCode
      }
      counts {
        usersCount
        football {
          starterPacksCount
          managerSalesCount
          auctionsCount
        }
      }
      ...ConfigQueryProvider_contentfulData
    }
    transferMarket {
      id
      cardWeiMinPrice
    }
    currentUser {
      slug
      ...CurrentUserProvider_currentUser
    }
  }
  ${currentUser}
  ${contentfulData}
`;

const PING_QUERY = gql`
  query PingConfigQuery {
    config {
      id
      exchangeRate {
        id
        rates
      }
      minimumReceiveWeiAmount
      ...ConfigQueryProvider_contentfulData
    }
    currentUser {
      slug
    }
  }
  ${contentfulData}
`;

const TM_MUTATION = gql`
  mutation ReportTelemetry($input: reportTelemetryInput!) {
    reportTelemetry(input: $input) {
      errors {
        message
      }
    }
  }
`;

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
  const { data, loading, refetch, updateQuery } =
    useQuery<ConfigQuery>(CONFIG_QUERY);
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

  const [tm] = useMutation<ReportTelemetry, ReportTelemetryVariables>(
    TM_MUTATION,
    {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore',
    }
  );
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

  const { config, transferMarket } = data;

  const marketFeesBasisPoints = {
    [Sport.FOOTBALL]: config.footballMarketFeesBasisPoints,
    [Sport.NBA]: config.nbaMarketFeesBasisPoints,
    [Sport.BASEBALL]: config.mlbMarketFeesBasisPoints,
  };

  return (
    <ConfigContextProvider
      value={{
        ...config,
        marketFeesBasisPoints,
        getMarketFeesRateBySport: (sport: Sport) =>
          marketFeesBasisPoints[sport] / 10000,
        so5: {
          ...config.so5,
          so5LeaguesAlgoliaFilters: asObject(
            config.so5.so5LeaguesAlgoliaFilters
          ),
        },
        transferMarket: {
          cardWeiMinPrice: transferMarket.cardWeiMinPrice,
          cardEthMinPrice: fromWei(transferMarket.cardWeiMinPrice),
        },
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

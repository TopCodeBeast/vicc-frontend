import { gql, useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { FeaturedPageDuration } from '@sorare/core/src/__generated__/globalTypes';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Tabs } from '@sorare/core/src/atoms/navigation/Tabs';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { theme } from '@sorare/core/src/style/theme';

import { PlayerTrend } from './PlayerTrend';
import { TopSale } from './TopSale';
import {
  MarketTrendsQuery,
  MarketTrendsQueryVariables,
} from './__generated__/index.graphql';

const MARKET_TRENDS_QUERY = gql`
  query MarketTrendsQuery($timeframe: FeaturedPageDuration!) {
    tokens {
      topSales(days: $timeframe, sport: FOOTBALL) {
        id
        token {
          assetId
          slug
        }
        ...TopSale_tokenOwner
      }
      topGainers(days: $timeframe, sport: FOOTBALL) {
        footballPlayer {
          slug
          ...PlayerTrend_player
        }
      }
      topVolume(days: $timeframe, sport: FOOTBALL) {
        footballPlayer {
          slug
          ...PlayerTrend_player
        }
      }
    }
  }
  ${TopSale.fragments.tokenOwner}
  ${PlayerTrend.fragments.player}
`;

const messages = defineMessages<FeaturedPageDuration>({
  DAYS_1: {
    id: 'Market.Home.Trends.24h',
    defaultMessage: '24 hours',
  },
  DAYS_7: {
    id: 'Market.Home.Trends.7d',
    defaultMessage: '7 days',
  },
  DAYS_30: {
    id: 'Market.Home.Trends.30d',
    defaultMessage: '30 days',
  },
});

const LoadingContainer = styled.div`
  height: 360px;
  display: flex;
  align-items: center;
`;
const StyledTabs = styled(Tabs)`
  margin: var(--double-unit) 0 var(--triple-unit);
  padding-left: 0;
  > button {
    flex: 0;
    font-weight: var(--t-bold);
    background-color: var(--c-neutral-300);
    color: var(--c-neutral-600);
    &:hover,
    &:focus,
    &.active {
      background-color: var(--c-neutral-400);
      color: var(--c-neutral-1000);
    }
  }
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--triple-unit);
  overflow-x: auto;
`;
const Column = styled.div`
  min-width: 75vw;
  flex: 0;
  display: flex;
  flex-direction: column;
  gap: var(--intermediate-unit);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    min-width: 340px;
  }
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const TREND_SIZE = 5;

export const Trends = () => {
  const {
    flags: { useFootballMarketTrends = false },
  } = useFeatureFlags();
  const [timeframe, setTimeframe] = useState(FeaturedPageDuration.DAYS_1);
  const [timeframesLoaded, setTimeframeLoaded] = useState<
    FeaturedPageDuration[]
  >([]);
  const track = useEvents();

  const filterTrendsToDisplay = useCallback(
    (trends: any[]) => {
      if (useFootballMarketTrends === 'even') {
        return trends.filter((_, i) => i % 2 === 0).slice(0, TREND_SIZE);
      }
      if (useFootballMarketTrends === 'odd') {
        return trends.filter((_, i) => i % 2 !== 0).slice(0, TREND_SIZE);
      }
      return trends.slice(0, TREND_SIZE);
    },
    [useFootballMarketTrends]
  );

  const [query, { data, loading }] = useLazyQuery<
    MarketTrendsQuery,
    MarketTrendsQueryVariables
  >(MARKET_TRENDS_QUERY, {
    variables: {
      timeframe,
    },
  });

  useEffect(() => {
    query({ variables: { timeframe } }).then(({ data: fetchedData }) => {
      if (!timeframesLoaded.includes(timeframe)) {
        setTimeframeLoaded(old => [...old, timeframe]);

        track('Load Market Trends', {
          timeframe,
          sales: filterTrendsToDisplay(fetchedData?.tokens?.topSales || []).map(
            tokenOwner => tokenOwner.token.slug
          ),
          onTheRise: filterTrendsToDisplay(
            fetchedData?.tokens?.topGainers || []
          ).map(topGainers => topGainers.footballPlayer.slug),
          volumes: filterTrendsToDisplay(
            fetchedData?.tokens?.topVolume || []
          ).map(topVolume => topVolume.footballPlayer.slug),
        });
      }
    });
  }, [filterTrendsToDisplay, query, timeframe, timeframesLoaded, track]);

  return (
    <div>
      <Title3 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="Market.Home.Trends.marketHighlights"
          defaultMessage="Market Highlights"
        />
      </Title3>
      <StyledTabs
        items={Object.values(FeaturedPageDuration).map(tm => ({
          key: tm,
          label: <FormattedMessage {...messages[tm]} />,
          active: timeframe === tm,
          onClick: () => setTimeframe(tm),
        }))}
      />
      {loading ? (
        <LoadingContainer>
          <LoadingIndicator />
        </LoadingContainer>
      ) : (
        <Row>
          <Column>
            <Text16 uppercase bold color="var(--c-neutral-600)">
              <FormattedMessage
                id="Market.Home.Trends.topSales"
                defaultMessage="Top sales"
              />
            </Text16>
            <List>
              {filterTrendsToDisplay(data?.tokens?.topSales || []).map(
                tokenOwner => (
                  <TopSale
                    key={tokenOwner.id}
                    tokenOwner={tokenOwner}
                    timeframe={timeframe}
                  />
                )
              )}
            </List>
          </Column>
          <Column>
            <Text16 uppercase bold color="var(--c-neutral-600)">
              <FormattedMessage
                id="Market.Home.Trends.playersToFollow"
                defaultMessage="Players to follow – all scarcities"
              />
            </Text16>
            <List>
              {filterTrendsToDisplay(data?.tokens?.topGainers || []).map(
                topGainer => (
                  <PlayerTrend
                    key={topGainer.footballPlayer?.slug}
                    player={topGainer.footballPlayer}
                    timeframe={timeframe}
                  />
                )
              )}
            </List>
          </Column>
          <Column>
            <Text16 uppercase bold color="var(--c-neutral-600)">
              <FormattedMessage
                id="Market.Home.Trends.mostExchangedPlayers"
                defaultMessage="Most exchanged players – Limited Cards"
              />
            </Text16>
            <List>
              {filterTrendsToDisplay(data?.tokens?.topVolume || []).map(
                topVolume => (
                  <PlayerTrend
                    key={topVolume.footballPlayer?.slug}
                    player={topVolume.footballPlayer}
                    timeframe={timeframe}
                  />
                )
              )}
            </List>
          </Column>
        </Row>
      )}
    </div>
  );
};

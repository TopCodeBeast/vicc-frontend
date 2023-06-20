import { useApolloClient } from '@apollo/client';
import { ReactNode, useCallback } from 'react';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import {
  Analytics_cardInfo,
  Analytics_tokenInfo,
} from '@sorare/core/src/contexts/events/__generated__/types.graphql';
import {
  getCardFromAssetId,
  getCardsFromAssetIds,
  getTokenFromAssetId,
  getTokensFromAssetIds,
} from '@sorare/core/src/contexts/events/types';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import { getInteractionContext } from '@sorare/core/src/lib/events';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { isA } from '@sorare/core/src/lib/gql';
import { fromWei } from '@sorare/core/src/lib/wei';

import { BidField_auction } from 'components/buyActions/BidField/__generated__/index.graphql';
import BuyingConfirmationProvider from '@sorare/marketplace/src/contexts/buyingConfirmation/Provider';
import { auctionMinNextBid } from '@sorare/marketplace/src/lib/auctions';

import MarketplaceContextProvider, { MarketplaceContextType } from '.';

type Analytics_tokenInfo_metadata_TokenBaseballMetadata =
  Analytics_tokenInfo['metadata'] & {
    __typename: 'TokenBaseballMetadata';
  };

type Analytics_tokenInfo_metadata_TokenFootballMetadata =
  Analytics_tokenInfo['metadata'] & {
    __typename: 'TokenFootballMetadata';
  };

interface Props
  extends Omit<
    MarketplaceContextType,
    | 'trackClickCard'
    | 'trackClickBundle'
    | 'trackClickBuy'
    | 'trackClickBid'
    | 'trackClickTrade'
    | 'trackRemoveMarketFilterChip'
    | 'secondaryMarketFeesRate'
  > {
  children: ReactNode;
  secondaryMarketFeesBasisPoints: number;
}

const cardInfoProperties = (card: Analytics_cardInfo) => ({
  cardSlug: card.slug,
  domesticLeagueSlug: card.player.activeClub?.domesticLeague?.slug || '',
  lastFiveSo5Appearances: card.player.lastFiveSo5Appearances || 0,
  lastFiveSo5AverageScore: card.lastFiveSo5AverageScore || 0.0,
  lastFifteenSo5Appearances: card.player.lastFifteenSo5Appearances || 0,
  lastFifteenSo5AverageScore: card.lastFifteenSo5AverageScore || 0.0,
  playerSlug: card.player.slug,
  position: card.positionTyped,
  positions: [],
  scarcity: card.rarity,
  season: card.season.startYear,
  serialNumber: card.serialNumber,
  teamSlug: card.team.slug,
  value: 0,
  lastFortySo5Appearances: 0,
  lastFortySo5AverageScore: 0,
  playerTier: '',
  tierVersion: 0,
});

const cardsInfoProperties = (cards: Analytics_cardInfo[]) => ({
  cardSlugs: cards.map(card => card.slug),
  domesticLeagueSlug: cards[0].player.activeClub?.domesticLeague?.slug || '',
  playerSlugs: cards.map(card => card.player.slug),
  positions: cards.map(card => card.positionTyped),
  cardCount: cards.length,
  limited: cards.filter(card => card.rarity === 'limited').length,
  rare: cards.filter(card => card.rarity === 'rare').length,
  superRare: cards.filter(card => card.rarity === 'super_rare').length,
  unique: cards.filter(card => card.rarity === 'unique').length,
  season: cards[0].season.startYear,
  teamSlug: cards[0].team.slug,
  value: 0,
});

type TokenBaseballMetadata = Analytics_tokenInfo_metadata_TokenBaseballMetadata;
type TokenFootballMetadata = Analytics_tokenInfo_metadata_TokenFootballMetadata;

const tokenInfoProperties = (token: Analytics_tokenInfo) => ({
  cardSlug: token.slug,
  domesticLeagueSlug: '',
  lastFiveSo5Appearances: 0,
  lastFiveSo5AverageScore: 0.0,
  lastFifteenSo5Appearances: 0,
  lastFifteenSo5AverageScore: 0.0,
  playerSlug: token.metadata.playerSlug,
  position: isA<TokenFootballMetadata>('TokenFootballMetadata', token.metadata)
    ? token.metadata.playerPosition
    : '',
  positions: isA<TokenBaseballMetadata>('TokenBaseballMetadata', token.metadata)
    ? token.metadata.playerPositions
    : [],
  scarcity: token.metadata.rarity,
  season: token.metadata.seasonStartYear,
  serialNumber: token.metadata.serialNumber,
  teamSlug: token.metadata.teamSlug,
  value: 0,
  lastFortySo5Appearances: 0,
  lastFortySo5AverageScore: 0,
  playerTier: '',
  tierVersion: 0,
});

const tokensInfoProperties = (tokens: Analytics_tokenInfo[]) => ({
  cardSlugs: tokens.map(token => token.slug),
  domesticLeagueSlug: '',
  playerSlugs: tokens.map(token => token.metadata.playerSlug),
  positions: tokens.flatMap(token => {
    if (isA<TokenBaseballMetadata>('TokenBaseballMetadata', token.metadata)) {
      return token.metadata.playerPositions;
    }
    if (isA<TokenFootballMetadata>('TokenFootballMetadata', token.metadata)) {
      return [token.metadata.playerPosition];
    }
    return [];
  }),
  cardCount: tokens.length,
  limited: tokens.filter(token => token.metadata.rarity === 'limited').length,
  rare: tokens.filter(token => token.metadata.rarity === 'rare').length,
  superRare: tokens.filter(token => token.metadata.rarity === 'super_rare')
    .length,
  unique: tokens.filter(token => token.metadata.rarity === 'unique').length,
  season: tokens[0].metadata.seasonStartYear,
  teamSlug: tokens[0].metadata.teamSlug,
  value: 0,
});

const MarketplaceProvider = ({
  children,
  secondaryMarketFeesBasisPoints,
  TokenPropertiesComponent,
  TokenTeamsComponent,
  TokenAuctionEligibility,
  MobileTokenDetailsComponent,
}: Props) => {
  const client = useApolloClient();
  const track = useEvents();
  const trackClickCard = useCallback(
    (assetId: string, sport: Sport) => {
      if (sport === Sport.FOOTBALL) {
        getCardFromAssetId(client, assetId).then(card => {
          const params = {
            sport,
            ...cardInfoProperties(card),
            secondary: Boolean(card.user),
          };
          track('Click Card', params);
        });
      } else if ([Sport.BASEBALL, Sport.NBA].includes(sport)) {
        getTokenFromAssetId(client, assetId).then(token => {
          const params = {
            sport,
            ...tokenInfoProperties(token),
            secondary: Boolean(token.owner?.user),
          };
          track('Click Card', params);
        });
      }
    },
    [client, track]
  );

  const trackClickBundle = useCallback(
    (auctionId: string, assetIds: string[], sport: Sport, subPath?: string) => {
      const sharedProperties = {
        auctionId,
        secondary: false,
        interactionContext: getInteractionContext(subPath),
        sport,
      };

      if (sport === Sport.FOOTBALL) {
        getCardsFromAssetIds(client, assetIds).then(cards => {
          const params = {
            ...sharedProperties,
            ...cardsInfoProperties(cards),
          };

          track('Click Bundle', params);
        });
      } else if ([Sport.BASEBALL, Sport.NBA].includes(sport)) {
        getTokensFromAssetIds(client, assetIds).then(tokens => {
          const params = {
            ...sharedProperties,
            ...tokensInfoProperties(tokens),
          };

          track('Click Bundle', params);
        });
      }
    },
    [client, track]
  );

  const trackClickBuy = useCallback(
    (
      offerId: string,
      priceInWei: string,
      eurAmount: number,
      assetIds: string[],
      sport: Sport,
      subPath?: string
    ) => {
      const sharedProperties = {
        offerId,
        ethAmount: fromWei(priceInWei),
        eurAmount,
        secondary: true,
        interactionContext: getInteractionContext(subPath),
        sport,
      };

      if (sport === Sport.FOOTBALL) {
        getCardsFromAssetIds(client, assetIds).then(cards => {
          if (cards.length === 1) {
            const params = {
              ...sharedProperties,
              ...cardInfoProperties(cards[0]),
            };

            track('Click Buy', params);
          } else {
            const params = {
              ...sharedProperties,
              ...cardsInfoProperties(cards),
            };

            track('Click Bundled Buy', params);
          }
        });
      } else if ([Sport.BASEBALL, Sport.NBA].includes(sport)) {
        getTokensFromAssetIds(client, assetIds).then(tokens => {
          if (tokens.length === 1) {
            const params = {
              ...sharedProperties,
              ...tokenInfoProperties(tokens[0]),
            };

            track('Click Buy', params);
          } else {
            const params = {
              ...sharedProperties,
              ...tokensInfoProperties(tokens),
            };

            track('Click Bundled Buy', params);
          }
        });
      }
    },
    [client, track]
  );

  const trackClickBid = useCallback(
    (
      auction: BidField_auction,
      eurAmount: number,
      assetIds: string[],
      sport: Sport,
      subPath?: string
    ) => {
      const sharedProperties = {
        auctionId: auction.id,
        count: auction.bidsCount,
        ethAmount: fromWei(auctionMinNextBid(auction)),
        eurAmount,
        secondary: false,
        interactionContext: getInteractionContext(subPath),
        sport,
      };

      if (sport === Sport.FOOTBALL) {
        getCardsFromAssetIds(client, assetIds).then(cards => {
          if (cards.length === 1) {
            const params = {
              ...sharedProperties,
              ...cardInfoProperties(cards[0]),
            };

            track('Click Bid', params);
          } else {
            const params = {
              ...sharedProperties,
              ...cardsInfoProperties(cards),
            };

            track('Click Bundled Bid', params);
          }
        });
      } else if ([Sport.BASEBALL, Sport.NBA].includes(sport)) {
        getTokensFromAssetIds(client, assetIds).then(tokens => {
          if (tokens.length === 1) {
            const params = {
              ...sharedProperties,
              ...tokenInfoProperties(tokens[0]),
            };

            track('Click Bid', params);
          } else {
            const params = {
              ...sharedProperties,
              ...tokensInfoProperties(tokens),
            };

            track('Click Bundled Bid', params);
          }
        });
      }
    },
    [client, track]
  );

  const trackClickTrade = useCallback(
    (counterOfferId?: string) => {
      const params = {
        offerId: counterOfferId ? idFromObject(counterOfferId)! : '',
      };
      track('Click Trade', params);
    },
    [track]
  );

  const trackRemoveMarketFilterChip = useCallback(
    (attribute: string, value: string, sport: Sport) => {
      const params = {
        filterName: attribute,
        filterValue: value,
        sport,
      };
      track('Remove Market Filter Chip', params);
    },
    [track]
  );

  return (
    <MarketplaceContextProvider
      value={{
        secondaryMarketFeesRate: secondaryMarketFeesBasisPoints / 10000,
        TokenPropertiesComponent,
        TokenTeamsComponent,
        TokenAuctionEligibility,
        MobileTokenDetailsComponent,
        trackClickBundle,
        trackClickBid,
        trackClickBuy,
        trackClickCard,
        trackClickTrade,
        trackRemoveMarketFilterChip,
      }}
    >
      <BuyingConfirmationProvider>{children}</BuyingConfirmationProvider>
    </MarketplaceContextProvider>
  );
};

export default MarketplaceProvider;

import { useApolloClient } from '@apollo/client';
import { ReactNode, useCallback, useState } from 'react';

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
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { getInteractionContext } from '@sorare/core/src/lib/events';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { isType } from '@sorare/core/src/lib/gql';
import { fromWei } from '@sorare/core/src/lib/wei';

import { BidField_auction } from '@marketplace/components/buyActions/BidField/__generated__/index.graphql';
import BuyingConfirmationProvider from '@marketplace/contexts/buyingConfirmation/Provider';

import MarketplaceContextProvider, { MarketplaceContextType } from '.';

interface Props
  extends Omit<
    MarketplaceContextType,
    | 'trackClickCard'
    | 'trackClickBundle'
    | 'trackClickBuy'
    | 'trackClickBid'
    | 'trackClickTrade'
    | 'trackRemoveMarketFilterChip'
  > {
  children: ReactNode;
}

const cardInfoProperties = (card: Analytics_cardInfo) => ({
  cardSlug: card.slug,
  domesticLeagueSlug: card.player.activeClub?.domesticLeague?.slug || '',
  lastFiveVicc5Appearances: card.player.lastFiveVicc5Appearances || 0,
  lastFiveVicc5AverageScore: card.lastFiveVicc5AverageScore || 0.0,
  lastFifteenVicc5Appearances: card.player.lastFifteenVicc5Appearances || 0,
  lastFifteenVicc5AverageScore: card.lastFifteenVicc5AverageScore || 0.0,
  playerSlug: card.player.slug,
  position: card.positionTyped,
  positions: [],
  scarcity: card.rarity,
  season: card.season.startYear,
  serialNumber: card.serialNumber,
  teamSlug: card.team.slug,
  value: 0,
  lastFortyVicc5Appearances: 0,
  lastFortyVicc5AverageScore: 0,
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

const tokenInfoProperties = (token: Analytics_tokenInfo) => ({
  cardSlug: token.slug,
  domesticLeagueSlug: '',
  lastFiveVicc5Appearances: 0,
  lastFiveVicc5AverageScore: 0.0,
  lastFifteenVicc5Appearances: 0,
  lastFifteenVicc5AverageScore: 0.0,
  playerSlug: token.metadata.playerSlug,
  position: isType(token.metadata, 'TokenCricketMetadata')
    ? token.metadata.playerPosition
    : '',
  positions: isType(token.metadata, 'TokenBaseballMetadata')
    ? token.metadata.playerPositions
    : [],
  scarcity: token.metadata.rarity,
  season: token.metadata.seasonStartYear,
  serialNumber: token.metadata.serialNumber,
  teamSlug: token.metadata.teamSlug,
  value: 0,
  lastFortyVicc5Appearances: 0,
  lastFortyVicc5AverageScore: 0,
  playerTier: '',
  tierVersion: 0,
});

const tokensInfoProperties = (tokens: Analytics_tokenInfo[]) => ({
  cardSlugs: tokens.map(token => token.slug),
  domesticLeagueSlug: '',
  playerSlugs: tokens.map(token => token.metadata.playerSlug),
  positions: tokens.flatMap(token => {
    if (isType(token.metadata, 'TokenBaseballMetadata')) {
      return token.metadata.playerPositions;
    }
    if (isType(token.metadata, 'TokenCricketMetadata')) {
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
  TokenPropertiesComponent,
  TokenTeamsComponent,
  TokenAuctionEligibility,
  MobileTokenDetailsComponent,
}: Props) => {
  const client = useApolloClient();
  const track = useEvents();
  const [hideDetails, setHideDetails] = useState(false);
  const trackClickCard = useCallback(
    (assetId: string, sport: Sport) => {
      if (sport === Sport.CRICKET) {
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

      if (sport === Sport.CRICKET) {
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

      if (sport === Sport.CRICKET) {
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
      monetaryAmount: MonetaryAmountOutput,
      assetIds: string[],
      sport: Sport,
      subPath?: string
    ) => {
      const sharedProperties = {
        auctionId: auction.id,
        count: auction.bidsCount,
        ethAmount: fromWei(monetaryAmount.wei),
        eurAmount: monetaryAmount.eur,
        secondary: false,
        interactionContext: getInteractionContext(subPath),
        sport,
      };

      if (sport === Sport.CRICKET) {
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
        hideDetails,
        setHideDetails,
      }}
    >
      <BuyingConfirmationProvider>{children}</BuyingConfirmationProvider>
    </MarketplaceContextProvider>
  );
};

export default MarketplaceProvider;

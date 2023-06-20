import { isPast, parseISO } from 'date-fns';

import { GqlType } from '@sorare/core/src/lib/gql';

interface TokenAuction {
  id: string;
  currentPrice: string;
  endDate: string;
}
export interface Card extends GqlType {
  assetId: string;
  liveSingleSaleOffer?: {
    priceWei: string;
  } | null;
  latestEnglishAuction?: TokenAuction | null;
}

export const getTokenAuctionPrice = (tokenAuction: TokenAuction) => {
  if (tokenAuction && !isPast(parseISO(tokenAuction.endDate)))
    return Number(tokenAuction.currentPrice);
  return 0;
};

export const getCardPrice = <T extends Card>(card: T | null): number => {
  if (!card) return 0;
  if (card.liveSingleSaleOffer)
    return Number(card.liveSingleSaleOffer.priceWei);
  if (card.latestEnglishAuction)
    return getTokenAuctionPrice(card.latestEnglishAuction);
  return 0;
};

const useSortCardsByPrice = <T extends Card>() => {
  return (card: T[]) => {
    return card.sort((a, b) => {
      return getCardPrice(b) - getCardPrice(a);
    });
  };
};

export default useSortCardsByPrice;

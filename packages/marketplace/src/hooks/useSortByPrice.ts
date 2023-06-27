import Big from 'bignumber.js';
import { isPast, parseISO } from 'date-fns';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import { GqlType } from '@sorare/core/src/lib/gql';

interface TokenAuction {
  id: string;
  currentPrice: string;
  currency: SupportedCurrency;
  endDate: string;
}
export interface Card extends GqlType {
  assetId?: string | null;
  liveSingleSaleOffer?: {
    priceWei: string;
  } | null;
  latestEnglishAuction?: TokenAuction | null;
}

export const useSortByPrice = <T extends Card>() => {
  const { toMonetaryAmount } = useMonetaryAmount();

  const getBigWeiTokenAuctionPrice = (tokenAuction: TokenAuction) => {
    if (tokenAuction && !isPast(parseISO(tokenAuction.endDate))) {
      const { currency, currentPrice } = tokenAuction;
      const monetaryAmount = toMonetaryAmount({
        [currency.toLowerCase()]: currentPrice,
        referenceCurrency: currency,
      });
      return new Big(monetaryAmount.wei);
    }
    return new Big(0);
  };

  const getBigWeiCardPrice = (card: T | null): Big => {
    if (!card) return new Big(0);
    if (card.liveSingleSaleOffer)
      return new Big(card.liveSingleSaleOffer.priceWei);
    if (card.latestEnglishAuction)
      return getBigWeiTokenAuctionPrice(card.latestEnglishAuction);
    return new Big(0);
  };

  return (card: T[]) => {
    return card.sort((a, b) => {
      return getBigWeiCardPrice(b).minus(getBigWeiCardPrice(a)).toNumber();
    });
  };
};

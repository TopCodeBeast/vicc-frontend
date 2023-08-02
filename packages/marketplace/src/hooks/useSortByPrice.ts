import Big from 'bignumber.js';
import { isPast, parseISO } from 'date-fns';

import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import { Card } from '@sorare/core/src/lib/cards';

export const useSortByPrice = <T extends Card>() => {
  const { toMonetaryAmount } = useMonetaryAmount();

  const getBigWeiTokenAuctionPrice = (
    tokenAuction: NonNullable<Card['latestEnglishAuction']>
  ) => {
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
    if (card.liveSingleSaleOffer) {
      const monetaryAmount = toMonetaryAmount(
        card.liveSingleSaleOffer.receiverSide.amounts
      );
      return new Big(monetaryAmount.wei);
    }
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

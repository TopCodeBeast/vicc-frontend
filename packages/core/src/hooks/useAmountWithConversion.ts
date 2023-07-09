import { Currency } from '__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';
import { MonetaryAmountParams } from '@core/lib/monetaryAmount';
import { ETH_DECIMAL_PLACES } from '@core/lib/wei';

import useMonetaryAmount from './useMonetaryAmount';

export type Props = {
  monetaryAmount: MonetaryAmountParams;
  primaryCurrency?: Currency;
  usingLegacyFiat?: boolean;
};

//TODO*******************
const useAmountWithConversion = ({
  monetaryAmount,
  primaryCurrency,
  usingLegacyFiat,
}: Props) => {
  const { formatNumber, formatWei } = useIntlContext();
  const { toMonetaryAmount } = useMonetaryAmount();
  // const {
  //   fiatCurrency: userFiatCurrency,
  //   currency: userCurrency,
  //   walletPreferences: { onlyShowFiatCurrency },
  // } = useCurrentUserContext();
  const onlyShowFiatCurrency = false;

  const fullMonetaryAmount = toMonetaryAmount(monetaryAmount);

  const monetaryAmountFiatKey = 'usd';
  // const monetaryAmountFiatKey = userFiatCurrency.code.toLowerCase() as
  //   | 'eur'
  //   | 'usd'
  //   | 'gbp';
  const fiatAmount = fullMonetaryAmount[monetaryAmountFiatKey];
  const fiatFormatted = formatNumber(
    usingLegacyFiat ? fiatAmount : fiatAmount / 100,
    {
      style: 'currency',
      currency: 'usd', //userFiatCurrency.code,
    }
  );

  const weiAmount = fullMonetaryAmount.wei;
  const ethFormatted = formatWei(weiAmount, undefined, {
    maximumFractionDigits: ETH_DECIMAL_PLACES,
  });

  const actualPrimaryCurrency = Currency.ETH;//primaryCurrency || userCurrency;

  const exponent =
    actualPrimaryCurrency === Currency.ETH ? fiatFormatted : ethFormatted;

  return {
    main: actualPrimaryCurrency === Currency.ETH ? ethFormatted : fiatFormatted,
    exponent: primaryCurrency || !onlyShowFiatCurrency ? exponent : null,
  };
};

export default useAmountWithConversion;

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';
import { fromWei } from '@sorare/core/src/lib/wei';

interface PriceFiat {
  eur: number;
  usd: number;
  gbp: number;
}
const useFormatWithCurrency = (
  priceWei: string,
  priceFiat: PriceFiat | undefined,
  forceCurrency: Currency | undefined
): any => {
  const { convertFromWei } = useCurrencyConverters();
  const { currency, fiatCurrency } = useCurrentUserContext();
  const actualCurrency = forceCurrency || currency;
  const displayFiat = actualCurrency === Currency.FIAT;
  const maximumFractionDigits = displayFiat ? 2 : 6;
  const minimumFractionDigits = displayFiat ? undefined : 4;
  const currencySymbol = displayFiat ? fiatCurrency.code : 'ETH';
  const fiatAmount = priceFiat
    ? priceFiat[fiatCurrency.code.toLowerCase() as keyof PriceFiat]
    : convertFromWei(priceWei, fiatCurrency.code);
  const amountToDisplay = displayFiat
    ? fiatAmount
    : fromWei(priceWei, maximumFractionDigits);

  return {
    amountToDisplay,
    currencySymbol,
    maximumFractionDigits,
    minimumFractionDigits,
  };
};

export default useFormatWithCurrency;

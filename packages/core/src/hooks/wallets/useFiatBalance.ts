import { FiatCurrency } from '__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';

export const useFiatBalance = () => {
  const {
    fiatCurrency: { code: fiatCurrencyFromUserSettings },
  } = useCurrentUserContext();
  const { fiatWalletAccountable: accountable } = useCurrentUserContext();
  const { formatNumber } = useIntlContext();

  const availableBalance = (accountable?.availableBalance || 0) / 100;
  const availableBalanceInCents = accountable?.availableBalance || 0;

  const fiatCurrency =
    accountable?.currency || (fiatCurrencyFromUserSettings as FiatCurrency);

  const fiatCurrencyForMonetaryAmount = fiatCurrency.toLowerCase() as
    | 'eur'
    | 'usd'
    | 'gbp';
  const availableBalanceWithCurrencySymbol = formatNumber(availableBalance, {
    style: 'currency',
    currency: fiatCurrency,
  });

  return {
    hasActiveFiatBalance: !!accountable,
    availableBalance,
    availableBalanceInCents,
    fiatCurrency,
    fiatCurrencyForMonetaryAmount,
    availableBalanceWithCurrencySymbol,
  };
};

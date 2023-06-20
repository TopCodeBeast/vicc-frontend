import { FiatCurrency } from '__generated__/globalTypes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';

export const useFiatBalance = () => {
  const {
    fiatCurrency: { code: fiatCurrencyFromUserSettings },
  } = useCurrentUserContext();
  const { fiatWalletAccountable: accountable } = useCurrentUserContext();
  const { formatNumber } = useIntlContext();

  const availableBalance = (accountable?.availableBalance || 0) / 100;

  const fiatCurrency =
    accountable?.currency || (fiatCurrencyFromUserSettings as FiatCurrency);

  const availableBalanceWithCurrencySymbol = formatNumber(availableBalance, {
    style: 'currency',
    currency: fiatCurrency,
  });

  return {
    hasActiveFiatBalance: !!accountable,
    availableBalance,
    fiatCurrency,
    availableBalanceWithCurrencySymbol,
  };
};

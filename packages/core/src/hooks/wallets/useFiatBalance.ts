import {
  FiatCurrency,
  FiatWalletAccountState,
} from '__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';

export const useFiatBalance = () => {
  const {
    fiatWalletAccountable: accountable,
    fiatCurrency: { code: fiatCurrencyFromUserSettings },
  } = useCurrentUserContext();

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

  const canListAndTrade =
    !!accountable &&
    [
      FiatWalletAccountState.OWNER,
      FiatWalletAccountState.VALIDATED_OWNER,
    ].includes(accountable.state);

  const canDepositAndWithdraw =
    !!accountable &&
    accountable.state === FiatWalletAccountState.VALIDATED_OWNER;

  return {
    kycStatus: accountable?.kycStatus || undefined,
    refusedReason: accountable?.kycRefusedReason || undefined,
    fiatWalletState: accountable?.state,
    canPay: !!accountable,
    canListAndTrade,
    canDepositAndWithdraw,
    fiatBalanceStatus: accountable?.state,
    availableBalance,
    availableBalanceInCents,
    fiatCurrency,
    fiatCurrencyForMonetaryAmount,
    availableBalanceWithCurrencySymbol,
  };
};

import { useMemo } from 'react';

import { SupportedCurrency } from '__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';

import {
  AcceptedCurrenciesValue,
  useAcceptedCurrencies,
} from './useAcceptedCurrencies';
import { useFiatBalance } from './wallets/useFiatBalance';

export const useSettlementCurrencies = () => {
  const { acceptedCurrencies } = useAcceptedCurrencies();
  const {
    fiatCurrency: { code },
  } = useCurrentUserContext();

  const { canListAndTrade } = useFiatBalance();

  const settlementCurrencies = useMemo(() => {
    if (!canListAndTrade) return [SupportedCurrency.WEI];
    switch (acceptedCurrencies) {
      case AcceptedCurrenciesValue.BOTH:
        return [SupportedCurrency.WEI, code as SupportedCurrency];
      case AcceptedCurrenciesValue.ETH:
        return [SupportedCurrency.WEI];
      case AcceptedCurrenciesValue.FIAT:
        return [code as SupportedCurrency];
      default:
        return [code as SupportedCurrency];
    }
  }, [acceptedCurrencies, code, canListAndTrade]);

  return settlementCurrencies;
};

import { Currency, SupportedCurrency } from '__generated__/globalTypes';

export const getCurrenciesFromSettlementCurrencies = (
  settlementCurrencies: SupportedCurrency[]
) =>
  settlementCurrencies.reduce<Currency[]>((acc, curr) => {
    if (curr === SupportedCurrency.WEI) return [...acc, Currency.ETH];
    if (!acc.includes(Currency.FIAT)) return [...acc, Currency.FIAT];
    return acc;
  }, []);

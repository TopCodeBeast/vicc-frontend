import { useConfigContext } from 'contexts/config';
import MonetaryAmount, { MonetaryAmountParams } from '@sorare/core/src/lib/monetaryAmount';

const useMonetaryAmount = () => {
  const { exchangeRate } = useConfigContext();

  const toMonetaryAmount = (params: MonetaryAmountParams) => {
    const monetaryAmount = new MonetaryAmount(params);

    return monetaryAmount.inCurrencies(exchangeRate.rates.eth);
  };

  return { toMonetaryAmount };
};

export default useMonetaryAmount;

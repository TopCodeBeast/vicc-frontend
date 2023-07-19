import Big from 'bignumber.js';

import { useConfigContext } from '@core/contexts/config';

const useUnquantizeAmount = () => {
  const { ethQuantum } = useConfigContext();

  return (amount: string) =>
    new Big(amount).multipliedBy(ethQuantum).toString();
};

export default useUnquantizeAmount;

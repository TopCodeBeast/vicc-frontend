import Big from 'bignumber.js';
import { useMemo } from 'react';

import { useConfigContext } from '@core/contexts/config';

export default () => {
  const { currentUser } = useConfigContext();

  return useMemo(() => {
    if (!currentUser) return '0';

    return new Big(currentUser.availableBalanceForWithdrawal).lt(
      currentUser?.bankBalance
    )
      ? currentUser.availableBalanceForWithdrawal
      : currentUser.bankBalance;
  }, [currentUser]);
};

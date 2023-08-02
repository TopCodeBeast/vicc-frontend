import { useContext, useEffect } from 'react';

import { MessagingContext, PrepareEthDeposit } from '@sorare/wallet-shared';
import usePrepareEthDeposit from '@core/contexts/blockchain/usePrepareEthDeposit';

export default () => {
  const { registerHandler } = useContext(MessagingContext)!;
  const prepareEthDeposit = usePrepareEthDeposit();

  useEffect(() => {
    registerHandler<PrepareEthDeposit>(
      'prepareEthDeposit',
      async ({ weiAmount }) => {
        const result = await prepareEthDeposit(weiAmount);

        return { result: result || undefined };
      }
    );
  }, [registerHandler, prepareEthDeposit]);
};

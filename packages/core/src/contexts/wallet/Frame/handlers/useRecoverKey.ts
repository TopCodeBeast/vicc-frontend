import { useContext, useEffect } from 'react';

import { MessagingContext, RecoverKey } from '@sorare/wallet-shared';
import { useAuthContext } from '@core/contexts/auth';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useWalletContext } from '@core/contexts/wallet';
import { formatUpdateUserErrors } from '@core/lib/http';

export default () => {
  const { registerHandler } = useContext(MessagingContext)!;
  const { updateUser } = useAuthContext();
  const { handleWalletSuccessullyRecovered } = useWalletContext();
  const { refetch, currentUser } = useCurrentUserContext();

  useEffect(
    () =>
      registerHandler<RecoverKey>(
        'recoverKey',
        async ({ passwordHash, userPrivateKey }) => {
          if (!currentUser) throw new Error('Missing current user');
          const { errors } = await updateUser({
            currentPasswordHash: passwordHash,
            viccPrivateKey: userPrivateKey,
          });

          if (errors) return { error: formatUpdateUserErrors(errors) };

          await handleWalletSuccessullyRecovered();
          return {};
        }
      ),
    [
      handleWalletSuccessullyRecovered,
      registerHandler,
      updateUser,
      refetch,
      currentUser,
    ]
  );
};

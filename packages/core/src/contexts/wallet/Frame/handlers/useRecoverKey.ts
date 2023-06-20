import { useContext, useEffect } from 'react';

import { MessagingContext, RecoverKey } from '@sorare/wallet-shared';
import { useAuthContext } from '@sorare/core/src/contexts/auth';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useWalletContext } from '@sorare/core/src/contexts/wallet';
import { formatUpdateUserErrors } from '@sorare/core/src/lib/http';

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
            sorarePrivateKey: userPrivateKey,
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

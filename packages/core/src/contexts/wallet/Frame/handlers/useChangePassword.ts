import { useContext, useEffect } from 'react';

import { ChangePassword, MessagingContext } from '@sorare/wallet-shared';
import { useAuthContext } from 'contexts/auth';
import { useCurrentUserContext } from 'contexts/currentUser';
import { formatUpdateUserErrors } from '@sorare/core/src/lib/http';

export default () => {
  const { registerHandler } = useContext(MessagingContext)!;
  const { currentUser } = useCurrentUserContext();
  const { updateUser } = useAuthContext();

  useEffect(
    () =>
      registerHandler<ChangePassword>(
        'changePassword',
        async ({ currentPasswordHash, passwordHash, userPrivateKey }) => {
          if (!currentUser) return { error: 'User should be authenticated' };

          const { errors } = await updateUser({
            currentPasswordHash,
            passwordHash,
            sorarePrivateKey: userPrivateKey,
          });

          if (errors) return { error: formatUpdateUserErrors(errors) };

          return {};
        }
      ),
    [registerHandler, updateUser, currentUser]
  );
};

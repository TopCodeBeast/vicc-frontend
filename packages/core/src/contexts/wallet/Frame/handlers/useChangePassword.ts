import { useContext, useEffect } from 'react';

import { ChangePassword, MessagingContext } from '@sorare/wallet-shared';
import { useAuthContext } from '@core/contexts/auth';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { formatUpdateUserErrors } from '@core/lib/http';

export default () => {
  const { registerHandler } = useContext(MessagingContext)!;
  const { currentUser } = useCurrentUserContext();
  const { changePassword } = useAuthContext();

  useEffect(
    () =>
      registerHandler<ChangePassword>(
        'changePassword',
        async ({ currentPasswordHash, passwordHash, userPrivateKey }) => {
          if (!currentUser) return { error: 'User should be authenticated' };

          const { errors } = await changePassword({
            currentPasswordHash,
            passwordHash,
            viccPrivateKey: userPrivateKey,
          });

          if (errors) return { error: formatUpdateUserErrors(errors) };

          return {};
        }
      ),
    [registerHandler, changePassword, currentUser]
  );
};

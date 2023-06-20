import { useContext, useEffect } from 'react';

import { MessagingContext, ResetPassword } from '@sorare/wallet-shared';
import { useAuthContext } from 'contexts/auth';
import { formatUpdateUserErrors } from '@sorare/core/src/lib/http';

type Props = {
  onSuccess?: () => void;
};
export default ({ onSuccess }: Props) => {
  const { registerHandler } = useContext(MessagingContext)!;
  const { resetPassword } = useAuthContext();

  useEffect(
    () =>
      registerHandler<ResetPassword>(
        'resetPassword',
        async ({ passwordHash, resetPasswordToken }) => {
          const { errors } = await resetPassword(
            passwordHash,
            resetPasswordToken
          );

          if (errors) return { error: formatUpdateUserErrors(errors) };

          if (onSuccess) onSuccess();
          return {};
        }
      ),
    [registerHandler, resetPassword, onSuccess]
  );
};

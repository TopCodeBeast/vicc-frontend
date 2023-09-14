import { useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { EncryptedPrivateKey } from '@sorare/wallet-shared';

import { ChangePasswordMutation } from './__generated__/queries.graphql';
import { CHANGE_PASSWORD_MUTATION } from './queries';

type ChangePasswordMutation_changePassword = NonNullable<
  ChangePasswordMutation['changePassword']
>;

export interface ChangePasswordArgs {
  clientMutationId?: string;
  password: string;
  newPassword: string;
}

export default (): ((
  args: ChangePasswordArgs
) => Promise<ChangePasswordMutation_changePassword | null | undefined>) => {
  const [changePassword] = useMutation(CHANGE_PASSWORD_MUTATION);

  return useCallback(
    async ({
      clientMutationId,
      password,
      newPassword,
    }: ChangePasswordArgs): Promise<
      ChangePasswordMutation_changePassword | null | undefined
    > => {
      const result = await changePassword({
        variables: {
          input: {
            clientMutationId,
            password,
            newPassword,
          },
        },
      });

      return result.data?.changePassword;
    },
    [changePassword]
  );
};

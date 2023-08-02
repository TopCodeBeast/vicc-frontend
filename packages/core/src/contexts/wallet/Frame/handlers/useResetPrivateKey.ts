import { TypedDocumentNode, gql, useMutation } from '@apollo/client';
import { useContext, useEffect } from 'react';

import {
  MessagingContext,
  ResetPrivateKey as ResetPrivateKeyMessage,
} from '@sorare/wallet-shared';
import { useResetPrivateKeyContext } from '@core/contexts/resetPrivateKey';
import { formatUpdateUserErrors } from '@core/lib/http';

import {
  ResetPrivateKeyMutation,
  ResetPrivateKeyMutationVariables,
} from './__generated__/useResetPrivateKey.graphql';

const RESET_PRIVATE_KEY_MUTATION = gql`
  mutation ResetPrivateKeyMutation($input: resetPrivateKeyInput!) {
    resetPrivateKey(input: $input) {
      currentUser {
        id
        slug
        sorarePrivateKey {
          iv
          salt
          encryptedPrivateKey
        }
      }
    }
  }
` as TypedDocumentNode<
  ResetPrivateKeyMutation,
  ResetPrivateKeyMutationVariables
>;

export default () => {
  const { registerHandler } = useContext(MessagingContext)!;
  const { setResetPrivateKey } = useResetPrivateKeyContext();

  const [resetPrivateKey] = useMutation(RESET_PRIVATE_KEY_MUTATION);

  useEffect(() => {
    registerHandler<ResetPrivateKeyMessage>(
      'resetPrivateKey',
      async ({ starkKey }) => {
        const { errors } = await resetPrivateKey({
          variables: { input: { starkKey } },
        });
        if (errors) return { error: formatUpdateUserErrors(errors) };
        setResetPrivateKey(true);
        return {};
      }
    );
  }, [registerHandler, resetPrivateKey, setResetPrivateKey]);
};

import { gql, useApolloClient } from '@apollo/client';
import { useState } from 'react';

import { PrivateKeyRecoveryOption } from '__generated__/globalTypes';
import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';
import { useWalletContext } from '@core/contexts/wallet';
import useMutation from '@core/hooks/graphql/useMutation';
import { formatGqlErrors } from '@core/lib/gql';

import {
  PrivateKeyRecoveryPayloadsQuery,
  SendWalletRecoveryMutation,
  SendWalletRecoveryMutationVariables,
} from './__generated__/useSendRecoverKey.graphql';

const PRIVATE_KEY_RECOVERY_PAYLOADS_FRAGMENT = gql`
  fragment PrivateKeyRecoveryPayloads_CurrentUser on CurrentUser {
    slug
    wallet {
      privateKeyRecoveryPayloads {
        iv
        ivTemp
        encryptionKey
        payload
      }
    }
  }
`;

const SEND_WALLET_RECOVERY_MUTATION = gql`
  mutation SendWalletRecoveryMutation($input: sendWalletRecoveryInput!) {
    sendWalletRecovery(input: $input) {
      currentUser {
        slug
        ...PrivateKeyRecoveryPayloads_CurrentUser
      }
      errors {
        path
        message
        code
      }
    }
  }
  ${PRIVATE_KEY_RECOVERY_PAYLOADS_FRAGMENT}
`;

const PRIVATE_KEY_RECOVERY_PAYLOADS_QUERY = gql`
  query PrivateKeyRecoveryPayloadsQuery {
    currentUser {
      slug
      ...PrivateKeyRecoveryPayloads_CurrentUser
    }
  }
  ${PRIVATE_KEY_RECOVERY_PAYLOADS_FRAGMENT}
`;

export const useSendRecoverKey = () => {
  const { promptRestoreWallet } = useWalletContext();
  const { showNotification } = useSnackNotificationContext();
  const apolloClient = useApolloClient();
  const [sending, setSending] = useState(false);

  const [mutate] = useMutation<
    SendWalletRecoveryMutation,
    SendWalletRecoveryMutationVariables
  >(SEND_WALLET_RECOVERY_MUTATION, { showErrorsWithSnackNotification: true });

  const sendRecoveryKey = async (option: PrivateKeyRecoveryOption) => {
    setSending(true);
    const result = await mutate({
      variables: {
        input: {
          method: option.method,
          destination: option.destination,
        },
      },
    });

    setSending(false);

    const { privateKeyRecoveryPayloads } =
      result.data?.sendWalletRecovery?.currentUser?.wallet || {};

    if (!privateKeyRecoveryPayloads) {
      showNotification(
        'errors',
        {
          errors: `unable to retrieve recovery payloads: ${formatGqlErrors(
            result.errors
          )}`,
        },
        { level: Level.ERROR }
      );
      return;
    }

    promptRestoreWallet(privateKeyRecoveryPayloads, option);
  };

  const fetchRecoveryPayloads = async () => {
    const { data } = await apolloClient.query<PrivateKeyRecoveryPayloadsQuery>({
      query: PRIVATE_KEY_RECOVERY_PAYLOADS_QUERY,
    });

    const { privateKeyRecoveryPayloads } = data.currentUser?.wallet || {};

    if (!privateKeyRecoveryPayloads) {
      showNotification(
        'errors',
        { errors: 'No recovery payloads, you should first get a recovery key' },
        { level: Level.ERROR }
      );
      return;
    }

    promptRestoreWallet(privateKeyRecoveryPayloads);
  };

  const promptRecoveryWallet = () => {
    fetchRecoveryPayloads();
  };

  return { sendRecoveryKey, sending, promptRecoveryWallet };
};

export default useSendRecoverKey;

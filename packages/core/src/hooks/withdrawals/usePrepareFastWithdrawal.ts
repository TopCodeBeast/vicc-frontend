import { TypedDocumentNode, gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { toWei } from '@core/lib/wei';

import {
  PrepareFastWithdrawalMutation,
  PrepareFastWithdrawalMutationVariables,
} from './__generated__/usePrepareFastWithdrawal.graphql';

const PREPARE_FAST_WITHDRAWAL_MUTATION = gql`
  mutation PrepareFastWithdrawalMutation($input: prepareFastWithdrawalInput!) {
    prepareFastWithdrawal(input: $input) {
      fastWithdrawal {
        senderVaultId
        receiverVaultId
        receiverPublicKey
        amount
        token
        salt
        nonce
        expirationTimestamp
        condition
        feeInfoUser {
          feeLimit
          sourceVaultId
          tokenId
        }
      }
      errors {
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  PrepareFastWithdrawalMutation,
  PrepareFastWithdrawalMutationVariables
>;

export default () => {
  const [prepare] = useMutation(PREPARE_FAST_WITHDRAWAL_MUTATION);

  return useCallback(
    async (amount: string, to: string) => {
      const transferData = await prepare({
        variables: {
          input: {
            amount: toWei(amount),
            to,
          },
        },
      });
      if (!transferData.data?.prepareFastWithdrawal)
        throw new Error('Empty transfer data');

      return transferData.data.prepareFastWithdrawal;
    },
    [prepare]
  );
};

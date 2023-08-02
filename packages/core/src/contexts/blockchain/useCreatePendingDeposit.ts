import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback } from 'react';

import useMutation from '@core/hooks/graphql/useMutation';
import { monetaryAmountFragment } from '@core/lib/monetaryAmount';

import {
  CreatePendingDepositMutation,
  CreatePendingDepositMutationVariables,
} from './__generated__/useCreatePendingDeposit.graphql';

const CREATE_PENDING_DEPOSIT_MUTATION = gql`
  mutation CreatePendingDepositMutation($input: createEthDepositInput!) {
    createEthDeposit(input: $input) {
      currentUser {
        slug
        pendingDeposits {
          id
          date
          amounts {
            ...MonetaryAmountFragment_monetaryAmount
          }
          providerType
          transactionHash
        }
      }
    }
  }
  ${monetaryAmountFragment}
` as TypedDocumentNode<
  CreatePendingDepositMutation,
  CreatePendingDepositMutationVariables
>;

const useCreatePendingDeposit = () => {
  const [mutate] = useMutation(CREATE_PENDING_DEPOSIT_MUTATION, {
    showErrorsWithSnackNotification: false,
  });

  return useCallback(
    async (transactionHash: string, amount: string) => {
      const { data } = await mutate({
        variables: { input: { transactionHash, amount } },
      });
      return data?.createEthDeposit?.currentUser?.pendingDeposits;
    },
    [mutate]
  );
};

export default useCreatePendingDeposit;

import { gql } from '@apollo/client';
import { useCallback } from 'react';

import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

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
          date
          amount
          amountInFiat {
            eur
            gbp
            usd
          }
        }
      }
    }
  }
`;

const useCreatePendingDeposit = () => {
  const [mutate] = useMutation<
    CreatePendingDepositMutation,
    CreatePendingDepositMutationVariables
  >(CREATE_PENDING_DEPOSIT_MUTATION, {
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

import { gql } from '@apollo/client';
import { useCallback } from 'react';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  PrepareEthDepositMutation,
  PrepareEthDepositMutationVariables,
} from './__generated__/usePrepareEthDeposit.graphql';

const PREPARE_ETH_DEPOSIT_MUTATION = gql`
  mutation PrepareEthDepositMutation($input: prepareEthDepositInput!) {
    prepareEthDeposit(input: $input) {
      ethDeposit {
        starkKey
        vaultId
        assetType
        weiAmount
      }
      errors {
        code
        message
      }
    }
  }
`;

const usePrepareMutation = () => {
  const [mutate] = useMutation<
    PrepareEthDepositMutation,
    PrepareEthDepositMutationVariables
  >(PREPARE_ETH_DEPOSIT_MUTATION, { showErrorsWithSnackNotification: true });

  return useCallback(
    async (weiAmount: string) => {
      const { data } = await mutate({ variables: { input: { weiAmount } } });

      return data?.prepareEthDeposit?.ethDeposit;
    },
    [mutate]
  );
};

export default usePrepareMutation;

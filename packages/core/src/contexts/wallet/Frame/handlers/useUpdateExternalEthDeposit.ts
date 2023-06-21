import { gql } from '@apollo/client';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  UpdateExternalEthDeposit,
  UpdateExternalEthDepositVariables,
} from './__generated__/useUpdateExternalEthDeposit.graphql';

const UPDATE_EXTERNAL_DEPOSIT_MUTATION = gql`
  mutation UpdateExternalEthDeposit($input: updateExternalEthDepositInput!) {
    updateExternalEthDeposit(input: $input) {
      currentUser {
        slug
        pendingDeposits {
          id
          amount
          date
          providerType
          transactionHash
        }
      }
      errors {
        code
        message
      }
    }
  }
`;

export default () => {
  return useMutation<
    UpdateExternalEthDeposit,
    UpdateExternalEthDepositVariables
  >(UPDATE_EXTERNAL_DEPOSIT_MUTATION, {
    showErrorsWithSnackNotification: true,
  });
};

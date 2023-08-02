import { TypedDocumentNode, gql } from '@apollo/client';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  CreateCardDeposit,
  CreateCardDepositVariables,
} from './__generated__/useCreateCardDeposit.graphql';

const CREATE_CARD_DEPOSIT = gql`
  mutation CreateCardDeposit($input: createCardDepositInput!) {
    createCardDeposit(input: $input) {
      secureModeRedirectUrl
      errors {
        message
        code
        path
      }
    }
  }
` as TypedDocumentNode<CreateCardDeposit, CreateCardDepositVariables>;

export const useCreateCardDeposit = () => {
  return useMutation<CreateCardDeposit, CreateCardDepositVariables>(
    CREATE_CARD_DEPOSIT
  );
};

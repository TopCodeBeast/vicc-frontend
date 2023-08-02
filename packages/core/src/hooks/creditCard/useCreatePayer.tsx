import { TypedDocumentNode, gql } from '@apollo/client';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  CreateFiatPayer,
  CreateFiatPayerVariables,
} from './__generated__/useCreatePayer.graphql';

const CREATE_FIAT_PAYER_MUTATION = gql`
  mutation CreateFiatPayer($input: createFiatPayerInput!) {
    createFiatPayer(input: $input) {
      currentUser {
        slug
        accounts {
          id
          accountable {
            ... on FiatWalletAccount {
              id
              state
            }
          }
        }
      }
      errors {
        message
        code
        path
      }
    }
  }
` as TypedDocumentNode<CreateFiatPayer, CreateFiatPayerVariables>;

export const useCreatePayer = () => {
  return useMutation<CreateFiatPayer, CreateFiatPayerVariables>(
    CREATE_FIAT_PAYER_MUTATION
  );
};

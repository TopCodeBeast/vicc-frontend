import { TypedDocumentNode, gql } from '@apollo/client';

import { fiatAccounts } from '@core/contexts/currentUser/queries';
import useMutation from '@core/hooks/graphql/useMutation';

import {
  ValidateFiatWalletMutation,
  ValidateFiatWalletMutationVariables,
} from './__generated__/useValidateFiatWallet.graphql';

const VALIDATE_FIAT_WALLET_MUTATION = gql`
  mutation ValidateFiatWalletMutation($input: validateFiatWalletInput!) {
    validateFiatWallet(input: $input) {
      currentUser {
        slug
        ...CurrentUseProvider_fiatAccounts
      }
      errors {
        message
        code
      }
    }
  }
  ${fiatAccounts}
` as TypedDocumentNode<
  ValidateFiatWalletMutation,
  ValidateFiatWalletMutationVariables
>;

type ValidateFiatWalletArgs = {
  frontPage: File;
  backPage?: File;
};

export const useValidateFiatWallet = () => {
  const [mutate, { loading }] = useMutation(VALIDATE_FIAT_WALLET_MUTATION, {
    showErrorsInForm: true,
    showErrorsWithSnackNotification: false,
  });
  const validateFiatWallet = async ({
    frontPage,
    backPage,
  }: ValidateFiatWalletArgs) => {
    const { data } = await mutate({
      variables: {
        input: {
          frontPage,
          ...(backPage && { backPage }),
        },
      },
    });
    return data?.validateFiatWallet || {};
  };
  return {
    validateFiatWallet,
    loading,
  };
};

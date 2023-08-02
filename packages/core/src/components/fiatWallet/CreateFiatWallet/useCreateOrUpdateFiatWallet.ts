import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback } from 'react';

import { FiatCurrency } from '__generated__/globalTypes';
import { fiatAccounts } from '@core/contexts/currentUser/queries';
import useMutation from '@core/hooks/graphql/useMutation';

import {
  CreateFiatWalletMutation,
  CreateFiatWalletMutationVariables,
  UpdateFiatWalletMutation,
  UpdateFiatWalletMutationVariables,
} from './__generated__/useCreateOrUpdateFiatWallet.graphql';

const CREATE_FIAT_WALLET_MUTATION = gql`
  mutation CreateFiatWalletMutation($input: createFiatWalletInput!) {
    createFiatWallet(input: $input) {
      currentUser {
        slug
        profile {
          id
          enabledWallets
        }
        ...CurrentUseProvider_fiatAccounts
      }
      errors {
        code
        message
      }
    }
  }
  ${fiatAccounts}
` as TypedDocumentNode<
  CreateFiatWalletMutation,
  CreateFiatWalletMutationVariables
>;

const UPDATE_FIAT_WALLET_MUTATION = gql`
  mutation UpdateFiatWalletMutation($input: updateFiatWalletInput!) {
    updateFiatWallet(input: $input) {
      currentUser {
        slug
        profile {
          id
          enabledWallets
        }
        ...CurrentUseProvider_fiatAccounts
      }
      errors {
        code
        message
      }
    }
  }
  ${fiatAccounts}
` as TypedDocumentNode<
  UpdateFiatWalletMutation,
  UpdateFiatWalletMutationVariables
>;

type UpdateFiatWalletArgs = {
  dob: string;
  firstName: string;
  lastName: string;
};

type CreateFiatWalletArgs = {
  currency: FiatCurrency;
  countryOfResidenceCode: string;
  nationalityCode: string;
  mangopayTermsAndConditionsAccepted: boolean;
} & UpdateFiatWalletArgs;

export const useCreateOrUpdateFiatWallet = () => {
  const [createFiatWallet, { loading: createLoading }] = useMutation(
    CREATE_FIAT_WALLET_MUTATION,
    {
      showErrorsInForm: true,
      showErrorsWithSnackNotification: false,
    }
  );

  const [updateFiatWallet, { loading: updateLoading }] = useMutation(
    UPDATE_FIAT_WALLET_MUTATION,
    {
      showErrorsInForm: true,
      showErrorsWithSnackNotification: false,
    }
  );

  const loading = createLoading || updateLoading;

  const create = useCallback(
    async (args: CreateFiatWalletArgs) => {
      const { data } = await createFiatWallet({
        variables: {
          input: {
            ...args,
          },
        },
      });

      return data?.createFiatWallet || {};
    },
    [createFiatWallet]
  );

  const update = useCallback(
    async ({ dob, firstName, lastName }: UpdateFiatWalletArgs) => {
      const { data } = await updateFiatWallet({
        variables: {
          input: {
            dob,
            firstName,
            lastName,
          },
        },
      });

      return data?.updateFiatWallet || {};
    },
    [updateFiatWallet]
  );

  return {
    create,
    update,
    loading,
  };
};

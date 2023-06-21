import { gql } from '@apollo/client';
import { useCallback } from 'react';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  CreateFiatWalletMutation,
  CreateFiatWalletMutationVariables,
} from './__generated__/useCreateFiatWallet.graphql';

const CREATE_FIAT_WALLET_MUTATION = gql`
  mutation CreateFiatWalletMutation($input: createFiatWalletInput!) {
    createFiatWallet(input: $input) {
      currentUser {
        slug
        accounts {
          id
          accountable {
            ... on FiatWalletAccount {
              id
              currency
              availableBalance
            }
          }
        }
        profile {
          id
          enabledWallets
        }
      }
      errors {
        code
        message
      }
    }
  }
`;

type CreateFiatWalletArgs = {
  countryCode: string;
  dob?: ISO8601Date;
  firstName?: string;
  lastName?: string;
};

const useCreateFiatWallet = () => {
  const [createFiatWallet, { loading }] = useMutation<
    CreateFiatWalletMutation,
    CreateFiatWalletMutationVariables
  >(CREATE_FIAT_WALLET_MUTATION);

  const create = useCallback(
    async (args: CreateFiatWalletArgs) => {
      const { data } = await createFiatWallet({
        variables: {
          input: {
            ...args,
          },
        },
      });

      return data?.createFiatWallet;
    },
    [createFiatWallet]
  );

  return {
    create,
    loading,
  };
};

export default useCreateFiatWallet;

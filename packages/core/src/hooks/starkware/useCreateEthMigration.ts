import { gql } from '@apollo/client';
import Big from 'bignumber.js';

import { useCurrentUserContext } from 'contexts/currentUser';
import { useWalletContext } from 'contexts/wallet';
import { EthMigrationError } from 'errors';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';
import { generateDealId } from '@sorare/core/src/lib/deal';

import {
  CreateEthMigrationMutation,
  CreateEthMigrationMutationVariables,
} from './__generated__/useCreateEthMigration.graphql';

const CREATE_ETH_MIGRATION_MUTATION = gql`
  mutation CreateEthMigrationMutation($input: createEthMigrationInput!) {
    createEthMigration(input: $input) {
      currentUser {
        id
        slug
        ethMigration {
          id
        }
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

const useCreateEthMigration = () => {
  const { currentUser } = useCurrentUserContext();
  const { signEthMigration } = useWalletContext();
  const [mutate] = useMutation<
    CreateEthMigrationMutation,
    CreateEthMigrationMutationVariables
  >(CREATE_ETH_MIGRATION_MUTATION);

  return async () => {
    if (!currentUser) return;
    const { bankBalance, availableBalance, ethMigration } = currentUser;

    const amount =
      new Big(bankBalance).comparedTo(availableBalance) === 1
        ? availableBalance
        : bankBalance;

    if (ethMigration) return;
    if (new Big(amount).eq(0)) return;

    const nonce = generateDealId();
    const signature = await signEthMigration(nonce, amount);
    if (!signature) {
      throw new EthMigrationError('unable to fetch migration signature');
    }
    await mutate({
      variables: { input: { nonce, weiAmount: amount, signature } },
    });
  };
};

export default useCreateEthMigration;

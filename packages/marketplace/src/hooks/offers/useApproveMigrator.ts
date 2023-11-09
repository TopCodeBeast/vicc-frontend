import { TypedDocumentNode, gql, useApolloClient } from '@apollo/client';

import { useBlockchainContext } from '@sorare/core/src/contexts/blockchain';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useWalletContext } from '@sorare/core/src/contexts/wallet';
import { MigratorApprovalError } from '@sorare/core/src/errors';

import {
  ApproveMigratorMutation,
  ApproveMigratorMutationVariables,
  NextRelayBatchNonceQuery,
  NextRelayBatchNonceQueryVariables,
  useApproveMigrator_token,
} from './__generated__/useApproveMigrator.graphql';

type useApproveMigrator_token_owner_account_accountable = NonNullable<
  NonNullable<useApproveMigrator_token['owner']>['account']
>['accountable'];

type useApproveMigrator_token_owner_account_accountable_EthereumAccount =
  useApproveMigrator_token_owner_account_accountable & {
    __typename: 'EthereumAccount';
  };

const NEXT_RELAY_BATCH_NONCE_QUERY = gql`
  query NextRelayBatchNonceQuery($address: String!) {
    # nextRelayBatchNonce(address: $address)
  }
` as TypedDocumentNode<
  NextRelayBatchNonceQuery,
  NextRelayBatchNonceQueryVariables
>;

const APPROVE_MIGRATOR_MUTATION = gql`
  mutation ApproveMigratorMutation($input: approveMigratorInput!) {
    approveMigrator(input: $input) {
      errors {
        path
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  ApproveMigratorMutation,
  ApproveMigratorMutationVariables
>;

function isEthereumAccount(
  accountable: useApproveMigrator_token_owner_account_accountable
): accountable is useApproveMigrator_token_owner_account_accountable_EthereumAccount {
  return accountable.__typename === 'EthereumAccount';
}

const useApproveMigrator = () => {
  const { currentUser } = useCurrentUserContext();
  const { signMigratorApprovalForMappedAccount } = useBlockchainContext();
  const { approveMigrator: signApproveMigrator } = useWalletContext();
  const client = useApolloClient();

  const getNextNonce = async (address: string) => {
    const { data } = await client.query<
      NextRelayBatchNonceQuery,
      NextRelayBatchNonceQueryVariables
    >({
      query: NEXT_RELAY_BATCH_NONCE_QUERY,
      variables: { address },
    });

    return data.nextRelayBatchNonce;
  };

  const approve = async (address: string, nonce: number, signature: string) => {
    const { errors } = await client.mutate<
      ApproveMigratorMutation,
      ApproveMigratorMutationVariables
    >({
      mutation: APPROVE_MIGRATOR_MUTATION,
      variables: { input: { address, nonce, signature } },
    });

    if (errors && errors.length > 0)
      throw new MigratorApprovalError('unable to save approval');
  };

  return async (tokens: useApproveMigrator_token[]) => {
    if (!currentUser) return;

    const requiredApprovals = tokens
      .filter(
        ({ owner }) =>
          owner?.account &&
          isEthereumAccount(owner.account.accountable) &&
          !owner.account?.accountable?.migratorApproved
      )
      .reduce<Record<useApproveMigrator_token['walletStatus'], string>>(
        (prev, { walletStatus, owner }) => {
          prev[walletStatus] = owner!.address;
          return prev;
        },
        {} as any
      );

    const { INTERNAL, MAPPED } = requiredApprovals;

    if (INTERNAL) {
      const nonce = await getNextNonce(INTERNAL);
      const result = await signApproveMigrator(nonce);
      if (!result)
        throw new MigratorApprovalError('unable to obtain internal signature');

      await approve(INTERNAL, nonce, result.signature);
    }
    if (MAPPED) {
      const nonce = await getNextNonce(MAPPED);
      let signature: string;
      try {
        signature = await signMigratorApprovalForMappedAccount(nonce, MAPPED);
      } catch (error: any) {
        throw new MigratorApprovalError(error);
      }
      await approve(MAPPED, nonce, signature);
    }
  };
};

useApproveMigrator.fragments = {
  token: gql`
    fragment useApproveMigrator_token on Token {
      assetId
      slug
      walletStatus
      tradeableStatus
      owner {
        id
        blockchain
        address
        account {
          id
          accountable {
            ... on EthereumAccount {
              id
              # migratorApproved
            }
          }
        }
      }
    }
  ` as TypedDocumentNode<useApproveMigrator_token>,
};

export default useApproveMigrator;

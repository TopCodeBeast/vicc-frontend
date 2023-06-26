import { gql } from '@apollo/client';
import { useCallback, useState } from 'react';

import { AccountData } from '@core/contexts/blockchain';
import useMutation from '@core/hooks/graphql/useMutation';

import {
  GetTokenDepositInfoMutation,
  GetTokenDepositInfoMutationVariables,
} from './__generated__/useDepositNft.graphql';
import { DepositAction } from './types';

const userRejectedRequestErrorCode = 4001;

const GET_TOKEN_DEPOSIT_INFO_MUTATION = gql`
  mutation GetTokenDepositInfoMutation($input: prepareTokenDepositInput!) {
    prepareTokenDeposit(input: $input) {
      tokenDeposit {
        starkKey
        assetType
        vaultId
        tokenId
      }
      errors {
        message
        code
      }
    }
  }
`;

export const useDepositNft = () => {
  const [loading, setLoading] = useState(false);
  const [prepare] = useMutation<
    GetTokenDepositInfoMutation,
    GetTokenDepositInfoMutationVariables
  >(GET_TOKEN_DEPOSIT_INFO_MUTATION, { showErrorsWithSnackNotification: true });

  const deposit = useCallback(
    async (
      accountData: AccountData,
      contractAddress: string,
      assetId: string
    ) => {
      const { ethAccount, ethereum } = accountData;

      if (!ethAccount) throw Error('Unable to load Ethereum account');
      if (!ethereum?.starkExchangeManager)
        throw new Error('Unable to load stark exchange manager');
      if (!ethereum.tokensManager)
        throw new Error('Unable to load the tokens manager');

      const approvedForAll = await ethereum.tokensManager.isApprovedForAll(
        contractAddress,
        ethAccount,
        ethereum.starkExchangeManager.getLocalAddress()
      );

      if (approvedForAll) {
        const nftDeposit = await prepare({ variables: { input: { assetId } } });

        if (!nftDeposit.data?.prepareTokenDeposit?.tokenDeposit)
          throw Error('Unable to retrieve deposit payload');

        const { starkKey, tokenId, assetType, vaultId } =
          nftDeposit.data.prepareTokenDeposit.tokenDeposit;

        const txHash = await ethereum.starkExchangeManager.depositNftAsync(
          ethAccount,
          starkKey,
          assetType,
          vaultId,
          tokenId
        );

        return { txHash, type: 'deposit' as DepositAction };
      }

      const txHash = await ethereum.tokensManager.approveForAllAsync(
        contractAddress,
        ethereum.starkExchangeManager.getLocalAddress(),
        ethAccount
      );

      return { txHash, type: 'approval' as DepositAction };
    },
    [prepare]
  );

  return useCallback(
    async (
      accountData: AccountData,
      contractAddress: string,
      assetId: string
    ) => {
      try {
        if (loading) return null;
        setLoading(true);

        const result = await deposit(accountData, contractAddress, assetId);
        return result;
      } catch (err: any) {
        if (err.code === userRejectedRequestErrorCode) {
          setLoading(false);
          return { err: undefined };
        }
        return { err };
      }
    },
    [deposit, loading]
  );
};

export default useDepositNft;

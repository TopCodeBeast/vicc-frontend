import { gql, useMutation } from '@apollo/client';

import Withdrawal from '@core/components/wallet/BankEthAccounting/Withdrawal';
import { useWalletContext } from '@core/contexts/wallet';
import { toWei } from '@core/lib/wei';

import {
  CreateFastWithdrawalMutation,
  CreateFastWithdrawalMutationVariables,
  PrepareFastWithdrawalMutation,
  PrepareFastWithdrawalMutationVariables,
} from './__generated__/useFastWithdrawal.graphql';

const PREPARE_FAST_WITHDRAWAL_MUTATION = gql`
  mutation PrepareFastWithdrawalMutation($input: prepareFastWithdrawalInput!) {
    prepareFastWithdrawal(input: $input) {
      fastWithdrawal {
        senderVaultId
        receiverVaultId
        receiverPublicKey
        amount
        token
        salt
        nonce
        expirationTimestamp
        condition
      }
      errors {
        message
        code
      }
    }
  }
`;

const CREATE_FAST_WITHDRAWAL_MUTATION = gql`
  mutation CreateFastWithdrawalMutation($input: createFastWithdrawalInput!) {
    createFastWithdrawal(input: $input) {
      currentUser {
        slug
        availableBalance
        withdrawalsWithRates {
          id
          ...Withdrawal_withdrawalWithRates
        }
      }
      errors {
        message
        code
      }
    }
  }
  ${Withdrawal.fragments.withdrawal}
`;

export default () => {
  const [create] = useMutation<
    CreateFastWithdrawalMutation,
    CreateFastWithdrawalMutationVariables
  >(CREATE_FAST_WITHDRAWAL_MUTATION);
  const [prepare] = useMutation<
    PrepareFastWithdrawalMutation,
    PrepareFastWithdrawalMutationVariables
  >(PREPARE_FAST_WITHDRAWAL_MUTATION);
  const { signTransfer } = useWalletContext();

  return async (amount: string, to: string) => {
    const transferData = await prepare({
      variables: {
        input: {
          amount: toWei(amount),
          to,
        },
      },
    });

    if (!transferData.data?.prepareFastWithdrawal)
      throw new Error('Empty transfer data');

    if (transferData.data.prepareFastWithdrawal.errors.length > 0)
      return transferData?.data.prepareFastWithdrawal.errors;

    const transfer = transferData.data.prepareFastWithdrawal.fastWithdrawal!;

    const signature = await signTransfer(transfer);

    if (!signature) throw new Error('Empty signature');

    const input = {
      amount: toWei(amount),
      to,
      salt: transfer.salt,
      starkSignatures: [
        {
          nonce: transfer.nonce,
          expirationTimestamp: transfer.expirationTimestamp,
          data: signature,
        },
      ],
    };
    const { data } = await create({
      variables: {
        input,
      },
    });

    return data?.createFastWithdrawal?.errors;
  };
};

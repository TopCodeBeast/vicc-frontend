import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

import Withdrawal from '@core/components/wallet/BankEthAccounting/Withdrawal';
import { useWalletContext } from '@core/contexts/wallet';
import { toWei } from '@core/lib/wei';

import {
  CreateFastWithdrawalMutation,
  CreateFastWithdrawalMutationVariables,
} from './__generated__/useCreateFastWithdrawal.graphql';
import { PrepareFastWithdrawalMutation } from './__generated__/usePrepareFastWithdrawal.graphql';

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
` as TypedDocumentNode<
  CreateFastWithdrawalMutation,
  CreateFastWithdrawalMutationVariables
>;

export default () => {
  const [create] = useMutation(CREATE_FAST_WITHDRAWAL_MUTATION);
  const { signTransfer } = useWalletContext();

  return async (
    amount: string,
    to: string,
    transfer: NonNullable<
      PrepareFastWithdrawalMutation['prepareFastWithdrawal']
    >['fastWithdrawal']
  ) => {
    if (!transfer) throw new Error('Empty transfer');
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

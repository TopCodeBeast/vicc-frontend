import { gql, useMutation } from '@apollo/client';

import { SettleDealSignatureType } from '@sorare/wallet-shared';
import Withdrawal from '@core/components/wallet/BankEthAccounting/Withdrawal';
import { useConfigContext } from '@core/contexts/config';
import { useWalletContext } from '@core/contexts/wallet';
import useGenerateDeal from '@core/hooks/useGenerateDeal';

import {
  CreateWithdrawMutation,
  CreateWithdrawMutationVariables,
} from './__generated__/useWithdraw.graphql';

const CREATE_WITHDRAW_MUTATION = gql`
  mutation CreateWithdrawMutation($input: createWithdrawalInput!) {
    createWithdrawal(input: $input) {
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
    CreateWithdrawMutation,
    CreateWithdrawMutationVariables
  >(CREATE_WITHDRAW_MUTATION);
  const generateDeal = useGenerateDeal();
  const { signSettleDeal } = useWalletContext();
  const { sponsorAccountAddress } = useConfigContext();

  return async (amount: string, to: string) => {
    const deal = generateDeal({
      sendAmountInWei: amount,
      receiver: {
        __typename: 'User',
        slug: '',
        sorareAddress: sponsorAccountAddress,
      },
    });

    const signature = await signSettleDeal(
      deal,
      SettleDealSignatureType.SendETH
    );

    const input = {
      amount,
      dealId: deal.dealId,
      signature: signature!,
      to,
      agreedFeeAmount: '0',
    };

    const { data: createData } = await create({
      variables: {
        input,
      },
    });

    return createData?.createWithdrawal?.errors;
  };
};

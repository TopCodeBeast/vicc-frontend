import { gql, useMutation } from '@apollo/client';

import WithdrawalItem from '../WithdrawalItem';
import {
  CancelWithdrawalMutation,
  CancelWithdrawalMutationVariables,
  Withdrawal_withdrawalWithRates,
} from './__generated__/index.graphql';

const FRAGMENT = gql`
  fragment Withdrawal_withdrawalWithRates on WithdrawalWithRates {
    id
    amount
    agreedFeeAmount
    status
    transactionHash
    to
    createdAt
    amountInFiat {
      eur
      usd
      gbp
    }
  }
`;

const CANCEL_WITHDRAWAL_MUTATION = gql`
  mutation CancelWithdrawalMutation($input: cancelWithdrawalInput!) {
    cancelWithdrawal(input: $input) {
      currentUser {
        slug
        availableBalance
        availableBalanceForWithdrawal
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
  ${FRAGMENT}
`;

interface Props {
  withdrawal: Withdrawal_withdrawalWithRates;
}

export const Withdrawal = ({ withdrawal }: Props) => {
  const [cancel] = useMutation<
    CancelWithdrawalMutation,
    CancelWithdrawalMutationVariables
  >(CANCEL_WITHDRAWAL_MUTATION);

  const { id } = withdrawal;

  const onCancel = async () =>
    cancel({ variables: { input: { withdrawalId: id } } });

  return <WithdrawalItem withdrawal={withdrawal} cancel={onCancel} />;
};

Withdrawal.fragments = {
  withdrawal: FRAGMENT,
};

export default Withdrawal;

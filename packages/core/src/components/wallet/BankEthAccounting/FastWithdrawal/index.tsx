import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

import WithdrawalItem from '../WithdrawalItem';
import {
  CancelFastWithdrawalMutation,
  CancelFastWithdrawalMutationVariables,
  FastWithdrawal_fastWithdrawalWithRates,
} from './__generated__/index.graphql';

const FRAGMENT = gql`
  fragment FastWithdrawal_fastWithdrawalWithRates on FastWithdrawalWithRates {
    id
    amount
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
` as TypedDocumentNode<FastWithdrawal_fastWithdrawalWithRates>;

const CANCEL_FAST_WITHDRAWAL_MUTATION = gql`
  mutation CancelFastWithdrawalMutation($input: cancelFastWithdrawalInput!) {
    cancelFastWithdrawal(input: $input) {
      currentUser {
        slug
        availableBalance
        availableBalanceForWithdrawal
        fastWithdrawalsWithRates {
          id
          ...FastWithdrawal_fastWithdrawalWithRates
        }
      }
      errors {
        message
        code
      }
    }
  }
  ${FRAGMENT}
` as TypedDocumentNode<
  CancelFastWithdrawalMutation,
  CancelFastWithdrawalMutationVariables
>;

interface Props {
  withdrawal: FastWithdrawal_fastWithdrawalWithRates;
}

export const FastWithdrawal = ({ withdrawal }: Props) => {
  const [cancel] = useMutation(CANCEL_FAST_WITHDRAWAL_MUTATION);

  const { id } = withdrawal;

  const onCancel = async () =>
    cancel({ variables: { input: { fastWithdrawalId: id } } });

  return <WithdrawalItem withdrawal={withdrawal} cancel={onCancel} />;
};

FastWithdrawal.fragments = {
  withdrawal: FRAGMENT,
};

export default FastWithdrawal;

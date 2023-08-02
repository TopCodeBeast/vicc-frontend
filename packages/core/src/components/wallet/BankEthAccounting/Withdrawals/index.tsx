import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import useQuery from '@core/hooks/graphql/useQuery';

import FastWithdrawal from '../FastWithdrawal';
import Withdrawal from '../Withdrawal';
import {
  WithdrawalsQuery,
  WithdrawalsQueryVariables,
} from './__generated__/index.graphql';

export const WITHDRAWALS_QUERY = gql`
  query WithdrawalsQuery {
    currentUser {
      id
      slug
      withdrawalsWithRates {
        ...Withdrawal_withdrawalWithRates
      }
      fastWithdrawalsWithRates {
        ...FastWithdrawal_fastWithdrawalWithRates
      }
    }
  }
  ${Withdrawal.fragments.withdrawal}
  ${FastWithdrawal.fragments.withdrawal}
` as TypedDocumentNode<WithdrawalsQuery, WithdrawalsQueryVariables>;

const Root = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--c-neutral-300);
  & > div:not(:last-child) {
    margin-bottom: 30px;
  }
`;

const Withdrawals = () => {
  const { loading, data } = useQuery(WITHDRAWALS_QUERY);

  if (loading) return <LoadingIndicator />;
  if (!data?.currentUser) return <div>unable to retrieve withdrawals</div>;

  const { withdrawalsWithRates, fastWithdrawalsWithRates } = data.currentUser;

  const withdrawals = [
    ...withdrawalsWithRates,
    ...fastWithdrawalsWithRates,
  ].sort((w1, w2) => (w1.createdAt < w2.createdAt ? 1 : -1));

  if (withdrawals.length === 0) {
    return null;
  }

  return (
    <Root>
      {withdrawals.map(w =>
        w.__typename === 'WithdrawalWithRates' ? (
          <Withdrawal key={w.id} withdrawal={w} />
        ) : (
          <FastWithdrawal key={w.id} withdrawal={w} />
        )
      )}
    </Root>
  );
};

export default Withdrawals;

import { TypedDocumentNode, gql } from '@apollo/client';
import { Fragment, useCallback } from 'react';
import { defineMessages } from 'react-intl';

import {
  Currency,
  UserAccountEntryEntry,
} from '@sorare/core/src/__generated__/globalTypes';
import LoadMoreButton from '@sorare/core/src/atoms/buttons/LoadMoreButton';
import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { BankWithdrawal } from '@sorare/core/src/components/mySorare/TransactionsHistory/UserAccountEntries/BankWithdrawal';
import { Deposit } from '@sorare/core/src/components/mySorare/TransactionsHistory/UserAccountEntries/Deposit';
import { Withdrawal } from '@sorare/core/src/components/mySorare/TransactionsHistory/UserAccountEntries/Withdrawal';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import EmptyContent from '@sorare/core/src/contexts/intl/EmptyContent';
import { extractConnectionData } from '@sorare/core/src/gql/extractData';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { isType } from '@sorare/core/src/lib/gql';

import { Bid } from './Bid';
import { CardWithdrawal } from './CardWithdrawal';
import { Offer } from './Offer';
import { PrimaryOffer } from './PrimaryOffer';
import { Reward } from './Reward';
import {
  UserAccountEntriesQuery,
  UserAccountEntriesQueryVariables,
} from './__generated__/index.graphql';

type TransactionsHistoryQuery_currentUser_accountEntries_nodes = NonNullable<
  UserAccountEntriesQuery['currentUser']
>['accountEntries']['nodes'][number];

const USER_ACCOUNT_ENTRIES_QUERY = gql`
  query UserAccountEntriesQuery(
    $cursor: String
    $significant: Boolean
    $currency: Currency
  ) {
    currentUser {
      slug
      accountEntries(
        significant: $significant
        after: $cursor
        currencyType: $currency
      ) {
        nodes {
          id
          entryType
          date
          aasmState
          provisional
          amount
          ...Deposit_userAccountEntry
          ...BankWithdrawal_userAccountEntry
          ...Withdrawal_userAccountEntry
          ...CardWithdrawal_userAccountEntry
          ...Bid_userAccountEntry
          ...Offer_userAccountEntry
          ...PrimaryOffer_userAccountEntry
          ...Reward_userAccountEntry
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${Deposit.fragments.userAccountEntry}
  ${BankWithdrawal.fragments.userAccountEntry}
  ${Withdrawal.fragments.userAccountEntry}
  ${CardWithdrawal.fragments.userAccountEntry}
  ${Bid.fragments.userAccountEntry}
  ${Offer.fragments.userAccountEntry}
  ${PrimaryOffer.fragments.userAccountEntry}
  ${Reward.fragments.userAccountEntry}
` as TypedDocumentNode<
  UserAccountEntriesQuery,
  UserAccountEntriesQueryVariables
>;

const messages = defineMessages({
  viewAll: {
    id: 'TransactionsHistory.viewAll',
    defaultMessage: 'View all details',
  },
  empty: {
    id: 'TransactionsHistory.empty',
    defaultMessage: 'No ETH Transactions',
  },
});

type Props = {
  currency: Currency;
};

export const UserAccountEntries = ({ currency }: Props) => {
  const { formatMessage } = useIntlContext();
  const [detailed, toggleDetailed] = useToggle(false);
  const { data, loading, loadMore } = usePaginatedQuery(
    USER_ACCOUNT_ENTRIES_QUERY,
    {
      nextFetchPolicy: 'cache-first',
      connection: 'UserAccountEntryConnection',
      variables: {
        significant: !detailed,
        currency,
      },
    }
  );

  const {
    items: accountEntries = [],
    hasMore,
    cursor,
  } = extractConnectionData(data?.currentUser?.accountEntries, src => src);

  // This function is a hack, we need to find a better way to link the entryType = "PAYMENT" with the associated entryType = "PAYMENT_FEES"
  // If significant=true, the buyer receive 3 entryType = "PAYMENT" & 3 entryType = "PAYMENT_FEES". But ATM, there's no way way to get entryType = "PAYMENT_FEES" associated to one entryType = "PAYMENT"
  const getFees = useCallback(
    (
      accountEntry: TransactionsHistoryQuery_currentUser_accountEntries_nodes
    ) => {
      const { tokenOperation } = accountEntry;
      if (!isType(tokenOperation, 'TokenOffer')) {
        return undefined;
      }

      return accountEntries.find(entry => {
        if (!isType(entry.tokenOperation, 'TokenOffer')) {
          return false;
        }

        return (
          entry.tokenOperation.id === tokenOperation.id &&
          entry.entryType === UserAccountEntryEntry.PAYMENT_FEE &&
          entry.provisional === accountEntry.provisional &&
          +entry.amount > 0 === +accountEntry.amount > 0
        );
      });
    },
    [accountEntries]
  );

  if (!data && !loading) return <EmptyContent message={messages.empty} />;

  return (
    <>
      <div>
        <Checkbox
          label={formatMessage(messages.viewAll)}
          checked={detailed}
          onChange={() => toggleDetailed()}
          disableRipple
        />
      </div>
      <div>
        {!data && loading ? (
          <LoadingIndicator />
        ) : (
          accountEntries.map(accountEntry => {
            return (
              <Fragment key={accountEntry.id}>
                <BankWithdrawal
                  userAccountEntry={accountEntry}
                  primaryCurrency={currency}
                />
                <Deposit
                  userAccountEntry={accountEntry}
                  primaryCurrency={currency}
                />
                <Bid
                  userAccountEntry={accountEntry}
                  primaryCurrency={currency}
                />
                <Offer
                  userAccountEntry={accountEntry}
                  userAccountEntryFees={getFees(accountEntry)}
                  primaryCurrency={currency}
                />
                <Reward
                  userAccountEntry={accountEntry}
                  primaryCurrency={currency}
                />
                <Withdrawal
                  userAccountEntry={accountEntry}
                  primaryCurrency={currency}
                />
                <CardWithdrawal
                  userAccountEntry={accountEntry}
                  primaryCurrency={currency}
                />
                <PrimaryOffer
                  userAccountEntry={accountEntry}
                  primaryCurrency={currency}
                />
              </Fragment>
            );
          })
        )}
        <LoadMoreButton
          hasMore={hasMore}
          loadMore={() => {
            loadMore(false, {
              cursor,
            });
          }}
          loading={loading}
        />
      </div>
    </>
  );
};

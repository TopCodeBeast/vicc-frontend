import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessages, useIntl } from 'react-intl';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { AccountEntry } from '@sorare/core/src/components/mySorare/TransactionsHistory/UserAccountEntries/AccountEntry';
import { isType } from '@sorare/core/src/lib/gql';

import { TransactionsBid } from '../../common/TransactionsBid';
import { Bid_userAccountEntry } from './__generated__/index.graphql';

const messages = defineMessages({
  title: {
    id: 'TransactionsHistoryBid.title',
    defaultMessage: 'Bid',
  },
});

type Props = {
  userAccountEntry: Bid_userAccountEntry;
  primaryCurrency: Currency;
};

export const Bid = ({ userAccountEntry, primaryCurrency }: Props) => {
  const { tokenOperation } = userAccountEntry;
  const { formatMessage } = useIntl();

  if (!isType(tokenOperation, 'TokenBid')) {
    return null;
  }

  return (
    <AccountEntry
      userAccountEntry={userAccountEntry}
      title={formatMessage(messages.title)}
      primaryCurrency={primaryCurrency}
    >
      <TransactionsBid tokenBid={tokenOperation} />
    </AccountEntry>
  );
};

Bid.fragments = {
  userAccountEntry: gql`
    fragment Bid_userAccountEntry on UserAccountEntry {
      id
      tokenOperation {
        ... on TokenBid {
          id
          ...TransactionsBid_tokenBid
        }
      }
      ...AccountEntry_userAccountEntry
    }
    ${AccountEntry.fragments.userAccountEntry}
    ${TransactionsBid.fragments.tokenBid}
  ` as TypedDocumentNode<Bid_userAccountEntry>,
};

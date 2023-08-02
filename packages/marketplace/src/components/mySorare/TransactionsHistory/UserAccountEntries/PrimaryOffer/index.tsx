import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessages, useIntl } from 'react-intl';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { AccountEntry } from '@sorare/core/src/components/mySorare/TransactionsHistory/UserAccountEntries/AccountEntry';
import { isType } from '@sorare/core/src/lib/gql';

import { TransactionsPrimaryOffer } from '../../common/TransactionsPrimaryOffer';
import { PrimaryOffer_userAccountEntry } from './__generated__/index.graphql';

type Props = {
  userAccountEntry: PrimaryOffer_userAccountEntry;
  primaryCurrency: Currency;
};

const messages = defineMessages({
  title: {
    id: 'TransactionsHistoryPrimaryOffer.title',
    defaultMessage: 'Starter Pack',
  },
});

export const PrimaryOffer = ({ userAccountEntry, primaryCurrency }: Props) => {
  const { tokenOperation } = userAccountEntry;
  const { formatMessage } = useIntl();

  if (!isType(tokenOperation, 'TokenPrimaryOffer')) {
    return null;
  }

  return (
    <AccountEntry
      userAccountEntry={userAccountEntry}
      title={formatMessage(messages.title)}
      primaryCurrency={primaryCurrency}
    >
      <TransactionsPrimaryOffer tokenPrimaryOffer={tokenOperation} />
    </AccountEntry>
  );
};

PrimaryOffer.fragments = {
  userAccountEntry: gql`
    fragment PrimaryOffer_userAccountEntry on UserAccountEntry {
      id
      tokenOperation {
        ... on TokenPrimaryOffer {
          id
          ...TransactionsPrimaryOffer_tokenPrimaryOffer
        }
      }
      ...AccountEntry_userAccountEntry
    }
    ${AccountEntry.fragments.userAccountEntry}
    ${TransactionsPrimaryOffer.fragments.tokenPrimaryOffer}
  ` as TypedDocumentNode<PrimaryOffer_userAccountEntry>,
};

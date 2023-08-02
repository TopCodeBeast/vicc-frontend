import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { AccountEntry } from '@sorare/core/src/components/mySorare/TransactionsHistory/UserAccountEntries/AccountEntry';

import { CardWithdrawal_userAccountEntry } from './__generated__/index.graphql';

const messages = defineMessages({
  title: {
    id: 'TransactionsHistoryCardWithdrawal.title',
    defaultMessage: 'Card withdrawal fee',
  },
});

type CardWithdrawal_userAccountEntry_tokenOperation_StarkwareWithdrawal =
  CardWithdrawal_userAccountEntry['tokenOperation'] & {
    __typename: 'StarkwareWithdrawal';
  };

type CardWithdrawal_userAccountEntry_tokenOperation_StarkwareWithdrawal_card =
  NonNullable<
    CardWithdrawal_userAccountEntry_tokenOperation_StarkwareWithdrawal['card']
  >;

type Props = {
  userAccountEntry: CardWithdrawal_userAccountEntry;
  primaryCurrency: Currency;
};

interface CardWithdrawal {
  __typename: 'StarkwareWithdrawal';
  destination: string;
  card: CardWithdrawal_userAccountEntry_tokenOperation_StarkwareWithdrawal_card;
}

const isACardWithdrawal = (item: {
  __typename: string;
  card?: CardWithdrawal_userAccountEntry_tokenOperation_StarkwareWithdrawal_card | null;
}): item is CardWithdrawal => {
  return item?.__typename === 'StarkwareWithdrawal' && !!item.card;
};

export const CardWithdrawal = ({
  userAccountEntry,
  primaryCurrency,
}: Props) => {
  const { tokenOperation } = userAccountEntry;
  const { formatMessage } = useIntl();

  if (!tokenOperation || !isACardWithdrawal(tokenOperation)) return null;

  const { destination, card } = tokenOperation;

  return (
    <AccountEntry
      userAccountEntry={userAccountEntry}
      title={formatMessage(messages.title)}
      primaryCurrency={primaryCurrency}
    >
      <Text16>
        <FormattedMessage
          id="TransactionsHistoryCardWithdrawal.detail"
          defaultMessage="{card} withdrawn to {destination}"
          values={{ card: card.name, destination }}
        />
      </Text16>
    </AccountEntry>
  );
};

CardWithdrawal.fragments = {
  userAccountEntry: gql`
    fragment CardWithdrawal_userAccountEntry on UserAccountEntry {
      id
      tokenOperation {
        ... on StarkwareWithdrawal {
          id
          destination
          card {
            slug
            assetId
            name
          }
        }
      }
      ...AccountEntry_userAccountEntry
    }
    ${AccountEntry.fragments.userAccountEntry}
  ` as TypedDocumentNode<CardWithdrawal_userAccountEntry>,
};

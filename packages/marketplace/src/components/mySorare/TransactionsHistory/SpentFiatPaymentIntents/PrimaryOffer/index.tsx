import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessages, useIntl } from 'react-intl';

import { isType } from '@sorare/core/src/lib/gql';

import { TransactionsPrimaryOffer } from '../../common/TransactionsPrimaryOffer';
import { AccountEntry } from '../AccountEntry';
import { PrimaryOffer_payment } from './__generated__/index.graphql';

type Props = {
  payment: PrimaryOffer_payment;
};

const messages = defineMessages({
  title: {
    id: 'FiatTransactionsHistoryPrimaryOffer.title',
    defaultMessage: 'Starter Pack',
  },
});

export const PrimaryOffer = ({ payment }: Props) => {
  const { tokenOperation } = payment;
  const { formatMessage } = useIntl();

  if (!isType(tokenOperation, 'TokenPrimaryOffer')) {
    return null;
  }

  return (
    <AccountEntry payment={payment} title={formatMessage(messages.title)}>
      <TransactionsPrimaryOffer tokenPrimaryOffer={tokenOperation} />
    </AccountEntry>
  );
};

PrimaryOffer.fragments = {
  payment: gql`
    fragment PrimaryOffer_payment on Payment {
      id
      ...AccountEntry_payment
      tokenOperation {
        ... on TokenPrimaryOffer {
          id
          ...TransactionsPrimaryOffer_tokenPrimaryOffer
        }
      }
    }
    ${AccountEntry.fragments.payment}
    ${TransactionsPrimaryOffer.fragments.tokenPrimaryOffer}
  ` as TypedDocumentNode<PrimaryOffer_payment>,
};

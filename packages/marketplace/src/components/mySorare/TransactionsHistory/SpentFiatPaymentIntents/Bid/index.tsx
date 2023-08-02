import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessages, useIntl } from 'react-intl';

import { isType } from '@sorare/core/src/lib/gql';

import { TransactionsBid } from '../../common/TransactionsBid';
import { AccountEntry } from '../AccountEntry';
import { Bid_payment } from './__generated__/index.graphql';

const messages = defineMessages({
  title: {
    id: 'FiatTransactionsHistoryBid.title',
    defaultMessage: 'Bid',
  },
});

type Props = {
  payment: Bid_payment;
};

export const Bid = ({ payment }: Props) => {
  const { tokenOperation } = payment;
  const { formatMessage } = useIntl();

  if (!isType(tokenOperation, 'TokenBid')) {
    return null;
  }

  return (
    <AccountEntry payment={payment} title={formatMessage(messages.title)}>
      <TransactionsBid tokenBid={tokenOperation} />
    </AccountEntry>
  );
};

Bid.fragments = {
  payment: gql`
    fragment Bid_payment on Payment {
      id
      ...AccountEntry_payment
      tokenOperation {
        ... on TokenBid {
          id
          ...TransactionsBid_tokenBid
        }
      }
    }
    ${AccountEntry.fragments.payment}
    ${TransactionsBid.fragments.tokenBid}
  ` as TypedDocumentNode<Bid_payment>,
};

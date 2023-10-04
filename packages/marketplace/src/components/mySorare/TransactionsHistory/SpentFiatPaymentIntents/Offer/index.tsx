import { TypedDocumentNode, gql } from '@apollo/client';
import { useIntl } from 'react-intl';

import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { isType } from '@sorare/core/src/lib/gql';

import { TransactionsOffer } from '../../common/TransactionsOffer';
import { AccountEntry, messages } from '../AccountEntry';
import { Offer_payment } from './__generated__/index.graphql';

type Props = {
  payment: Offer_payment;
};

export const Offer = ({ payment }: Props) => {
  const { tokenOperation } = payment;
  const { currentUser } = useCurrentUserContext();
  const { formatMessage } = useIntl();

  if (!currentUser || !tokenOperation) return null;

  if (!isType(tokenOperation, 'Offer') || !tokenOperation.sender) {
    return null;
  }

  if (
    (tokenOperation.receiver && !isType(tokenOperation.receiver, 'User')) ||
    !isType(tokenOperation.sender, 'User')
  ) {
    return null;
  }

  const data =
    tokenOperation.sender.slug === currentUser.slug
      ? {
          title: messages.offerTitleAsSender,
          otherParty: tokenOperation.receiver,
        }
      : {
          title: messages.offerTitleAsReceiver,
          otherParty: tokenOperation.sender,
        };

  return (
    <AccountEntry
      payment={payment}
      title={formatMessage(data.title, {
        otherParty: data.otherParty && <Nickname user={data.otherParty as any} />,
      })}
    >
      <TransactionsOffer tokenOffer={tokenOperation} />
    </AccountEntry>
  );
};

Offer.fragments = {
  payment: gql`
    fragment Offer_payment on Payment {
      id
      tokenOperation {
        ... on Offer {
          id
          ...TransactionsOffer_tokenOffer
        }
      }
      ...AccountEntry_payment
    }
    ${AccountEntry.fragments.payment}
    ${TransactionsOffer.fragments.tokenOffer}
  ` as TypedDocumentNode<Offer_payment>,
};

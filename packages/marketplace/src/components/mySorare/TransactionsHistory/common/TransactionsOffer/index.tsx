import { TypedDocumentNode, gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import { isType } from '@sorare/core/src/lib/gql';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import { TokenName } from '@marketplace/components/token/TokenName';

import { SectionTitle } from '../ui';
import { TransactionsOffer_tokenOffer } from './__generated__/index.graphql';

const messages = defineMessages({
  send: {
    id: 'TransactionsHistoryOffer.send',
    defaultMessage: 'You {past, select, true {sent} other {send}}',
  },
  receive: {
    id: 'TransactionsHistoryOffer.receive',
    defaultMessage: 'You {past, select, true {received} other {receive}}',
  },
  fees: {
    id: 'TransactionsHistoryOffer.fees',
    defaultMessage: '{price} fee is applied',
  },
});

type Props = {
  tokenOffer: TransactionsOffer_tokenOffer;
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

export const TransactionsOffer = ({ tokenOffer }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { toMonetaryAmount } = useMonetaryAmount();
  if (!currentUser || !tokenOffer) return null;

  if (!tokenOffer.sender) {
    return null;
  }

  if (
    (tokenOffer.receiver && !isType(tokenOffer.receiver, 'User')) ||
    !isType(tokenOffer.sender, 'User')
  ) {
    return null;
  }

  const currentUserIsSender = tokenOffer.sender.slug === currentUser.slug;

  const data = currentUserIsSender
    ? {
        otherParty: tokenOffer.receiver,
        sendAmounts: toMonetaryAmount(tokenOffer.senderSide.amounts),
        sendCards: tokenOffer.senderSide.nfts,
        receiveCards: tokenOffer.receiverSide.nfts,
      }
    : {
        otherParty: tokenOffer.receiver,
        sendAmounts: toMonetaryAmount(tokenOffer.receiverSide.amounts),
        sendCards: tokenOffer.receiverSide.nfts,
        receiveCards: tokenOffer.senderSide.nfts,
      };
  const offerEnded = isPast(parseISO(tokenOffer.endDate));

  return (
    <Root>
      {data.sendCards.length > 0 && (
        <div>
          <SectionTitle>
            <FormattedMessage
              {...messages.send}
              values={{ past: offerEnded }}
            />
          </SectionTitle>
          {data.sendAmounts.eur > 0 && (
            <AmountWithConversion
              monetaryAmount={data.sendAmounts}
              primaryCurrency={Currency.ETH}
            />
          )}

          {data.sendCards.map(sendCard => (
            <TokenName key={sendCard.assetId} token={sendCard} withLink />
          ))}
        </div>
      )}
      {data.receiveCards.length > 0 && (
        <div>
          <SectionTitle>
            <FormattedMessage
              {...messages.receive}
              values={{ past: offerEnded }}
            />
          </SectionTitle>
          {data.receiveCards.map(receiveCard => (
            <TokenName key={receiveCard.assetId} token={receiveCard} withLink />
          ))}
        </div>
      )}
    </Root>
  );
};

TransactionsOffer.fragments = {
  tokenOffer: gql`
    fragment TransactionsOffer_tokenOffer on Offer {
      id
      endDate
      sender {
        ... on User {
          slug
          suspended
          nickname
        }
      }
      actualReceiver {
        ... on User {
          slug
          suspended
          nickname
        }
      }
      receiver {
        ... on User {
          slug
          suspended
          nickname
        }
      }
      senderSide {
        id
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        nfts {
          assetId
          slug
          ...TokenName_token
        }
      }
      receiverSide {
        id
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        nfts {
          assetId
          slug
          ...TokenName_token
        }
      }
    }
    ${monetaryAmountFragment}
    ${TokenName.fragments.token}
  ` as TypedDocumentNode<TransactionsOffer_tokenOffer>,
};

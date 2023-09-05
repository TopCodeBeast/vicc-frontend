import { TypedDocumentNode, gql } from '@apollo/client';
import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { isType } from '@sorare/core/src/gql';
import useMonetaryAmount, {
  zeroMonetaryAmount,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import { tradeLabels } from '@sorare/core/src/lib/glossary';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import MonetaryCard from '@marketplace/components/offer/MonetaryCard';
import useMarketFeesHelperStatus from '@marketplace/hooks/useMarketFeesHelperStatus';

import CardOffer from '../../CardOffer';
import CardsChanged from '../CardsChanged';
import { useGetCardsDetails } from '../useGetCardsDetails';
import {
  MyViccDirectOfferBody_publicUserInfoInterface,
  MyViccDirectOfferBody_tokenOffer,
} from './__generated__/index.graphql';

const messages = defineMessages({
  nothing: {
    id: 'DirectOffer.nothing',
    defaultMessage: 'NOTHING',
  },
  to: {
    id: 'DirectOffer.to',
    defaultMessage: 'To',
  },
  from: {
    id: 'DirectOffer.from',
    defaultMessage: 'From',
  },
  sendingEth: {
    id: 'DirectOffer.sendingMoney',
    defaultMessage:
      '⚠️ You are about to send money to a manager named "{nickname}".',
  },
  cardAdded: {
    id: 'DirectOffer.cardAdded',
    defaultMessage: 'This card has been added to the trade',
  },
});

type Props = {
  offer: MyViccDirectOfferBody_tokenOffer;
  counterpartUser: MyViccDirectOfferBody_publicUserInfoInterface;
  isCurrentUserSender: boolean;
  validationMessages?: Record<string, ReactNode>;
};

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  @media ${tabletAndAbove} {
    flex-direction: row;
  }
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const BodyTitle = styled(Text16)`
  display: flex;
  flex-direction: row;
  gap: var(--unit);
  color: var(--c-neutral-600);
`;

const BodyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const Frame = styled.div`
  padding: var(--unit);
  border-radius: var(--double-unit);
  background: var(--c-neutral-300);
  .inModale & {
    background: var(--c-neutral-400);
  }
`;

const Warning = styled.div`
  padding: var(--unit) var(--double-unit);
  border-radius: var(--unit);
  border-left: var(--half-unit) solid;
  &.red {
    background-color: rgba(var(--c-rgb-red-600), 0.25);
    color: var(--c-red-600);
    border-color: var(--c-red-600);
  }
  &.grey {
    background-color: var(--c-neutral-300);
    color: var(--c-neutral-600);
    border-color: var(--c-neutral-400);
  }
`;

const ValidationMessageWrapper = styled.div`
  margin-top: var(--unit);
  color: initial;
`;

const CardChanged = styled(Text14)`
  display: flex;
  align-items: center;
  gap: var(--unit);
  margin-top: var(--double-unit);
  border: 1px solid var(--c-yellow-800);
  background-color: rgba(var(--c-rgb-yellow-300), 0.05);
  border-radius: var(--unit);
  padding: var(--half-unit) var(--unit);
`;

const DirectOfferBody = ({
  offer,
  counterpartUser,
  isCurrentUserSender,
  validationMessages,
}: Props) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  const { currentUser } = useCurrentUserContext();
  const getCardsDetails = useGetCardsDetails();
  const { receivedCards, sendCards } = getCardsDetails(
    offer,
    isCurrentUserSender
  );

  const {
    sender,
    senderSide,
    marketFeeAmounts,
    receiver,
    receiverSide,
    counteredOffer,
  } = offer;

  if (!isType(sender, 'User') || !receiver || !isType(receiver, 'User')) {
    return null;
  }

  const marketFeeMonetaryAmount = marketFeeAmounts
    ? toMonetaryAmount(marketFeeAmounts)
    : zeroMonetaryAmount;

  const senderMonetaryAmount = toMonetaryAmount(senderSide.amounts);
  const displaySenderMonetaryAmount = senderMonetaryAmount.eur !== 0;
  const renderSendAmount = (displayFees: boolean) =>
    displaySenderMonetaryAmount && (
      <Frame>
        <MonetaryCard
          amount={senderSide.amounts}
          marketFeeAmount={marketFeeMonetaryAmount}
          displayFees={displayFees}
        />
      </Frame>
    );

  const receiverMonetaryAmount = toMonetaryAmount(receiverSide.amounts);
  const displayReceiverAmount = receiverMonetaryAmount.eur !== 0;
  const renderReceiveAmount = (displayFees: boolean) =>
    displayReceiverAmount && (
      <Frame>
        <MonetaryCard
          amount={receiverSide.amounts}
          marketFeeAmount={marketFeeMonetaryAmount}
          displayFees={displayFees}
        />
      </Frame>
    );

  const sendAmountToDisplay = isCurrentUserSender
    ? renderSendAmount(false)
    : renderReceiveAmount(false);

  const hasSendToDisplay = sendAmountToDisplay || sendCards.length;

  const receiveAmountToDisplay = isCurrentUserSender
    ? renderReceiveAmount(true)
    : renderSendAmount(true);

  const hasReceivedToDisplay = receiveAmountToDisplay || receivedCards.length;

  const otherUser = counterpartUser.slug === sender.slug ? receiver : sender;

  const counteredOfferCards = counteredOffer
    ? getCardsDetails(counteredOffer, !isCurrentUserSender)
    : undefined;

  return (
    <>
      {counteredOffer && (
        <CardsChanged
          offer={offer}
          counterpartUser={counterpartUser}
          isCurrentUserSender={isCurrentUserSender}
        />
      )}
      <Body>
        <Column>
          <BodyTitle>
            {otherUser.slug === currentUser?.slug ? (
              <FormattedMessage {...tradeLabels.youSend} />
            ) : (
              <FormattedMessage
                {...tradeLabels.usernameSends}
                values={{
                  b: Bold,
                  username: <Nickname user={otherUser} />,
                }}
              />
            )}
          </BodyTitle>
          <BodyContent>
            {hasSendToDisplay ? (
              <>
                {sendAmountToDisplay}
                {[...sendCards]
                  .sort(a => {
                    if (!counteredOfferCards) return 0;
                    if (
                      !counteredOfferCards.receivedCards.find(
                        card => card.assetId === a.assetId
                      )
                    )
                      return -1;
                    return 1;
                  })
                  .map(token => (
                    <CardOffer item={token} key={token.assetId}>
                      {validationMessages?.[token.slug] && (
                        <ValidationMessageWrapper>
                          {validationMessages[token.slug]}
                        </ValidationMessageWrapper>
                      )}
                      {counteredOfferCards &&
                        !counteredOfferCards.sendCards.find(
                          card => card.assetId === token.assetId
                        ) && (
                          <CardChanged>
                            <FontAwesomeIcon
                              color="var(--c-yellow-600)"
                              icon={faInfoCircle}
                            />
                            <FormattedMessage {...messages.cardAdded} />
                          </CardChanged>
                        )}
                    </CardOffer>
                  ))}
              </>
            ) : (
              <Warning className="grey">
                <FormattedMessage {...messages.nothing} />
              </Warning>
            )}
            {sendAmountToDisplay &&
              offer.status === 'opened' &&
              !isCurrentUserSender && (
                <Warning className="red">
                  <FormattedMessage
                    {...messages.sendingEth}
                    values={{
                      nickname: (
                        <em>
                          <Nickname user={counterpartUser} />
                        </em>
                      ),
                    }}
                  />
                </Warning>
              )}
          </BodyContent>
        </Column>
        <Column>
          <BodyTitle>
            <FormattedMessage
              {...tradeLabels.usernameSends}
              values={{
                b: Bold,
                username: <Nickname user={counterpartUser} />,
              }}
            />
          </BodyTitle>
          <BodyContent>
            {hasReceivedToDisplay ? (
              <>
                {receiveAmountToDisplay}
                {[...receivedCards]
                  .sort(a => {
                    if (!counteredOfferCards) return 0;
                    if (
                      !counteredOfferCards.receivedCards.find(
                        card => card.assetId === a.assetId
                      )
                    )
                      return -1;
                    return 1;
                  })
                  .map(token => (
                    <CardOffer key={token.assetId} item={token}>
                      {counteredOfferCards &&
                        !counteredOfferCards.receivedCards.find(
                          card => card.assetId === token.assetId
                        ) && (
                          <CardChanged>
                            <FontAwesomeIcon
                              color="var(--c-yellow-600)"
                              icon={faInfoCircle}
                            />
                            <FormattedMessage {...messages.cardAdded} />
                          </CardChanged>
                        )}
                    </CardOffer>
                  ))}
              </>
            ) : (
              <Warning className="red">
                <Text16>
                  <FormattedMessage {...messages.nothing} />
                </Text16>
              </Warning>
            )}
          </BodyContent>
        </Column>
      </Body>
    </>
  );
};

DirectOfferBody.fragments = {
  tokenOffer: gql`
    fragment MyViccDirectOfferBody_tokenOffer on TokenOffer {
      id
      status
      marketFeeAmounts {
        ...MonetaryAmountFragment_monetaryAmount
      }
      sender {
        ...Nickname_publicUserInfoInterface
      }
      senderSide {
        id
        wei
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        nfts {
          assetId
          slug
          collection
          ...CardOffer_token
        }
      }
      receiver {
        ...Nickname_publicUserInfoInterface
      }
      receiverSide {
        id
        wei
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        nfts {
          assetId
          slug
          collection
          ...CardOffer_token
          ...useMarketFeesHelperStatus_token
        }
      }
      ...CardsChanged_tokenOffer
    }
    ${monetaryAmountFragment}
    ${CardOffer.fragments.token}
    ${useMarketFeesHelperStatus.fragments.token}
    ${Nickname.fragments.user}
    ${CardsChanged.fragments.tokenOffer}
  ` as TypedDocumentNode<MyViccDirectOfferBody_tokenOffer>,
  user: gql`
    fragment MyViccDirectOfferBody_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      ...Nickname_publicUserInfoInterface
      ...CardsChanged_user
    }
    ${Nickname.fragments.user}
    ${CardsChanged.fragments.user}
  ` as TypedDocumentNode<MyViccDirectOfferBody_publicUserInfoInterface>,
};

export default DirectOfferBody;

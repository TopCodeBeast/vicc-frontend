import { gql } from '@apollo/client';
import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { isType } from '@sorare/core/src/gql';
import { tradeLabels } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

import EthereumCard from '@sorare/marketplace/src/components/offer/EthereumCard';
import useMarketFeesHelperStatus from '@sorare/marketplace/src/hooks/useMarketFeesHelperStatus';

import CardOffer from '../../CardOffer';
import CardsChanged from '../CardsChanged';
import { useGetCardsDetails } from '../useGetCardsDetails';
import {
  MySorareDirectOfferBody_publicUserInfoInterface,
  MySorareDirectOfferBody_tokenOffer,
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
    id: 'DirectOffer.sendingEth',
    defaultMessage:
      '⚠️ You are about to send ETH to a manager named "{nickname}".',
  },
  cardAdded: {
    id: 'DirectOffer.cardAdded',
    defaultMessage: 'This card has been added to the trade',
  },
});

type Props = {
  offer: MySorareDirectOfferBody_tokenOffer;
  counteredOffer?: MySorareDirectOfferBody_tokenOffer | null;
  counterpartUser: MySorareDirectOfferBody_publicUserInfoInterface;
  isCurrentUserSender: boolean;
  validationMessages?: Record<string, ReactNode>;
};

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
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
  display: block;
  color: var(--c-neutral-600);
`;

const BodyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const Frame = styled.div`
  padding: var(--unit);
  border-radius: ${theme.radius.md}px;
  background: var(--c-neutral-300);
  .inModale & {
    background: var(--c-neutral-400);
  }
`;

const Warning = styled.div`
  padding: var(--unit) var(--double-unit);
  border-radius: ${theme.radius.xs}px;
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
  counteredOffer,
  counterpartUser,
  isCurrentUserSender,
  validationMessages,
}: Props) => {
  const getCardsDetails = useGetCardsDetails();
  const { receivedCards, sendCards } = getCardsDetails(
    offer,
    isCurrentUserSender
  );

  const { sender, senderSide, receiver, receiverSide } = offer;

  if (!isType(sender, 'User') || !receiver || !isType(receiver, 'User')) {
    return null;
  }

  const displaySenderWeiAmount = senderSide.wei && senderSide.wei !== '0';
  const renderSendWei = (displayFees: boolean) =>
    displaySenderWeiAmount && (
      <Frame>
        <EthereumCard
          amount={senderSide.wei}
          marketFeeAmountWei={offer.marketFeeAmountWei || '0'}
          displayFees={displayFees}
        />
      </Frame>
    );

  const displayReceiverWeiAmount = receiverSide.wei && receiverSide.wei !== '0';
  const renderReceiveWei = (displayFees: boolean) =>
    displayReceiverWeiAmount && (
      <Frame>
        <EthereumCard
          amount={receiverSide.wei}
          marketFeeAmountWei={offer.marketFeeAmountWei || '0'}
          displayFees={displayFees}
        />
      </Frame>
    );

  const sendWeiToDisplay = isCurrentUserSender
    ? renderSendWei(false)
    : renderReceiveWei(false);

  const hasSendToDisplay = sendWeiToDisplay || sendCards.length;

  const receiveWeiToDisplay = isCurrentUserSender
    ? renderReceiveWei(true)
    : renderSendWei(true);

  const hasReceivedToDisplay = receiveWeiToDisplay || receivedCards.length;

  const otherUser = counterpartUser.slug === sender.slug ? receiver : sender;

  const counteredOfferCards = counteredOffer
    ? getCardsDetails(counteredOffer, !isCurrentUserSender)
    : undefined;

  return (
    <>
      {counteredOffer && (
        <CardsChanged
          offer={offer}
          counteredOffer={counteredOffer}
          counterpartUser={counterpartUser}
          isCurrentUserSender={isCurrentUserSender}
        />
      )}
      <Body>
        <Column>
          <BodyTitle>
            {isCurrentUserSender ? (
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
                {sendWeiToDisplay}
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
            {sendWeiToDisplay &&
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
                {receiveWeiToDisplay}
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
    fragment MySorareDirectOfferBody_tokenOffer on TokenOffer {
      id
      status
      marketFeeAmountWei
      sender {
        ...Nickname_publicUserInfoInterface
      }
      senderSide {
        id
        wei
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
    ${CardOffer.fragments.token}
    ${useMarketFeesHelperStatus.fragments.token}
    ${Nickname.fragments.user}
    ${CardsChanged.fragments.tokenOffer}
  `,
  user: gql`
    fragment MySorareDirectOfferBody_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      ...Nickname_publicUserInfoInterface
      ...CardsChanged_user
    }
    ${Nickname.fragments.user}
    ${CardsChanged.fragments.user}
  `,
};

export default DirectOfferBody;

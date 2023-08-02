import { TypedDocumentNode, gql } from '@apollo/client';
import classNames from 'classnames';
import { useState } from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import styled from 'styled-components';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import { Text14, Title5 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { glossary } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import CardOffer from '../../CardOffer';
import { useGetCardsDetails } from '../useGetCardsDetails';
import {
  CardsChangedOffer_tokenOffer,
  CardsChanged_tokenOffer,
  CardsChanged_user,
} from './__generated__/index.graphql';

const messages = defineMessages({
  title: {
    id: 'CardsChanged.title',
    defaultMessage: 'Cards changes from previous trade',
  },
  subtitle: {
    id: 'CardsChanged.subtitle',
    defaultMessage:
      '{user} added {value} {value, plural, one {card} other {cards}} and removed {remove} {remove, plural, one {card} other {cards}} from last trade.',
  },
  dialogSubtitle: {
    id: 'CardsChanged.dialogSubtitle',
    defaultMessage: '{user} made changes to the cards involved in the trade',
  },
  added: {
    id: 'CardsChanged.added',
    defaultMessage: 'Added',
  },
  removed: {
    id: 'CardsChanged.removed',
    defaultMessage: 'Removed',
  },
  noChanges: {
    id: 'CardsChanged.noChanges',
    defaultMessage: 'No changes',
  },
});

const compareCardsArray = <T extends { assetId: string }>(
  newCards: T[],
  oldCards: T[]
) => {
  const results = newCards.filter(
    ({ assetId }) =>
      !oldCards.some(({ assetId: assetId2 }) => assetId2 === assetId)
  );
  return results;
};

const BodyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const SeeDetails = styled(ButtonBase)`
  text-decoration: underline;
`;

const Body = styled.div`
  padding: var(--triple-unit);
`;

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  margin-top: var(--double-unit);

  @media ${tabletAndAbove} {
    flex-direction: row;
    width: max-content;
    min-width: 100%;

    > div {
      flex-grow: 1;
      width: 50%;
    }
  }
`;

const CenteredTitle5 = styled(Title5)`
  text-align: center;
`;

const Subtitle = styled(Text14)`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
  align-items: flex-start;
  @media ${tabletAndAbove} {
    flex-direction: row;
    align-items: center;
  }
`;

const DialogSubtitle = styled(Text14)`
  > * {
    display: inline-block;
  }
`;

const Tabs = styled.div`
  margin-top: var(--double-unit);
  background-color: var(--c-neutral-300);
  border-radius: var(--double-unit);
  > button {
    width: 50%;
    padding: var(--half-unit) var(--unit);
    border-radius: var(--double-unit);
    &.active {
      background-color: var(--c-neutral-500);
    }
  }
`;

const CardsColumn = ({
  cards,
  title,
}: {
  cards: CardsChanged_tokenOffer['receiverSide']['nfts'];
  title: MessageDescriptor;
}) => {
  return (
    <BodyContent>
      <Title5 color="var(--c-neutral-600)">
        <FormattedMessage {...title} />
      </Title5>
      {cards.length > 0 ? (
        cards.map(cardAdded => (
          <CardOffer key={cardAdded.assetId} item={cardAdded} />
        ))
      ) : (
        <FormattedMessage {...messages.noChanges} />
      )}
    </BodyContent>
  );
};

const CardsChanged = ({
  offer,
  counterpartUser,
  isCurrentUserSender,
}: {
  offer: CardsChanged_tokenOffer;
  counterpartUser: CardsChanged_user;
  isCurrentUserSender: boolean;
}) => {
  const getCardsDetails = useGetCardsDetails();
  const [selectedTab, setSelectedTab] = useState(0);
  const { receivedCards, sendCards } = getCardsDetails(
    offer,
    isCurrentUserSender
  );

  const {
    receivedCards: counteredOfferReceivedCards,
    sendCards: counteredOfferSendCards,
  } = getCardsDetails(offer.counteredOffer, !isCurrentUserSender);

  const hasCounterOffer = !!offer.counteredOffer;

  const [dialogOpen, setDialogOpen] = useState(false);
  const receivedCardsAdded = compareCardsArray<
    CardsChanged_tokenOffer['senderSide']['nfts'][number]
  >(receivedCards, counteredOfferReceivedCards);
  const receivedCardsRemoved = compareCardsArray<
    CardsChanged_tokenOffer['senderSide']['nfts'][number]
  >(counteredOfferReceivedCards, receivedCards);
  const sendCardsAdded = compareCardsArray<
    CardsChanged_tokenOffer['senderSide']['nfts'][number]
  >(sendCards, counteredOfferSendCards);
  const sendCardsRemoved = compareCardsArray<
    CardsChanged_tokenOffer['senderSide']['nfts'][number]
  >(counteredOfferSendCards, sendCards);

  if (
    receivedCardsAdded.length +
      receivedCardsRemoved.length +
      sendCardsAdded.length +
      sendCardsRemoved.length ===
    0
  )
    return null;

  const senderUserText = isCurrentUserSender ? (
    <FormattedMessage id="CardsChanged.you" defaultMessage="You" />
  ) : (
    <Nickname user={counterpartUser} />
  );

  const removedCardsToDisplay =
    selectedTab === 0 ? sendCardsRemoved : receivedCardsRemoved;

  const addedCardsToDisplay =
    selectedTab === 0 ? sendCardsAdded : receivedCardsAdded;

  if (!hasCounterOffer) return null;

  return (
    <div>
      <Subtitle>
        <FormattedMessage
          {...messages.subtitle}
          values={{
            value: receivedCardsAdded.length + sendCardsAdded.length,
            remove: receivedCardsRemoved.length + sendCardsRemoved.length,
            user: senderUserText,
          }}
        />
        <SeeDetails onClick={() => setDialogOpen(true)}>
          <FormattedMessage {...glossary.seeDetails} />
        </SeeDetails>
      </Subtitle>

      <Dialog
        open={dialogOpen}
        maxWidth="sm"
        fullWidth
        onClose={() => setDialogOpen(false)}
        title={
          <CenteredTitle5>
            <FormattedMessage {...messages.title} />
          </CenteredTitle5>
        }
        body={
          <Body>
            <DialogSubtitle>
              <FormattedMessage
                {...messages.dialogSubtitle}
                values={{ user: senderUserText }}
              />
            </DialogSubtitle>
            <Tabs>
              <ButtonBase
                className={classNames({ active: selectedTab === 0 })}
                onClick={() => {
                  setSelectedTab(0);
                }}
              >
                <FormattedMessage
                  id="CardsChanged.yourCards"
                  defaultMessage="Your cards"
                />
              </ButtonBase>
              <ButtonBase
                className={classNames({ active: selectedTab === 1 })}
                onClick={() => {
                  setSelectedTab(1);
                }}
              >
                <FormattedMessage
                  id="CardsChanged.otherPathCards"
                  defaultMessage="{user} cards"
                  values={{
                    user: <Nickname user={counterpartUser} />,
                  }}
                />
              </ButtonBase>
            </Tabs>
            <DialogContent>
              <CardsColumn
                title={messages.removed}
                cards={removedCardsToDisplay}
              />
              <CardsColumn title={messages.added} cards={addedCardsToDisplay} />
            </DialogContent>
          </Body>
        }
      />
    </div>
  );
};

const offerFragment = gql`
  fragment CardsChangedOffer_tokenOffer on TokenOffer {
    senderSide {
      id
      nfts {
        assetId
        slug
        ...CardOffer_token
      }
    }
    receiverSide {
      id
      nfts {
        assetId
        slug
        ...CardOffer_token
      }
    }
  }
` as TypedDocumentNode<CardsChangedOffer_tokenOffer>;

CardsChanged.fragments = {
  tokenOffer: gql`
    fragment CardsChanged_tokenOffer on TokenOffer {
      id
      ...CardsChangedOffer_tokenOffer
      counteredOffer {
        id
        ...CardsChangedOffer_tokenOffer
      }
    }
    ${offerFragment}
  ` as TypedDocumentNode<CardsChanged_tokenOffer>,
  user: gql`
    fragment CardsChanged_user on PublicUserInfoInterface {
      slug
      ...Nickname_publicUserInfoInterface
    }
    ${Nickname.fragments.user}
  ` as TypedDocumentNode<CardsChanged_user>,
};

export default CardsChanged;

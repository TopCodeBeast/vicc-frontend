import { TypedDocumentNode, gql } from '@apollo/client';
import { faXmark } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { CardHit } from '@sorare/core/src/lib/algolia';

import PriceHistoryTooltip from '@marketplace/components/price/PriceHistoryTooltip';
import { TokenTransferValidator } from '@marketplace/components/token/TokenTransferValidator';

import CardRow from '../CardRow';
import { OfferSide_token } from './__generated__/index.graphql';
import messages from './i18n';

type CardDataProvider = {
  cards: CardHit[];
  cardsData: Record<string, OfferSide_token>;
};

type Props = CardDataProvider & {
  title: ReactNode;
  toggleAddCardOpened: () => void;
  setCards: (cards: CardHit[]) => Promise<any>;
  children?: ReactNode;
  displayMinPrices?: boolean;
  isOwnSide?: boolean;
  addCardDisabledWarning?: ReactNode;
};

type SelectedCardProps = {
  card: CardHit;
  cardData: OfferSide_token;
  displayMinPrices: boolean;
  removeCard: (card: CardHit) => void;
  children?: ReactNode;
};

const Section = styled.div`
  padding: var(--double-unit);
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--double--unit);
  gap: var(--unit);
`;

const CardWrapper = styled.div`
  background: var(--c-neutral-300);
  border-radius: var(--double-unit);
`;

const InlineCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;

const WarningWrapper = styled.div`
  padding: 0 var(--unit) var(--unit);
`;

const SelectedCard = ({
  card,
  cardData,
  displayMinPrices,
  removeCard,
  children,
}: SelectedCardProps) => {
  const onRemove = useCallback(() => removeCard(card), [removeCard, card]);

  return (
    <CardWrapper>
      <CardRow
        card={card}
        cardData={cardData}
        displayMinPrice={displayMinPrices}
      >
        <PriceHistoryTooltip token={cardData} />
        <IconButton onClick={onRemove} color="transparent" small>
          <FontAwesomeIcon icon={faXmark} size="xs" />
        </IconButton>
      </CardRow>
      {children}
    </CardWrapper>
  );
};

export const OfferSide = ({
  cards,
  cardsData,
  toggleAddCardOpened,
  setCards,
  title,
  children,
  displayMinPrices = false,
  isOwnSide,
  addCardDisabledWarning,
}: Props) => {
  const removeCard = useCallback(
    (card: CardHit) => {
      setCards(cards.filter(c => c.objectID !== card.objectID));
    },
    [setCards, cards]
  );

  return (
    <Section>
      <SectionHeader>
        {title}
        <Tooltip
          title={
            addCardDisabledWarning ? (
              <FormattedMessage
                id="NewOfferBuilder.OfferSide.userDoesNotAcceptCardTrades"
                defaultMessage="This user does not accept card trades."
              />
            ) : (
              ''
            )
          }
        >
          <Button
            color="white"
            onClick={toggleAddCardOpened}
            small
            disabled={!!addCardDisabledWarning}
          >
            <FormattedMessage {...messages.addCard} />
          </Button>
        </Tooltip>
      </SectionHeader>
      {addCardDisabledWarning}
      {cards.length > 0 && (
        <TokenTransferValidator
          tokens={Object.values(cardsData).filter(cardData =>
            cards.some(card => card.objectID === cardData.slug)
          )}
          transferContext="send_trade"
          shouldValidate={!!isOwnSide}
        >
          {({ validationMessages }) => (
            <InlineCards>
              {cards.map(card => (
                <SelectedCard
                  key={card.objectID}
                  card={card}
                  cardData={cardsData[card.objectID]}
                  displayMinPrices={displayMinPrices}
                  removeCard={removeCard}
                >
                  {validationMessages[card.objectID] && (
                    <WarningWrapper>
                      {validationMessages[card.objectID]}
                    </WarningWrapper>
                  )}
                </SelectedCard>
              ))}
            </InlineCards>
          )}
        </TokenTransferValidator>
      )}
      {children}
    </Section>
  );
};

OfferSide.fragments = {
  token: gql`
    fragment OfferSide_token on Token {
      assetId
      slug
      ...PriceHistoryTooltip_token
      ...DirectOffer_CardRow_token
      ...TokenTransferValidator_token
    }
    ${CardRow.fragments.token}
    ${PriceHistoryTooltip.fragments.token}
    ${TokenTransferValidator.fragments.token}
  ` as TypedDocumentNode<OfferSide_token>,
};

export default OfferSide;

import { gql } from '@apollo/client';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { Container } from '@sorare/core/src/atoms/container';
import { Text14, Title2 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import useCustomDeck from '@sorare/core/src/hooks/decks/useCustomDeck';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import { range } from '@sorare/core/src/lib/arrays';
import { glossary } from '@sorare/core/src/lib/glossary';
import { allPositions } from '@sorare/core/src/lib/players';
import { theme } from '@sorare/core/src/style/theme';

import PositionTabs from '@football/components/searchCards/PositionTabs';
import useAddCardsToDeck from '@football/hooks/decks/useAddCardsToDeck';
import useRemoveCardFromDeck from '@football/hooks/decks/useRemoveCardFromDeck';

import {
  GetCardsForDeckQuery,
  GetCardsForDeckQueryVariables,
} from './__generated__/index.graphql';

const GET_CARDS_FOR_DECK_QUERY = gql`
  query GetCardsForDeckQuery($positions: [Position!], $cursor: String) {
    currentUser {
      slug
      paginatedCards(positions: $positions, after: $cursor) {
        nodes {
          slug
          assetId
          pictureUrl
          customDecks {
            slug
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const Cards = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: var(--double-unit);
  }
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const CardWrapper = styled.button<{
  selected?: boolean;
}>`
  padding: var(--unit);
  background-color: ${({ selected }) =>
    selected ? `rgba(var(--c-rgb-brand-600),0.5)` : `none`};
  border: ${({ selected }) =>
    selected ? `2px solid var(--c-brand-600);` : `none`};
  border-radius: ${theme.shape.borderRadius}px;
  &.placeholder {
    opacity: 0.1;
  }
`;

const Header = styled.div`
  padding: var(--unit) 0;
  text-align: right;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  min-height: 100%;
`;

const Filters = styled.div`
  padding: var(--triple-unit) 0;
`;

const Footer = styled.footer`
  position: sticky;
  bottom: 0;
  background: var(--c-neutral-200);
  border-radius: var(--unit) var(--unit) 0 0;
  border-top: 2px solid var(--c-neutral-300);
  padding: var(--unit);
  margin-top: var(--double-unit);
`;
const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const EditDeckCards = () => {
  const { name: deckName } = useParams();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const { deck: deckData } = useCustomDeck({ name: deckName, cardsToFetch: 0 });
  const [selectedPosition, setSelectedPosition] = useState<
    Position | undefined
  >(undefined);

  const {
    data: cardData,
    loading,
    loadMore,
  } = usePaginatedQuery<GetCardsForDeckQuery, GetCardsForDeckQueryVariables>(
    GET_CARDS_FOR_DECK_QUERY,
    {
      variables: { positions: selectedPosition ? [selectedPosition] : null },
      connection: 'CardConnection',
    }
  );

  const hasNextPage = Boolean(
    cardData?.currentUser?.paginatedCards?.pageInfo?.hasNextPage
  );

  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, {
        cursor: cardData?.currentUser?.paginatedCards?.pageInfo.endCursor,
        positions: selectedPosition ? [selectedPosition] : null,
      });
    }, [cardData, loadMore, selectedPosition]),
    hasNextPage,
    loading
  );

  const addCardToDeck = useAddCardsToDeck();
  const removeCardFromDeck = useRemoveCardFromDeck();

  if (!deckData) return null;

  const { name, slug } = deckData;
  const cards = cardData?.currentUser?.paginatedCards.nodes;

  return (
    <Root>
      <Container>
        <Header>
          <IconButton
            color="white"
            onClick={() => navigate(-1)}
            icon={faTimes}
            aria-label={formatMessage(glossary.close)}
          />
        </Header>
        <Title2>
          <FormattedMessage
            id="EditDeckCards.addToList"
            defaultMessage="Add to {name}"
            values={{ name }}
          />
        </Title2>
        <Text14 color="var(--c-neutral-600)">
          <FormattedMessage
            id="EditDeckCards.pickCards"
            defaultMessage="Pick cards to add to {name}"
            values={{ name }}
          />
        </Text14>
        <Filters>
          <PositionTabs
            positions={[...new Set(allPositions)]}
            currentPosition={selectedPosition}
            onClick={position => setSelectedPosition(position)}
          />
        </Filters>
        <Cards>
          {cards?.map(card => {
            const isSelected = !!card.customDecks.find(d => d.slug === slug);
            return (
              <CardWrapper
                key={card.slug}
                selected={isSelected}
                onClick={() => {
                  if (isSelected) {
                    removeCardFromDeck(slug)(card.slug);
                  } else {
                    addCardToDeck(slug)([card.slug]);
                  }
                }}
              >
                <CardImg src={card.pictureUrl || ''} width={160} alt="" />
              </CardWrapper>
            );
          })}
          {loading &&
            range(50).map(i => (
              <CardWrapper key={i} className="placeholder">
                <CardImg src="" width={160} alt="" />
              </CardWrapper>
            ))}
        </Cards>
        <InfiniteScrollLoader />
      </Container>
      <Footer>
        <Container>
          <FooterContent>
            <Text14>
              <FormattedMessage
                defaultMessage="<b>{nb}</b> {nb, plural, one {card} other {cards}} listed"
                id="EditDeckCards.playerListed"
                values={{ nb: deckData.cardsCount, b: Bold }}
              />
            </Text14>
            <Button color="blue" medium onClick={() => navigate(-1)}>
              <FormattedMessage {...glossary.confirm} />
            </Button>
          </FooterContent>
        </Container>
      </Footer>
    </Root>
  );
};

export default EditDeckCards;

import { TypedDocumentNode, gql } from '@apollo/client';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Container } from '@sorare/core/src/atoms/container';
import { Text14, Title2 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import { FOOTBALL_MANAGER_HOME_CARDS } from '@sorare/core/src/constants/routes';
import useCustomDeck from '@sorare/core/src/hooks/decks/useCustomDeck';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';
import { range } from '@sorare/core/src/lib/arrays';
import { glossary } from '@sorare/core/src/lib/glossary';
import { allPositions } from '@sorare/core/src/lib/players';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

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
` as TypedDocumentNode<GetCardsForDeckQuery, GetCardsForDeckQueryVariables>;

const Cards = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--unit);
  @media ${tabletAndAbove} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: var(--double-unit);
  }
  @media ${laptopAndAbove} {
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
  border-radius: var(--unit);
  &.placeholder {
    opacity: 0.1;
  }
`;

const Header = styled.div`
  margin-top: var(--unit);
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const CloseButton = styled(IconButton)`
  margin-left: auto;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  min-height: 100%;
  flex: 1;
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
  const bgLocation = useBgLocation();
  const goBack = useSafePreviousNavigate(FOOTBALL_MANAGER_HOME_CARDS);
  const { formatMessage } = useIntl();
  const addCardToDeck = useAddCardsToDeck();
  const removeCardFromDeck = useRemoveCardFromDeck();
  const [confirming, setConfirming] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const { deck: deckData } = useCustomDeck({ name: deckName, cardsToFetch: 0 });
  const [selectedPosition, setSelectedPosition] = useState<
    Position | undefined
  >(undefined);

  const {
    data: cardData,
    loading,
    loadMore,
  } = usePaginatedQuery(GET_CARDS_FOR_DECK_QUERY, {
    variables: { positions: selectedPosition ? [selectedPosition] : null },
    connection: 'CardConnection',
  });

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

  if (!deckData) return null;

  const { name, slug } = deckData;
  const cards = cardData?.currentUser?.paginatedCards.nodes;
  const alreadSelectedCards = cards
    ?.filter(({ customDecks }) => customDecks.find(d => d.slug === slug))
    .map(card => card.slug);
  if (!loading && alreadSelectedCards?.length && !selectedCards?.length) {
    setSelectedCards(alreadSelectedCards);
  }

  const confirm = async () => {
    setConfirming(true);
    const toAdd = selectedCards.filter(c => !alreadSelectedCards?.includes(c));
    const toRemove = alreadSelectedCards?.filter(
      c => !selectedCards.includes(c)
    );
    if (toAdd.length) {
      await addCardToDeck(slug)(toAdd);
    }
    if (toRemove?.length) {
      await Promise.all(
        toRemove.map(async cardToRemove =>
          removeCardFromDeck(slug)(cardToRemove)
        )
      );
    }
    goBack();
    setConfirming(false);
  };

  return (
    <Root>
      <Container>
        <Header>
          {bgLocation && (
            <CloseButton
              color="white"
              onClick={goBack}
              icon={faTimes}
              aria-label={formatMessage(glossary.close)}
            />
          )}
          <div>
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
          </div>
        </Header>

        <Filters>
          <PositionTabs
            positions={[...new Set(allPositions)]}
            currentPosition={selectedPosition}
            onClick={position =>
              setSelectedPosition(selected =>
                selected === position ? undefined : position
              )
            }
          />
        </Filters>
        <Cards>
          {cards?.map(card => {
            const isSelected = selectedCards.includes(card.slug);
            return (
              <CardWrapper
                key={card.slug}
                selected={isSelected}
                onClick={() => {
                  if (isSelected) {
                    setSelectedCards(c =>
                      c?.filter(cardSlug => card.slug !== cardSlug)
                    );
                  } else {
                    setSelectedCards(c => [...c, card.slug]);
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
                values={{ nb: selectedCards.length, b: Bold }}
              />
            </Text14>
            <div>
              <Button color="transparent" medium onClick={goBack}>
                <FormattedMessage {...glossary.cancel} />
              </Button>
              <LoadingButton
                color="blue"
                medium
                onClick={() => {
                  confirm();
                }}
                loading={confirming}
              >
                <FormattedMessage {...glossary.confirm} />
              </LoadingButton>
            </div>
          </FooterContent>
        </Container>
      </Footer>
    </Root>
  );
};

export default EditDeckCards;

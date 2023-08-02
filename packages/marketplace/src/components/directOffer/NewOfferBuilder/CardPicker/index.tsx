import { faXmark } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInfiniteHits } from 'react-instantsearch-hooks-web';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import Blockquote from '@sorare/core/src/atoms/layout/Blockquote';
import { Text16 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { InstantBlockchainCardSearch } from '@sorare/core/src/components/search/InstantSearch';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import {
  CardHit as CardHitType,
  getUserCardFilters,
  mergeResults,
} from '@sorare/core/src/lib/algolia';
import { glossary } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import SearchBox from '@marketplace/search/SearchBox';

import CardRow from '../CardRow';

type Props = {
  owner: { id: string };
  onClose: () => void;
  title: MessageDescriptor;
  selectedCards: CardHitType[];
  confirmSelectedCards: (cards: CardHitType[]) => void;
  counterOfferSport?: Sport;
};

interface EligibleCardProps {
  card: CardHitType;
  selectedCards: string[];
  selectCard: (card: CardHitType) => void;
  deselectCard: (card: CardHitType) => void;
}

const Root = styled(ButtonBase)`
  width: 100%;
  border-radius: var(--double-unit);
  cursor: pointer;
  background: var(--c-neutral-300);
  &.selected {
    background: linear-gradient(
        0deg,
        rgba(var(--c-rgb-brand-600), 0.2),
        rgba(var(--c-rgb-brand-600), 0.2)
      ),
      var(--c-neutral-300);
    outline: 2px solid var(--c-brand-600);
  }
`;

const EligibleCard = ({
  card,
  selectedCards,
  selectCard,
  deselectCard,
}: EligibleCardProps) => {
  const selected = useMemo(
    () => selectedCards.includes(card.objectID),
    [selectedCards, card]
  );

  return (
    <Root
      className={classnames({ selected })}
      disableDebounce
      onClick={() => {
        if (selected) {
          deselectCard(card);
          return;
        }
        selectCard(card);
      }}
    >
      <CardRow card={card}>
        {selected && (
          <IconButton component="span" color="transparent" small>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        )}
      </CardRow>
    </Root>
  );
};

const messages = defineMessages({
  noCards: {
    id: 'OfferBuilder.CardPicker.noCardsFound',
    defaultMessage: 'No Cards found',
  },
});

type PrivateProps = {
  selectedCards: CardHitType[];
  setSelectedCards: React.Dispatch<React.SetStateAction<CardHitType[]>>;
};

const Nothing = () => (
  <Blockquote variant="grey">
    <FormattedMessage {...messages.noCards} />
  </Blockquote>
);

const Filters = styled.div`
  margin: 20px 0px;
`;
const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardPicker = ({ selectedCards, setSelectedCards }: PrivateProps) => {
  const [searching, setSearching] = useState<boolean>(false);

  const {
    hits,
    results: algoliaResults,
    isLastPage,
    showMore,
  } = useInfiniteHits<CardHitType>();

  const hasMore = !isLastPage;

  const refineNext = useCallback(() => {
    setSearching(true);
    showMore();
  }, [setSearching, showMore]);

  const { InfiniteScrollLoader } = useInfiniteScroll(
    refineNext,
    hasMore,
    searching
  );

  const selectedCardIds = useMemo(
    () => selectedCards.map(card => card.objectID),
    [selectedCards]
  );

  const selectCard = useCallback(
    (card: CardHitType) => setSelectedCards(cards => [...cards, card]),
    [setSelectedCards]
  );

  const deselectCard = useCallback(
    (card: CardHitType) => {
      const { objectID } = card;
      setSelectedCards(cards => cards.filter(c => c.objectID !== objectID));
    },
    [setSelectedCards]
  );

  const results = mergeResults(hits, selectedCards);

  useEffect(() => {
    setSearching(false);
  }, [algoliaResults?.page]);
  return (
    <>
      <Filters>
        <SearchBox />
      </Filters>
      <div>
        {results.length === 0 && !searching && <Nothing />}
        {results.length > 0 && (
          <Results>
            {results.map(card => (
              <EligibleCard
                key={card.objectID}
                card={card}
                {...{
                  selectCard,
                  selectedCards: selectedCardIds,
                  deselectCard,
                }}
              />
            ))}
          </Results>
        )}
        <InfiniteScrollLoader />
      </div>
    </>
  );
};

const CenteredText16 = styled(Text16)`
  text-align: center;
`;
const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 var(--triple-unit);
  @media ${tabletAndAbove} {
    max-height: 70vh;
  }
`;
const CtaWrapper = styled.div`
  position: sticky;
  bottom: 0;
  box-shadow: 0px 14px 50px rgba(0, 0, 0, 0.2);
  padding: var(--triple-unit);
`;

export const CardPickerDialog = ({
  onClose,
  owner,
  title,
  selectedCards: defaultSelectedCards,
  confirmSelectedCards,
  counterOfferSport,
}: Props) => {
  const [selectedCards, setSelectedCards] =
    useState<CardHitType[]>(defaultSelectedCards);
  const onConfirmCb = useCallback(
    () => confirmSelectedCards(selectedCards),
    [confirmSelectedCards, selectedCards]
  );
  const { sport } = useSportContext();

  const filters = useMemo(
    () => [getUserCardFilters(idFromObject(owner.id))],
    [owner.id]
  );

  return (
    <Dialog
      open
      maxWidth="sm"
      fullWidth
      scroll="paper"
      onBack={onClose}
      onClose={onClose}
      title={
        <CenteredText16>
          <FormattedMessage {...title} />
        </CenteredText16>
      }
      body={
        <DialogContent>
          <InstantBlockchainCardSearch
            analyticsTags={['NewOffer']}
            defaultFilters={filters}
            sport={counterOfferSport || sport!}
            attributesToRetrieve={['*']}
          >
            <CardPicker
              selectedCards={selectedCards}
              setSelectedCards={setSelectedCards}
            />
          </InstantBlockchainCardSearch>
        </DialogContent>
      }
      footer={
        <CtaWrapper>
          <Button color="blue" medium onClick={onConfirmCb} fullWidth>
            <FormattedMessage {...glossary.done} />
          </Button>
        </CtaWrapper>
      }
    />
  );
};

export default CardPickerDialog;

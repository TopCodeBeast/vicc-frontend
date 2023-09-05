import { Grid } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import { useInfiniteHits } from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import Container from '@sorare/core/src/atoms/layout/Container';
import FixedAppBar from '@sorare/core/src/atoms/layout/FixedAppBar';
import { Text16 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { InstantSearch } from '@sorare/core/src/components/search/InstantSearch';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import {
  CardHit as CardHitType,
  convertCardHitToToken,
  mergeResults,
  sportFilter,
  visibleCardFilter,
} from '@sorare/core/src/lib/algolia';
import { glossary } from '@sorare/core/src/lib/glossary';

import SearchBox from '@sorare/marketplace/src/search/SearchBox';

import CardHit from './CardHit';

interface InnerProps {
  onConfirm?: (cards: CardHitType[]) => void;
  onPick?: (card: CardHitType) => void;
  selectedCards?: CardHitType[];
}

interface Props extends InnerProps {
  open: boolean;
  onClose: () => void;
  excluding?: string[];
  filters?: string[];
  owner: { id: string };
}

const Filters = styled.div`
  margin-bottom: 30px;
`;
const Results = styled(Grid)``;
const Card = styled(Grid)`
  text-align: center;
`;
const SelectedCount = styled(Text16)`
  margin-right: 10px;
`;
const ConfirmButton = styled(Button)``;

export const CardPicker = ({
  onConfirm,
  onPick,
  selectedCards: defaultSelectedCards = [],
}: InnerProps) => {
  const {
    showMore,
    results: searchResults,
    hits,
    isLastPage,
  } = useInfiniteHits<CardHitType>();

  const hasMore = !isLastPage;
  const [searching, setSearching] = useState<boolean>(false);
  useEffect(() => {
    setSearching(false);
  }, [searchResults?.page]);

  const [selectedCards, setSelectedCards] =
    useState<CardHitType[]>(defaultSelectedCards);
  const { InfiniteScrollLoader } = useInfiniteScroll(
    showMore,
    hasMore,
    searching
  );

  const toggleCard = useCallback(
    (card: CardHitType) => {
      if (onPick) {
        onPick(card);
      } else if (selectedCards.map(o => o.objectID).includes(card.objectID)) {
        setSelectedCards(curSelectedCards =>
          curSelectedCards.filter(c => c.objectID !== card.objectID)
        );
      } else {
        setSelectedCards(curSelectedCards => [...curSelectedCards, card]);
      }
    },
    [selectedCards, onPick]
  );

  const onConfirmCards = () => {
    if (onConfirm) onConfirm(selectedCards);
  };

  const results = mergeResults(hits, selectedCards);

  return (
    <>
      <Container>
        <Filters>
          <SearchBox />
        </Filters>
        <Results container spacing={2}>
          {results.map(h => (
            <Card key={h.objectID} item xs={6} md={4} lg={2}>
              <CardHit
                hit={convertCardHitToToken(h)}
                onToggle={() => toggleCard(h)}
                selected={selectedCards
                  .map(o => o.objectID)
                  .includes(h.objectID)}
              />
            </Card>
          ))}
        </Results>
      </Container>
      <InfiniteScrollLoader />
      {!onPick && (
        <FixedAppBar position="bottom" justify="right">
          <SelectedCount color="var(--c-neutral-600)">
            <FormattedMessage
              id="CardPicker.selected"
              defaultMessage="{selected} selected"
              values={{ selected: selectedCards.length }}
            />
          </SelectedCount>
          <ConfirmButton
            color="blue"
            medium
            onClick={onConfirmCards}
            disabled={selectedCards.length === 0}
          >
            <FormattedMessage {...glossary.confirm} />
          </ConfirmButton>
        </FixedAppBar>
      )}
    </>
  );
};

export const CardPickerDialog = ({
  open,
  onClose,
  excluding = [],
  filters,
  owner,
  ...props
}: Props) => {
  const userIdFilter = `user.id:${idFromObject(owner.id)}`;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      body={
        <InstantSearch
          indexes={['Cards New']}
          distinct={false}
          defaultHitsPerPage={30}
          analyticsTags={['CardPicker']}
          defaultFilters={[
            visibleCardFilter,
            userIdFilter,
            sportFilter(Sport.CRICKET),
            ...excluding.map(slug => `NOT objectID:${slug}`),
            ...(filters || []),
          ]}
        >
          <CardPicker {...props} />
        </InstantSearch>
      }
    />
  );
};

export default CardPickerDialog;

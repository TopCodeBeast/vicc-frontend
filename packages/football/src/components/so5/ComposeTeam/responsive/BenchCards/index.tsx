import { gql } from '@apollo/client';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import {
  Position,
  Rarity,
  SortingOption,
} from '@sorare/core/src/__generated__/globalTypes';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { ResponsiveBanner } from '@sorare/core/src/components/content/ResponsiveBanner';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import { positionNames } from '@sorare/core/src/lib/players';

import Context from '@football/components/so5/ComposeTeam/Context';
import BenchCardRow from '@football/components/so5/ComposeTeam/responsive/BenchCardRow';
import useShortcut from '@football/hooks/useShortcut';
import { Position as So5Position } from '@football/lib/so5';

import {
  BenchCardsQuery,
  BenchCardsQueryVariables,
} from './__generated__/index.graphql';

const cardFragment = gql`
  fragment BenchCards_card on Card {
    slug
    assetId
    ...BenchCardRow_card
  }
  ${BenchCardRow.fragments.card}
`;

export const BENCH_CARDS_QUERY = gql`
  query BenchCardsQuery(
    $vicc5LeaderboardSlug: String!
    $query: String
    $includeUsed: Boolean
    $includeNoGame: Boolean
    $position: Position
    $selectedCards: [String!]!
    $after: String
    $rarities: [Rarity!]!
    $sortType: EligibleCardsSort
    $vicc5LineupId: String
    $statsView: Boolean!
    $lastFifteenVicc5AverageScore: RangeInput
    $deckId: String
  ) {
    so5: vicc5Root {
      so5Leaderboard: vicc5Leaderboard(slug: $vicc5LeaderboardSlug) {
        slug
        so5League: vicc5League {
          slug
          name
        }
        myEligibleCards(
          query: $query
          includeUsed: $includeUsed
          includeNoGame: $includeNoGame
          position: $position
          selectedCards: $selectedCards
          after: $after
          rarities: $rarities
          first: 10
          sortType: $sortType
          vicc5LineupId: $vicc5LineupId
          lastFifteenVicc5AverageScore: $lastFifteenVicc5AverageScore
          deckId: $deckId
        ) {
          nodes {
            slug
            assetId
            position
            ...BenchCards_card
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
  ${cardFragment}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--unit);
`;

const Empty = styled(Text16)`
  display: flex;
  flex-direction: column;
  padding: var(--quadruple-unit) var(--triple-unit);
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const EmptyBench = ({ activePosition }: { activePosition: So5Position }) => {
  const { formatMessage } = useIntl();
  return (
    <Empty color="var(--c-neutral-1000)" bold>
      {activePosition === 'Extra Player' ? (
        <FormattedMessage
          id="BenchCards.noCards"
          defaultMessage="No Cards available for this division!"
        />
      ) : (
        <FormattedMessage
          id="BenchCards.noPositionCards"
          defaultMessage="No available {position} Cards for this division!"
          values={{
            position: formatMessage(positionNames[activePosition]),
          }}
        />
      )}
    </Empty>
  );
};

export const BenchCards = () => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const {
    lineup,
    so5Leaderboard,
    addCard,
    activePosition,
    filters,
    setFilters,
    statsView,
    search,
    cardsScarcities,
    displayedAverageScore,
    so5Lineup,
    customListFilter,
  } = useContext(Context)!;
  const {
    flags: { useFootballShortcuts = false },
  } = useFeatureFlags();
  const variables = useMemo(
    () => ({
      vicc5LeaderboardSlug: so5Leaderboard.slug,
      selectedCards: Object.values(lineup)
        .map(a => a.card)
        .filter(Boolean)
        .map(c => c!.slug),
      query: search,
      includeUsed: filters.includeUsedCards,
      includeNoGame: filters.includeNoGameCards,
      lastFifteenVicc5AverageScore: filters.lastFifteenVicc5AverageScore,
      position:
        activePosition === 'Extra Player' ? null : (activePosition as Position),
      rarities: cardsScarcities as Rarity[],
      vicc5LineupId: idFromObject(so5Lineup.id),
      sortType: {
        direction: SortingOption.DESC,
        type: displayedAverageScore,
      },
      statsView,
      deckId: customListFilter,
    }),
    [
      so5Leaderboard.slug,
      lineup,
      search,
      filters,
      activePosition,
      cardsScarcities,
      displayedAverageScore,
      so5Lineup,
      statsView,
      customListFilter,
    ]
  );

  const { data, loading, loadMore } = usePaginatedQuery<
    BenchCardsQuery,
    BenchCardsQueryVariables
  >(BENCH_CARDS_QUERY, {
    connection: 'CardConnection',
    variables,
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });
  const cards = data?.football.so5.so5Leaderboard.myEligibleCards.nodes || [];
  const currentCard = lineup[activePosition].card && {
    ...lineup[activePosition].card!,
  };
  const displayedCards = currentCard ? [currentCard, ...cards] : cards;

  useShortcut(
    'down',
    () => {
      setHighlightedIndex(index => {
        return Math.min(index + 1, displayedCards.length - 1);
      });
    },
    [displayedCards]
  );
  useShortcut(
    'up',
    () => {
      setHighlightedIndex(index => {
        return Math.max(0, index - 1);
      });
    },
    [displayedCards]
  );

  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, {
        ...variables,
        after:
          data?.football.so5.so5Leaderboard.myEligibleCards.pageInfo.endCursor,
      });
    }, [
      loadMore,
      variables,
      data?.football.so5.so5Leaderboard.myEligibleCards.pageInfo.endCursor,
    ]),
    Boolean(
      data?.football.so5.so5Leaderboard.myEligibleCards.pageInfo.hasNextPage
    ),
    loading
  );

  useEffect(() => {
    if (
      data?.football.so5.so5Leaderboard.myEligibleCards.nodes.length === 0 &&
      !loading &&
      !filters.includeNoGameCards
    ) {
      setFilters(prevFilters => ({ ...prevFilters, includeNoGameCards: true }));
    }
  }, [data, loading, setFilters, filters.includeNoGameCards]);

  if (highlightedIndex >= 0 && loading) {
    setHighlightedIndex(-1);
  }

  return (
    <div>
      <Container>
        <ResponsiveBanner
          slotName="so5_compose_team"
          so5LeaderboardType={so5Leaderboard.so5LeaderboardType}
        />
        {displayedCards.length > 0 &&
          displayedCards.map((c, idx) => (
            <BenchCardRow
              card={c}
              highlighted={useFootballShortcuts && idx === highlightedIndex}
              onSelect={() => addCard(c)}
              key={c.slug}
              statsView={statsView}
              selectedCard={c === currentCard}
            />
          ))}
        <InfiniteScrollLoader white />
        {!loading && displayedCards.length === 0 && (
          <EmptyBench activePosition={activePosition} />
        )}
      </Container>
    </div>
  );
};

BenchCards.fragments = {
  card: cardFragment,
};

export default BenchCards;

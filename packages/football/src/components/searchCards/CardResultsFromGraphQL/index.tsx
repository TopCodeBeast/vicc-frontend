import { gql } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import {
  useHits,
  useInstantSearch,
  usePagination,
} from 'react-instantsearch-hooks-web';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { SEARCH_PARAMS } from '@sorare/core/src/components/search/InstantSearch/types';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSearchCardsContext } from '@sorare/core/src/contexts/searchCards';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useQueryString from '@sorare/core/src/hooks/useQueryString';
import {
  MarketplaceHit,
  StackProps,
  joinFiltersWithOr,
} from '@sorare/core/src/lib/algolia';
import { groupBy } from '@sorare/core/src/lib/arrays';

import useFacetCounts from '@sorare/marketplace/src/hooks/search/useFacetCounts';
import useFacetedSearchCards from '@sorare/marketplace/src/hooks/search/useFacetedSearchCards';
import { useSortByPrice } from '@sorare/marketplace/src/hooks/useSortByPrice';
import useFiltersCount from '@sorare/marketplace/src/search/FiltersManager/useFiltersCount';
import { CardResultsProps } from '@sorare/marketplace/src/searchCards/AdvancedCardSearch/types';

import CardPreviewGrid from '@football/components/card/CardPreviewGrid';

import { CardsQuery, CardsQueryVariables } from './__generated__/index.graphql';
import useRecentCurrentUserCardsQuery from './useRecentCurrentUserCardsQuery';

type CardsQuery_cards = CardsQuery['cards'][number];//CardsQuery['football']['cards'][number];

type Item = CardsQuery_cards & { stack?: StackProps };

type Token = CardsQuery_cards['token'] & { stack?: StackProps };

const cardFragment = gql`
  fragment CardResultsFromGraphQL_card on Card {
    slug
    assetId
    visible
    ownerSince
    ...CardPreviewGrid_card
  }
  ${CardPreviewGrid.fragments.card}
`;

//TODO**********************************Remove football
export const CARDS_QUERY = gql`
  query CardsQuery($slugs: [String!]!) {
    cards(slugs: $slugs) {
      slug
      assetId
      visible
      ...CardResultsFromGraphQL_card
    }
  }
  ${cardFragment}
`;

const filterVisibleCards = (cards?: CardsQuery_cards[]) =>
  cards?.filter(card => card.visible);

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  padding: 20px;
`;

export const CardResultsFromGraphQL = (props: CardResultsProps) => {
  const {
    hideOwner,
    galleryOwnerSlug,
    removeFinishedAuctions,
    removeEndedSingleSaleOffers,
    topic,
    hideSorareUser,
    stackable,
    showDesktopFilter,
  } = props;
  const { hits: hitsWithDistinct, results } = useHits<MarketplaceHit>();
  const { currentRefinement: page, nbPages, refine: setPage } = usePagination();
  const index = results?.index;

  const sortByPrice = useSortByPrice<Token | Item>();

  const [sortedItems, setSortedItems] = useState<Item[] | null>(null);
  const { algoliaCardIndexes } = useConfigContext();
  const { currentUser } = useCurrentUserContext();
  const { includeCommonCards } = useSearchCardsContext();

  const { indexUiState } = useInstantSearch();
  const isCurrentUser = indexUiState.configure?.filters?.includes(
    `user.id:${idFromObject(currentUser?.id)}`
  );
  const isRefined = useFiltersCount() > 0;
  const { recentCurrentUserCards } = useRecentCurrentUserCardsQuery({
    skip:
      index !== algoliaCardIndexes['Cards New'] || !isCurrentUser || isRefined,
    includeCommonCards,
  });
  const unstacked = useQueryString(SEARCH_PARAMS.UNSTACKED);
  const stacked = stackable && !unstacked;

  const recentCurrentUserCardsSlugs = (recentCurrentUserCards || []).map(
    c => c.slug
  );

  const distinctHits = useMemo(
    // eslint-disable-next-line no-underscore-dangle
    () => hitsWithDistinct.filter(h => !h._distinctSeqID),
    [hitsWithDistinct]
  );

  const distinctKeys = useMemo(
    () => distinctHits.map(hit => hit.sale?.distinct_key).filter(Boolean),
    [distinctHits]
  );

  const lowestPriceHits = useFacetedSearchCards({
    index: algoliaCardIndexes['Lowest Price'],
    distinct: true,
    facetFilters: `(${joinFiltersWithOr(
      distinctHits.map(
        (h, i) => `sale.distinct_key:${h.sale?.distinct_key}<score=${1000 - i}>`
      )
    )})`,
    // eslint-disable-next-line no-underscore-dangle
    params: results?._state,
    skip:
      !stacked ||
      !index ||
      ![
        algoliaCardIndexes['Newly Listed'],
        algoliaCardIndexes['Popular Player'],
      ].includes(index) ||
      distinctHits.length === 0,
  });

  const stackedTokensCounts = useFacetCounts({
    index: algoliaCardIndexes['Highest Price'],
    attribute: 'sale.distinct_key',
    values: distinctKeys,
    // eslint-disable-next-line no-underscore-dangle
    params: results?._state,
    skip: !stacked || distinctKeys.length === 0,
  });

  const hitsWithRecentCurrentUserCards = useMemo(() => {
    const hits = lowestPriceHits?.hits || distinctHits;

    return [
      ...(page === 0
        ? recentCurrentUserCardsSlugs
            .filter(slug => !hits.find(h => h.objectID === slug))
            .map(objectID => ({ objectID, sale: undefined }))
        : []),
      ...hits,
    ];
  }, [lowestPriceHits, distinctHits, page, recentCurrentUserCardsSlugs]);

  const { data, loading } = useQuery<CardsQuery, CardsQueryVariables>(
    CARDS_QUERY,
    {
      variables: {
        slugs: hitsWithRecentCurrentUserCards.map(h => h.objectID),
      },
      skip: hitsWithRecentCurrentUserCards.length === 0,
    }
  );

  const cards = useMemo(
    () => filterVisibleCards(data?.cards), //TODO
    [data]
  );

  // Dependency array needs to be updated manually
  // react-hooks/exhaustive-deps is disabled for the following useEffect
  useEffect(() => {
    if (loading) return;

    if (cards) {
      const cardsBySlug = groupBy(c => c.slug, cards);

      let sortedHits = hitsWithRecentCurrentUserCards;

      // Cards are already sorted through Algolia but for the ones that were just claimed
      // and ownerSince not yet indexed in Algolia, we need to force the sorting through frontend
      // in order for new card rewards to show first in the user gallery after he claims it.
      // This only works for rewards that appears in 1st Algolia page hits.
      // If the reward card can be claimed since a long time ago, the user will need to
      // wait few minutes for the card to be indexed and to show first in his gallery.
      if (index === algoliaCardIndexes['Cards New']) {
        sortedHits = sortedHits.sort((a, b) => {
          return cardsBySlug[a.objectID]?.[0] && cardsBySlug[b.objectID]?.[0]
            ? Date.parse(cardsBySlug[b.objectID][0].ownerSince!) -
                Date.parse(cardsBySlug[a.objectID][0].ownerSince!)
            : 0;
        });
      } else if (index === algoliaCardIndexes['Popular Player']) {
        const tempSortedHits: any[] = [];

        for (let i = 0; i < sortedHits.length; i += 1) {
          const { slug } = sortedHits[i].player || {};
          if (!slug) {
            tempSortedHits.push(sortedHits[i]);
          } else if (!tempSortedHits.find(h => h.player?.slug === slug)) {
            tempSortedHits.push(
              ...sortedHits
                .slice(i)
                .filter(h => h.player?.slug === slug)
                .sort(
                  (a, b) =>
                    (a.rarity || '').localeCompare(b.rarity || '') ||
                    (b.season || 0) - (a.season || 0)
                )
            );
          }
        }

        sortedHits = tempSortedHits;
      }

      setSortedItems(
        sortedHits
          .map(hit => {
            if (cardsBySlug[hit.objectID])
              return {
                ...(stacked &&
                  hit.sale?.distinct_key && {
                    stack: {
                      algoliaDistinctKey: hit.sale.distinct_key,
                      // eslint-disable-next-line no-underscore-dangle
                      params: results?._state,
                      count: stackedTokensCounts[hit.sale.distinct_key],
                    },
                  }),
                ...cardsBySlug[hit.objectID][0]!,
              };

            return undefined;
          })
          .filter(Boolean)
      );
    } else {
      setSortedItems([]);
    }
    // we explicitly ignore the hitsWithRecentCurrentUserCards dependencies
    // because WithInstantSearch returns a new Array on every render.
    // cards is a consequence of hitsWithRecentCurrentUserCards so it does not change anything.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cards,
    setSortedItems,
    loading,
    index,
    algoliaCardIndexes,
    stackedTokensCounts,
    stacked,
    // eslint-disable-next-line no-underscore-dangle
    results?._state,
  ]);

  // eslint-disable-next-line no-underscore-dangle
  if (!sortedItems || !results || results?.__isArtificial) {
    return (
      <Root>
        <LoadingIndicator />
      </Root>
    );
  }

  const notSellableItems = sortedItems.filter(item => !item.token);
  const customSortedItems =
    results?.index === algoliaCardIndexes['Highest Price']
      ? [
          ...sortByPrice(sortedItems.map(({ token }) => token).filter(Boolean))
            .map(token =>
              sortedItems.find(item => token.assetId === item.assetId)
            )
            .filter(Boolean),
          ...notSellableItems,
        ]
      : sortedItems;

  // return (
  //   <CardPreviewGrid
  //     page={page}
  //     nbPages={nbPages}
  //     setPage={setPage}
  //     items={customSortedItems}
  //     hideOwner={hideOwner}
  //     galleryOwnerSlug={galleryOwnerSlug}
  //     removeFinishedAuctions={removeFinishedAuctions}
  //     removeEndedSingleSaleOffers={removeEndedSingleSaleOffers}
  //     topic={topic}
  //     hideSorareUser={hideSorareUser}
  //     stackable={stackable}
  //     loading={loading && !data}
  //     showDesktopFilter={showDesktopFilter}
  //   />
  // );

  return <>CardPreviewGrid555</>
};

CardResultsFromGraphQL.fragments = {
  card: cardFragment,
};

export default CardResultsFromGraphQL;

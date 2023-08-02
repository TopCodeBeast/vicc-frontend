import { TypedDocumentNode, gql } from '@apollo/client';
import { useMemo } from 'react';

import { useConfigContext } from '@sorare/core/src/contexts/config';
import { isType } from '@sorare/core/src/gql';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import {
  CardHit,
  joinFiltersWithAnd,
  joinFiltersWithOr,
} from '@sorare/core/src/lib/algolia';

import useFacetedSearchCards from '@sorare/marketplace/src/hooks/search/useFacetedSearchCards';

import { EmptySlot } from '@football/components/collections/EmptySlot';

import {
  CollectionSlots_cardCollection,
  CollectionSlots_cardCollectionSlot,
  CollectionSlots_userCardCollectionSlot,
} from './__generated__/index.graphql';
import {
  EmptySlotsSalesQuery,
  EmptySlotsSalesQueryVariables,
} from './__generated__/queries.graphql';

// Needs to be defined outside the component to avoid infinite rendering loop.
const ATTRIBUTES_TO_RETRIEVE = ['asset_id'];

const EMPTY_SLOTS_SALES_QUERY = gql`
  query EmptySlotsSalesQuery($assetIds: [String!]!) {
    tokens {
      nfts(assetIds: $assetIds) {
        assetId
        slug
        metadata {
          ... on TokenCardMetadataInterface {
            id
            playerSlug
          }
        }
        ...EmptySlot_token
      }
    }
  }
  ${EmptySlot.fragments.token}
` as TypedDocumentNode<EmptySlotsSalesQuery, EmptySlotsSalesQueryVariables>;

const getPlayerSlugsFromEmptySlots = (
  slots:
    | CollectionSlots_userCardCollectionSlot[]
    | CollectionSlots_cardCollectionSlot[]
) => {
  const result: string[] = [];
  slots.forEach(slot => {
    if (isType(slot, 'CardCollectionSlot')) {
      result.push(slot.player.slug);
    } else if (slot.cardCollectionCardsCount === 0) {
      result.push(slot.slot.player.slug);
    }
  });
  return result;
};

export const useEmptySlotsSales = (
  slots:
    | CollectionSlots_userCardCollectionSlot[]
    | CollectionSlots_cardCollectionSlot[],
  cardCollection: CollectionSlots_cardCollection,
  skip: boolean
) => {
  const emptySlotsSlugs = getPlayerSlugsFromEmptySlots(slots);
  const { algoliaCardIndexes } = useConfigContext();
  const { season, rarity, team } = cardCollection;

  const searchResponse = useFacetedSearchCards({
    index: algoliaCardIndexes['Lowest Price'],
    hitsPerPage: emptySlotsSlugs.length,
    distinct: true,
    facetFilters: joinFiltersWithAnd([
      'sale.primary:false',
      'sale.bundled:false',
      'sport:football',
      `season:${season?.startYear}`,
      `rarity:${rarity}`,
      `team.slug:${team?.slug}`,
      `(${joinFiltersWithOr(
        emptySlotsSlugs.map(slug => `player.slug:${slug}`)
      )})`,
    ]),
    attributesToRetrieve: ATTRIBUTES_TO_RETRIEVE,
    skip,
  });

  const assetIds = useMemo(() => {
    const emptyCardsHits = (searchResponse?.hits as CardHit[]) || [];
    return emptyCardsHits?.map(hit => hit.asset_id).filter(Boolean) as string[];
  }, [searchResponse]);

  const { data } = useQuery(EMPTY_SLOTS_SALES_QUERY, {
    variables: { assetIds },
    skip: !assetIds?.length,
  });

  const tokens = data?.tokens.nfts;
  if (!tokens?.length) {
    return { emptySlotsSales: null };
  }
  const emptySlotsSales: Record<
    string,
    EmptySlotsSalesQuery['tokens']['nfts'][0]
  > = {};

  tokens.forEach(token => {
    const { playerSlug } = token.metadata;
    emptySlotsSales[playerSlug] = token;
  });

  return { emptySlotsSales };
};

import { add, getUnixTime } from 'date-fns';
import { useEffect, useState } from 'react';

import { Sport } from '__generated__/globalTypes';
import { AlgoliaCardIndexes, useConfigContext } from '@core/contexts/config';
import idFromObject from '@core/gql/idFromObject';
import useSearchClient from '@core/hooks/search/useSearchClient';
import { useMemoArray } from '@core/hooks/useMemoArray';
import {
  joinFiltersWithAnd,
  joinFiltersWithOr,
  sportFilter,
} from '@core/lib/algolia';

interface Props {
  index?: keyof AlgoliaCardIndexes;
  teamSlug?: string;
  playerSlugs?: string[];
  rarities?: string[];
  sport?: Sport;
  primaryMarket?: boolean;
  withBundled?: boolean;
  limit?: number;
  minMinutesBeforeSaleEnd?: number;
  distinct?: boolean;
  skip?: boolean;
}

interface HitOnSale {
  asset_id: string;
}

const useCardsOnSale = (props: Props) => {
  const {
    index = 'Lowest Price',
    teamSlug,
    playerSlugs = [],
    rarities = [],
    primaryMarket,
    withBundled,
    limit,
    sport,
    minMinutesBeforeSaleEnd,
    distinct = false,
    skip = false,
  } = props;
  const [cards, setCards] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nbHits, setNbHits] = useState<number>(0);
  const searchClient = useSearchClient();
  const { algoliaIndexes } = useConfigContext();

  // Necessary to avoid infinite loop
  const raritiesStringified = rarities.join(',');
  const playerSlugsStringified = playerSlugs.join(',');

  useEffect(() => {
    if (skip) return;
    const parsedRarities = raritiesStringified.split(',');
    const parsedPlayerSlugs = playerSlugsStringified.split(',');

    setLoading(true);
    searchClient
      .search<HitOnSale>([
        {
          indexName: algoliaIndexes[index],
          type: 'default',
          params: {
            analytics: false,
            facets: [],
            distinct,
            hitsPerPage: limit || 10,
            attributesToRetrieve: ['asset_id'],
            filters: joinFiltersWithAnd(
              [
                sport && sportFilter(sport),
                'on_sale:true',
                minMinutesBeforeSaleEnd &&
                  `sale.end_date > ${getUnixTime(
                    add(new Date(), { minutes: minMinutesBeforeSaleEnd })
                  )}`,
                primaryMarket !== undefined && `sale.primary:${primaryMarket}`,
                `sale.bundled:${!!withBundled}`,
                playerSlugsStringified &&
                  `(${joinFiltersWithOr(
                    parsedPlayerSlugs.map(
                      (playerSlug: string) => `player.slug:${playerSlug}`
                    )
                  )})`,
                teamSlug && `team.slug:${teamSlug}`,
                raritiesStringified &&
                  `(${joinFiltersWithOr(
                    parsedRarities.map((rarity: string) => `rarity:${rarity}`)
                  )})`,
              ].filter(Boolean)
            ),
          },
        },
      ])
      .then(({ results }) => {
        setCards(
          results[0].hits.map(hit => hit.asset_id || idFromObject(hit.objectID))
        );
        setNbHits(results[0].nbHits);
        setLoading(false);
      });
  }, [
    algoliaIndexes,
    index,
    limit,
    playerSlugsStringified,
    primaryMarket,
    raritiesStringified,
    searchClient,
    sport,
    teamSlug,
    withBundled,
    distinct,
    skip,
    minMinutesBeforeSaleEnd,
  ]);

  return {
    loading,
    assetIds: useMemoArray(cards),
    nbHits,
  };
};

export default useCardsOnSale;

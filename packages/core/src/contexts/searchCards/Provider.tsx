import { ReactNode, useState } from 'react';

import { SEARCH_PARAMS } from 'components/search/InstantSearch/types';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import useCustomDeck from '@sorare/core/src/hooks/decks/useCustomDeck';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useQueryString from '@sorare/core/src/hooks/useQueryString';
import { clearAll } from '@sorare/core/src/hooks/useVirtualToggle';
import { joinFiltersWithAnd, joinFiltersWithOr } from '@sorare/core/src/lib/algolia';
import { nonPlayableBlockchainRarities } from '@sorare/core/src/lib/cards';
import { FilterSeparator, FilterWidget } from '@sorare/core/src/lib/filters';

import SearchCardsContextProvider from '.';
import useFavoriteFilterValue from './useFavoriteFilterValue';
import useLeagueFilterValue from './useLeagueFilterValue';
import { useNotInLineupFilterValue } from './useNotInLineupFilterValue';
import usePlayingNextGameweekFilterValue from './usePlayingNextGameweekFilterValue';

interface Props {
  children: ReactNode;
  includeCommonCards?: boolean;
  defaultFilters?: string;
  cardFilters: (FilterWidget | FilterSeparator)[];
  advancedCardFilters?: (FilterWidget | FilterSeparator)[];
  editableLists?: boolean;
  galleryOwnerSlug?: string;
}

const SearchCardsProvider = ({
  children,
  includeCommonCards,
  defaultFilters,
  cardFilters,
  advancedCardFilters,
  editableLists,
  galleryOwnerSlug,
}: Props) => {
  const {
    flags: { useLegendMarketplaceFilter = false },
  } = useFeatureFlags();
  const [leagueFilter, setLeagueFilter] = useState<string | undefined>(
    useQueryString(SEARCH_PARAMS.LEAGUE_FILTER)
  );
  const [customDecksFilter, setCustomDecksFilter] = useState<
    string | undefined
  >(useQueryString(SEARCH_PARAMS.DECK));
  const { deck } = useCustomDeck({
    name: customDecksFilter,
    skip: !editableLists,
  });
  const cards = deck?.cards.nodes;

  const [favoriteFilter, setFavoriteFilter] = useState<boolean>(
    Boolean(useQueryString(SEARCH_PARAMS.FAVORITE_FILTER))
  );
  const [notInLineUpFilter, setNotInLineUpFilter] = useState<boolean>(
    Boolean(useQueryString(SEARCH_PARAMS.NOT_IN_LINEUP))
  );
  const [nonPlayableCards, setNonPlayableCards] = useState<boolean>(
    Boolean(useQueryString(SEARCH_PARAMS.NON_PLAYABLE_CARDS))
  );
  const [legend, setLegend] = useState<boolean>(
    Boolean(useQueryString(SEARCH_PARAMS.LEGEND))
  );
  const [playingNextGameweekFilter, setPlayingNextGameweekFilter] =
    useState<boolean>(Boolean(useQueryString(SEARCH_PARAMS.PLAYING_NEXT)));

  const { marketplacePromotionalEvents } = useConfigContext();
  const { sport } = useSportContext();
  const [promotion, setPromotion] = useState<string | undefined>(
    useQueryString(SEARCH_PARAMS.PROMOTION)
  );

  const leagueFilterValue = useLeagueFilterValue(leagueFilter);
  const favoriteFilterValue = useFavoriteFilterValue();
  const notInLineupFilterValue = useNotInLineupFilterValue();
  const playingNextGameweekFilterValue = usePlayingNextGameweekFilterValue();

  const filterWidgets = [
    ...(cardFilters || []),
    ...(advancedCardFilters || []),
  ];
  const collectibleFilterWidget = filterWidgets.find(
    w => w.type === 'virtualToggle' && w.key === 'collectible'
  );

  const hasCollectibleFilter = !!collectibleFilterWidget;

  const promotedCards =
    marketplacePromotionalEvents
      .find(e => e.sport === sport)
      ?.events?.find(e => e.name === promotion)?.objectIds || [];

  const nonPlayableCardsFilters =
    hasCollectibleFilter &&
    !nonPlayableCards &&
    joinFiltersWithAnd(
      nonPlayableBlockchainRarities.map(rarity => `NOT rarity:${rarity}`)
    );

  const legendFilters =
    useLegendMarketplaceFilter &&
    hasCollectibleFilter &&
    !legend &&
    'NOT card_edition.name:legend';

  const filters = [
    defaultFilters,
    includeCommonCards === false && 'NOT rarity:common',
    nonPlayableCardsFilters,
    legendFilters,
    customDecksFilter &&
      joinFiltersWithOr([
        ...(cards?.map(({ slug }) => `objectID:"${slug}"`) || []),
        `custom_decks.name:"${customDecksFilter}"`,
      ]),
    leagueFilter && leagueFilterValue,
    favoriteFilter && favoriteFilterValue,
    notInLineUpFilter && notInLineupFilterValue,
    playingNextGameweekFilter && playingNextGameweekFilterValue,
    promotedCards.length > 0 &&
      joinFiltersWithOr(promotedCards.map(id => `objectID:"${id}"`)),
  ].filter(Boolean);

  const clearFilters = () => {
    setLeagueFilter(undefined);
    setCustomDecksFilter(undefined);
    setFavoriteFilter(false);
    setNotInLineUpFilter(false);
    setNonPlayableCards(false);
    setPlayingNextGameweekFilter(false);
    setPromotion(undefined);

    clearAll();
  };

  return (
    <SearchCardsContextProvider
      value={{
        filters,
        leagueFilter,
        setLeagueFilter,
        customDecksFilter,
        setCustomDecksFilter,
        favoriteFilter,
        setFavoriteFilter,
        notInLineUpFilter,
        setNotInLineUpFilter,
        hasCollectibleFilter,
        nonPlayableCards,
        setNonPlayableCards,
        legend,
        setLegend,
        playingNextGameweekFilter,
        setPlayingNextGameweekFilter,
        promotion,
        setPromotion,
        clearFilters,
        includeCommonCards,
        editableLists,
        galleryOwnerSlug,
      }}
    >
      {children}
    </SearchCardsContextProvider>
  );
};

export default SearchCardsProvider;

import { useCallback } from 'react';
import { useInstantSearch } from 'react-instantsearch-hooks-web';

import { ExtendedUIState } from '@core/components/search/InstantSearch/types';
// import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSearchCardsContext } from '@core/contexts/searchCards';
import { VIRTUAL_TOGGLE_FILTERS } from '@core/lib/filters';

import useVirtualToggle from './useVirtualToggle';

export const useVirtualToggleManager = () => {
  const {
    setPlayingNextGameweekFilter,
    setFavoriteFilter,
    hasCollectibleFilter,
    setNonPlayableCards,
    setLegend,
    setLeagueFilter,
    setPromotion,
    setCustomDecksFilter,
    setNotInLineUpFilter,
  } = useSearchCardsContext() ?? {};
  const currentUser = null;// const { currentUser } = useCurrentUserContext();
  const { setIndexUiState } = useInstantSearch<ExtendedUIState>();

  const { toggle: togglePlayingNextGameweekFilter } = useVirtualToggle<boolean>(
    {
      name: VIRTUAL_TOGGLE_FILTERS.playingNextGameweekFilter.name,
    }
  );
  const { toggle: toggleFavoriteFilter } = useVirtualToggle<boolean>({
    name: VIRTUAL_TOGGLE_FILTERS.favoriteFilter.name,
  });
  const { toggle: toggleNotInLineupFilter } = useVirtualToggle<boolean>({
    name: VIRTUAL_TOGGLE_FILTERS.notInLineupFilter.name,
  });
  const { toggle: toggleNonPlayableCardsFilter } = useVirtualToggle<boolean>({
    name: VIRTUAL_TOGGLE_FILTERS.nonPlayableCardsFilter.name,
  });
  const { toggle: toggleLegendFilter } = useVirtualToggle<boolean>({
    name: VIRTUAL_TOGGLE_FILTERS.legendFilter.name,
  });
  const { toggle: togglePromotedCardsFilter } = useVirtualToggle<boolean>({
    name: VIRTUAL_TOGGLE_FILTERS.promotedCardsFilter.name,
  });
  const { toggle: toggleLeagueFilter } = useVirtualToggle<boolean>({
    name: VIRTUAL_TOGGLE_FILTERS.leagueFilter.name,
  });
  const { toggle: toggleUnstackedFilter } = useVirtualToggle<boolean>({
    name: VIRTUAL_TOGGLE_FILTERS.unstackedFilter.name,
  });
  const { toggle: toggleCustomDecksFilter } = useVirtualToggle<boolean>({
    name: VIRTUAL_TOGGLE_FILTERS.customDecksFilter.name,
  });

  return useCallback(
    (
      virtualToggle: {
        [name: string]: string | boolean | string[] | undefined;
      },
      shouldSetUiState = true
    ) => {
      if (!virtualToggle) return;

      const actionsPerVirtualToggle: {
        [key: string]: {
          toggle: (value?: any) => void;
          setState?: (value: any) => void;
          condition?: boolean;
        };
      } = {
        [VIRTUAL_TOGGLE_FILTERS.playingNextGameweekFilter.name]: {
          toggle: togglePlayingNextGameweekFilter,
          setState: setPlayingNextGameweekFilter,
        },
        [VIRTUAL_TOGGLE_FILTERS.favoriteFilter.name]: {
          toggle: toggleFavoriteFilter,
          setState: setFavoriteFilter,
          condition: !!currentUser,
        },
        [VIRTUAL_TOGGLE_FILTERS.notInLineupFilter.name]: {
          toggle: toggleNotInLineupFilter,
          setState: setNotInLineUpFilter,
          condition: !!currentUser,
        },
        [VIRTUAL_TOGGLE_FILTERS.nonPlayableCardsFilter.name]: {
          toggle: toggleNonPlayableCardsFilter,
          setState: setNonPlayableCards,
          condition: !!hasCollectibleFilter,
        },
        [VIRTUAL_TOGGLE_FILTERS.legendFilter.name]: {
          toggle: toggleLegendFilter,
          setState: setLegend,
          condition: !!hasCollectibleFilter,
        },
        [VIRTUAL_TOGGLE_FILTERS.promotedCardsFilter.name]: {
          toggle: togglePromotedCardsFilter,
          setState: setPromotion,
        },
        [VIRTUAL_TOGGLE_FILTERS.leagueFilter.name]: {
          toggle: toggleLeagueFilter,
          setState: setLeagueFilter,
        },
        [VIRTUAL_TOGGLE_FILTERS.unstackedFilter.name]: {
          toggle: toggleUnstackedFilter,
        },
        [VIRTUAL_TOGGLE_FILTERS.customDecksFilter.name]: {
          toggle: toggleCustomDecksFilter,
          setState: setCustomDecksFilter,
        },
      };

      Object.entries(virtualToggle).forEach(([name, value]) => {
        const { toggle, setState, condition } = actionsPerVirtualToggle[name];
        if (condition ?? true) {
          toggle(value);
          setState?.(value);
        }
      });
      if (shouldSetUiState) {
        setIndexUiState(oldState => ({
          ...oldState,
          virtualToggle: { ...oldState.virtualToggle, ...virtualToggle },
        }));
      }
    },
    [
      togglePlayingNextGameweekFilter,
      setPlayingNextGameweekFilter,
      toggleFavoriteFilter,
      setFavoriteFilter,
      currentUser,
      toggleNotInLineupFilter,
      setNotInLineUpFilter,
      toggleNonPlayableCardsFilter,
      setNonPlayableCards,
      hasCollectibleFilter,
      toggleLegendFilter,
      setLegend,
      togglePromotedCardsFilter,
      setPromotion,
      toggleLeagueFilter,
      setLeagueFilter,
      toggleUnstackedFilter,
      toggleCustomDecksFilter,
      setIndexUiState,
      setCustomDecksFilter,
    ]
  );
};

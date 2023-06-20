import { createContext, useContext } from 'react';

export interface SearchCardsContext {
  filters: string[];
  leagueFilter: string | undefined;
  setLeagueFilter: (filter: string | undefined) => void;
  customDecksFilter: string | undefined;
  setCustomDecksFilter: (filter: string | undefined) => void;
  favoriteFilter: boolean;
  setFavoriteFilter: (filter: boolean) => void;
  notInLineUpFilter: boolean;
  setNotInLineUpFilter: (filter: boolean) => void;
  hasCollectibleFilter?: boolean;
  nonPlayableCards: boolean;
  setNonPlayableCards: (filter: boolean) => void;
  legend: boolean;
  setLegend: (filter: boolean) => void;
  playingNextGameweekFilter: boolean;
  setPlayingNextGameweekFilter: (filter: boolean) => void;
  promotion: string | undefined;
  setPromotion: (promo: string | undefined) => void;
  clearFilters: () => void;
  includeCommonCards?: boolean;
  editableLists?: boolean;
  galleryOwnerSlug?: string;
}

export const searchCardsContext = createContext<SearchCardsContext | null>(
  null
);

export const useSearchCardsContext = () => useContext(searchCardsContext)!;

export default searchCardsContext.Provider;

import { createContext, useContext } from 'react';

export interface SearchCardsContext {
  legend: boolean;
  setLegend: (filter: boolean) => void;
}

export const searchCardsContext = createContext<SearchCardsContext | null>(
  null
);

export const useSearchCardsContext = () => useContext(searchCardsContext)!;

export default searchCardsContext.Provider;

import { createContext, useContext } from 'react';
import { Params } from 'react-router-dom';

import { Sport } from '__generated__/globalTypes';

export type GenerateSportPathFunctionType = (
  path: string,
  options?: {
    params?: Params;
    sport?: Sport;
  }
) => string;

export interface SportContext {
  sport?: Sport;
  generateSportPath: GenerateSportPathFunctionType;
}

export const sportContext = createContext<SportContext | null>(null);

export const useSportContext = () => useContext(sportContext)!;

export default sportContext.Provider;

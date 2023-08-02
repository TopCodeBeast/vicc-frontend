import { createContext, useContext } from 'react';

import { Sport } from '__generated__/globalTypes';

export interface AppBarContext {
  small: boolean;
  sport?: Sport;
  openMenu: (id: string) => void;
  closeMenu: () => void;
  openedMenu: string | undefined;
}

export const appBarContext = createContext<AppBarContext | undefined>(
  undefined
);

export const useAppBarContext = () => useContext(appBarContext)!;

export default appBarContext.Provider;

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useSessionStorage } from 'react-use';

import { Sport } from '__generated__/globalTypes';
import { useSportContext } from 'contexts/sport';
import { useIsDesktop } from '@sorare/core/src/hooks/device/useIsDesktop';
import useTouchScreen from '@sorare/core/src/hooks/device/useTouchScreen';
import useIsLanding from '@sorare/core/src/hooks/useIsLandingPage';
import useIsMlbPage from '@sorare/core/src/hooks/useIsMlbPage';
import useIsNBAPage from '@sorare/core/src/hooks/useIsNBAPage';
import { useLocationChanged } from '@sorare/core/src/hooks/useLocationChanged';
import useSharedAccrossSportsPage from '@sorare/core/src/hooks/useSharedAccrossSportsPage';

import AppBarContextProvider from '.';

interface Props {
  children: ReactNode;
}

const AppBarProvider = ({ children }: Props) => {
  const isDesktop = useIsDesktop();
  const isMouseFriendlyDevice = !useTouchScreen();

  const locationChanged = useLocationChanged();
  const isMlbPage = useIsMlbPage();
  const isNBAPage = useIsNBAPage();
  const isLandingPage = useIsLanding();
  const sharedPage = useSharedAccrossSportsPage();
  const { sport: sportConfig } = useSportContext();
  const [sportContext, setSportContext] = useSessionStorage<Sport | undefined>(
    'sport'
  );

  useEffect(() => {
    if (!sharedPage && !sportContext && sportConfig) {
      setSportContext(sportConfig);
    }

    if (isMlbPage) {
      setSportContext(Sport.BASEBALL);
    } else if (isNBAPage) {
      setSportContext(Sport.NBA);
    } else if (!sharedPage) {
      setSportContext(Sport.FOOTBALL);
    } else if (isLandingPage) {
      setSportContext(undefined);
    }
  }, [
    sharedPage,
    sportContext,
    sportConfig,
    setSportContext,
    isMlbPage,
    isNBAPage,
    isLandingPage,
  ]);

  const [openedMenu, setOpenedMenu] = useState<string | undefined>(undefined);

  const openMenu = useCallback((menu: string) => {
    setOpenedMenu(menu);
  }, []);

  const closeMenu = useCallback(() => {
    setOpenedMenu(undefined);
  }, []);

  useEffect(() => {
    if (locationChanged) closeMenu();
  }, [locationChanged, closeMenu]);

  return (
    <AppBarContextProvider
      value={{
        small: !(isDesktop && isMouseFriendlyDevice),
        sport: sportContext,
        openMenu,
        closeMenu,
        openedMenu,
      }}
    >
      {children}
    </AppBarContextProvider>
  );
};

export default AppBarProvider;

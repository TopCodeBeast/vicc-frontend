import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Sport } from '@core/__generated__/globalTypes';
import { useSportContext } from '@core/contexts/sport';
import { useIsDesktop } from '@core/hooks/device/useIsDesktop';
import useTouchScreen from '@core/hooks/device/useTouchScreen';
import useIsLanding from '@core/hooks/useIsLandingPage';
import useIsMlbPage from '@core/hooks/useIsMlbPage';
import useIsNBAPage from '@core/hooks/useIsNBAPage';
import { useLocationChanged } from '@core/hooks/useLocationChanged';
import { SESSION_STORAGE, useSessionStorage } from '@core/hooks/useSessionStorage';
import useSharedAccrossSportsPage from '@core/hooks/useSharedAccrossSportsPage';

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
  const { getValue: getSportContext, setValue: setSportContext } =
    useSessionStorage(SESSION_STORAGE.sport);
  const sportContext = getSportContext();

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
      setSportContext(null);
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
        sport: sportContext || undefined,
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

import { faHome, faShop } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Sport } from '__generated__/globalTypes';
import { Diamond } from '@core/atoms/icons/Diamond';
import { Jersey } from '@core/atoms/icons/Jersey';
import {
  FOOTBALL_CLUB_SHOP,
  FOOTBALL_HOME,
  FOOTBALL_LOBBY,
  FOOTBALL_MARKET,
} from '@core/constants/routes';
import { useSportContext } from '@core/contexts/sport';
import { useIsDesktop } from '@core/hooks/device/useIsDesktop';
import useTouchScreen from '@core/hooks/device/useTouchScreen';
import { SESSION_STORAGE, useSessionStorage } from '@core/hooks/useSessionStorage';
import { useShowBottomBarNavigation } from '@core/lib/featureFlags';
import { navLabels } from '@core/lib/glossary';

const sportsNavigation = {
  [Sport.FOOTBALL]: [
    {
      id: 'home',
      icon: <FontAwesomeIcon icon={faHome} />,
      to: FOOTBALL_HOME,
      label: navLabels.home,
    },
    {
      id: 'market',
      icon: <FontAwesomeIcon icon={faShop} />,
      to: FOOTBALL_MARKET,
      label: navLabels.market,
    },
    {
      id: 'play',
      icon: <Jersey />,
      to: FOOTBALL_LOBBY,
      label: navLabels.gamingArena,
    },
    {
      id: 'clubshop',
      icon: <Diamond />,
      to: FOOTBALL_CLUB_SHOP,
      label: navLabels.clubshop,
    },
  ],
  [Sport.BASEBALL]: undefined,
  [Sport.NBA]: undefined,
};

export const useBottomBarNavItems = () => {
  const { getValue: getSport } = useSessionStorage(SESSION_STORAGE.sport);
  const { sport } = useSportContext();
  const showBottomBarNavigation = useShowBottomBarNavigation();
  const isDesktop = useIsDesktop();
  const isMouseFriendlyDevice = !useTouchScreen();
  const isTouchDevice = !(isDesktop && isMouseFriendlyDevice);
  const currentSport = sport || getSport();
  const showBottomBarFor =
    isTouchDevice && showBottomBarNavigation && currentSport;

  return (showBottomBarFor && sportsNavigation[showBottomBarFor]) || undefined;
};

export default useBottomBarNavItems;

import { faHome, faShop } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSessionStorage } from 'react-use';

import { Sport } from '__generated__/globalTypes';
import { Diamond } from '@sorare/core/src/atoms/icons/Diamond';
import { Jersey } from '@sorare/core/src/atoms/icons/Jersey';
import {
  FOOTBALL_CLUB_SHOP,
  FOOTBALL_HOME,
  FOOTBALL_LOBBY,
  FOOTBALL_MARKET,
} from '@sorare/core/src/constants/routes';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import { useIsDesktop } from '@sorare/core/src/hooks/device/useIsDesktop';
import useTouchScreen from '@sorare/core/src/hooks/device/useTouchScreen';
import { useShowBottomBarNavigation } from '@sorare/core/src/lib/featureFlags';
import { navLabels } from '@sorare/core/src/lib/glossary';

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
  const [sportContext] = useSessionStorage<Sport | undefined>('sport');
  const { sport } = useSportContext();
  const showBottomBarNavigation = useShowBottomBarNavigation();
  const isDesktop = useIsDesktop();
  const isMouseFriendlyDevice = !useTouchScreen();
  const isTouchDevice = !(isDesktop && isMouseFriendlyDevice);
  const currentSport = sport || sportContext;
  const showBottomBarFor =
    isTouchDevice && showBottomBarNavigation && currentSport;

  return (showBottomBarFor && sportsNavigation[showBottomBarFor]) || undefined;
};

export default useBottomBarNavItems;

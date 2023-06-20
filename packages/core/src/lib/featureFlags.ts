import { withLDProvider } from 'launchdarkly-react-client-sdk';
import { ComponentType } from 'react';

import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

import { LAUNCH_DARKLY_CLIENT_SIDE_ID } from '../config';

export const withFFProvider = (component: ComponentType) =>
  withLDProvider({
    clientSideID: LAUNCH_DARKLY_CLIENT_SIDE_ID,
    user: {
      key: '00000000-0000-0000-0000-000000000000',
    },
  })(component);

export const useUseCustomLists = () => {
  const {
    flags: { useCustomLists = false },
  } = useFeatureFlags();
  return useCustomLists;
};

export const useUseHomeTimelineLayout = () => {
  const {
    flags: {
      useHomeTimelineLayout = 'out',
      useHomeTimelineLayoutExistingUsers = false,
    },
  } = useFeatureFlags();

  return (
    useHomeTimelineLayout === 'treatment' || useHomeTimelineLayoutExistingUsers
  );
};

export const useShowBottomBarNavigation = () => {
  const {
    flags: { useShowBottomBarNavigation: showBottomBarNavigation = false },
  } = useFeatureFlags();
  return !!showBottomBarNavigation;
};

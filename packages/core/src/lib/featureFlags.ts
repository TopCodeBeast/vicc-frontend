// import { withLDProvider } from 'launchdarkly-react-client-sdk';
import { ComponentType } from 'react';

import useFeatureFlags from '@core/hooks/useFeatureFlags';

import { LAUNCH_DARKLY_CLIENT_SIDE_ID } from '../config';

/*export const withFFProvider = (
  component: ComponentType<React.PropsWithChildren<unknown>>
) =>
  withLDProvider({
    clientSideID: LAUNCH_DARKLY_CLIENT_SIDE_ID,
    user: {
      key: '00000000-0000-0000-0000-000000000000',
    },
  })(component);*/

export const useUseCustomLists = () => {
  const {
    flags: { useCustomLists = true },
  } = useFeatureFlags();
  return useCustomLists;
};

export const useShowBottomBarNavigation = () => {
  const {
    flags: { useShowBottomBarNavigation: showBottomBarNavigation = false },
  } = useFeatureFlags();
  return !!showBottomBarNavigation;
};

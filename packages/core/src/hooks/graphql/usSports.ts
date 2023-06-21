import { useMemo } from 'react';

import {
  SOFE_API_PATH,
  SOFE_API_ROOT,
  US_SPORTS_API_PATH,
  US_SPORTS_API_ROOT,
} from 'config';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { getUsSportsApolloClient } from '@core/lib/usSportsGraphql/client';

import { useDebugLink } from './useDebugLink';
import { useTMLink } from './useTMLink';

export const useUSSportsApolloClient = () => {
  const {
    flags: { useUsSportsGraphqlFederation = false },
  } = useFeatureFlags();
  const { showNotification } = useSnackNotificationContext();
  const debugLink = useDebugLink();
  const path = useUsSportsGraphqlFederation
    ? SOFE_API_PATH
    : US_SPORTS_API_PATH;
  const tmLink = useTMLink({ path });
  const uri = `${
    useUsSportsGraphqlFederation ? SOFE_API_ROOT : US_SPORTS_API_ROOT
  }${path}`;

  return useMemo(() => {
    return getUsSportsApolloClient({
      showNotification,
      debugLink,
      tmLink,
      uri,
    });
  }, [showNotification, debugLink, tmLink, uri]);
};

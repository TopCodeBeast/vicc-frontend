import { useMemo } from 'react';

import { SOFE_API_PATH, SOFE_API_ROOT } from '@core/config';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { getUsSportsApolloClient } from '@core/lib/usSportsGraphql/client';

import { useDebugLink } from './useDebugLink';
import { useTMLink } from './useTMLink';

export const useUSSportsApolloClient = () => {
  const { showNotification } = useSnackNotificationContext();
  const debugLink = useDebugLink();
  const path = SOFE_API_PATH;
  const tmLink = useTMLink({ path });
  const uri = `${SOFE_API_ROOT}${path}`;

  return useMemo(() => {
    return getUsSportsApolloClient({
      showNotification,
      debugLink,
      tmLink,
      uri,
    });
  }, [showNotification, debugLink, tmLink, uri]);
};

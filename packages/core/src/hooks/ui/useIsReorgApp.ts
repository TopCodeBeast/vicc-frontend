import { useLocation } from 'react-router-dom';

import { MLB_PATH, NBA_PATH } from '@core/constants/routes';
import { useReorgAppContext } from '@core/contexts/reorgApp';

const useIsReorgApp = () => {
  const { isReorgApp } = useReorgAppContext();
  const location = useLocation();
  return (
    isReorgApp &&
    !location.pathname.startsWith(NBA_PATH) &&
    !location.pathname.startsWith(MLB_PATH)
  );
};

export default useIsReorgApp;

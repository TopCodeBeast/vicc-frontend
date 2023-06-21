import { To, useNavigate } from 'react-router-dom';

import getSafePreviousLocation from '@core/lib/navigation/getSafePreviousLocation';

const useSafePreviousNavigate = (
  defaultPreviousLocation: To,
  delta?: number
) => {
  const navigate = useNavigate();

  const safePreviousLocation = getSafePreviousLocation(
    defaultPreviousLocation,
    delta
  );
  return () => {
    // Extra typing needed due to the way navigate is typed
    // both To & number are accepted but not To | number
    navigate(safePreviousLocation as To);
  };
};

export default useSafePreviousNavigate;

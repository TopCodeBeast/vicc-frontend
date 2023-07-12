import { useLocation } from 'react-router-dom';

import usePrevious from './usePrevious';

// This hooks use a shallow comparison between the `location` object.
// Since a new object is created when you navigate between pages.
// location === prevLocation until a navigation happens
export const useLocationChanged = () => {
  const location = useLocation();
  const prevLocation = usePrevious(location);

  return !!(prevLocation && location !== prevLocation);
};

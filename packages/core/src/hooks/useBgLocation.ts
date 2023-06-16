import { useMemo } from 'react';
import { Location, useLocation } from 'react-router-dom';

function useBackgroundLocation(withFallback: true): Location;
function useBackgroundLocation(withFallback?: false): Location | undefined;
function useBackgroundLocation(withFallback?: boolean): Location | undefined {
  const location = useLocation();
  return useMemo(() => {
    const locationState = location.state as { backgroundState?: Location };
    if (locationState?.backgroundState) {
      return locationState?.backgroundState;
    }
    if (withFallback) {
      return location;
    }
    return undefined;
  }, [location, withFallback]);
}

export const useBgLocation = useBackgroundLocation;

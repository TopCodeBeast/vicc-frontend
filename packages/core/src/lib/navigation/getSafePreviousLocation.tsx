import { To } from 'react-router-dom';

import { hasPreviousLocation } from '@core/lib/routing';

const getSafePreviousLocation = (
  defaultPreviousLocation: string | To,
  delta?: number
) => {
  const backDelta = delta || -1;

  if (hasPreviousLocation(backDelta)) {
    return backDelta;
  }
  return defaultPreviousLocation;
};

export default getSafePreviousLocation;

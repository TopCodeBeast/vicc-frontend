import { getTime, isFuture } from 'date-fns';
import { useEffect } from 'react';

import useForceUpdate from './useForceUpdate';

const MAX_TIMEOUT = 2 ** 31 - 1;

export default (endDate: Date | null) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (endDate && isFuture(endDate)) {
      const timer = setTimeout(
        forceUpdate,
        // prevent integer overflow
        // https://developer.mozilla.org/fr/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Valeur_de_d%C3%A9lai_maximale
        Math.min(getTime(endDate) - getTime(new Date()), MAX_TIMEOUT)
      );
      return () => clearTimeout(timer);
    }
    return () => {};
  });
};

import { useEffect } from 'react';
import { useInstantSearch } from 'react-instantsearch-hooks-web';

import { useConfigContext } from '@sorare/core/src/contexts/config';

type Props = {
  interval: number;
};

const InstantSearchRefresh = ({ interval }: Props) => {
  const { algoliaIndexes } = useConfigContext();
  const { refresh, results } = useInstantSearch();
  const needRefresh = results?.index === algoliaIndexes['Ending Soon'];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden && needRefresh) {
        refresh();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [interval, needRefresh, refresh]);
  return null;
};

export default InstantSearchRefresh;

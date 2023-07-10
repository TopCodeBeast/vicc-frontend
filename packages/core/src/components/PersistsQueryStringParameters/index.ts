import { useLayoutEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { keys, storageFactory } from './storage';

export const PersistsQueryStringParameters = () => {
  const [searchParams] = useSearchParams();
  const storage = useRef(storageFactory());

  useLayoutEffect(() => {
    Object.entries(keys).forEach(([qsKey, lskey]) => {
      const value = searchParams.get(qsKey);
      if (value) {
        storage.current.set(lskey, value.toString());
      }
    });
  }, [searchParams]);

  return null;
};

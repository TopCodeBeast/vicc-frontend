import { useState } from 'react';

export const usePreloads = (preloads: (() => Promise<any>)[]) => {
  const [preloadStarted, setPreloadStarted] = useState(false);

  const preloader = () => {
    if (!preloadStarted) {
      preloads.forEach(preload => {
        preload();
      });
      setPreloadStarted(true);
    }
  };

  return preloader;
};

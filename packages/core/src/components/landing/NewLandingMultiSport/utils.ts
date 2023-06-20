import { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

export const useHeroAnimationTimings = () => {
  const [firstBatch, setFirstBatch] = useState(false);
  const [secondBatch, setSecondBatch] = useState(false);

  useEffect(() => {
    const firstBatchDelay = 2500;

    const firstBatchTimer = setTimeout(() => {
      setFirstBatch(true);
    }, firstBatchDelay);

    const onScroll = () => {
      setSecondBatch(true);
      window.removeEventListener('scroll', onScroll);
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      clearTimeout(firstBatchTimer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return { firstBatch, secondBatch };
};

export const messages = defineMessages({
  ScrollDownCTA: {
    id: 'MultiSport.Landing.ScrollDownCTA',
    defaultMessage: 'Check out what sets us apart from other fantasy games.',
  },
});

import { useEffect, useState } from 'react';

const useScrollPosition = (ref: HTMLElement | null) => {
  const [scrollPosition, setScrollPosition] = useState<
    'start' | 'middle' | 'end'
  >('start');

  useEffect(() => {
    const handleScroll = () => {
      if (ref) {
        const { offsetWidth, scrollLeft, scrollWidth } = ref;
        if (scrollLeft === 0) {
          setScrollPosition('start');
          return;
        }
        if ((offsetWidth || 0) + (scrollLeft || 0) >= (scrollWidth || 0)) {
          setScrollPosition('end');
          return;
        }
        setScrollPosition('middle');
      }
    };
    ref?.addEventListener('scroll', handleScroll);
    return () => ref?.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return { scrollPosition };
};

export default useScrollPosition;

import { useEffect } from 'react';
import { useScrollbarWidth } from 'react-use';

function useBodyLock(locked = false) {
  const scrollBarWidth = useScrollbarWidth();

  useEffect(() => {
    if (!locked) {
      return undefined;
    }
    const root = document.body;
    const originalOverflow = root.style.overflow;
    const originalPaddingRight = root.style.paddingRight;
    root.style.overflow = 'hidden';
    if (scrollBarWidth) {
      root.style.paddingRight = `${scrollBarWidth}px`;
    }
    return () => {
      root.style.overflow = originalOverflow;

      if (scrollBarWidth) {
        root.style.paddingRight = originalPaddingRight;
      }
    };
  }, [locked, scrollBarWidth]);
}

export default useBodyLock;

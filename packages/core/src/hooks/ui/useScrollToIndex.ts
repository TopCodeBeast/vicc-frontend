import { useEffect, useState } from 'react';

const useScrollToIndex = (
  indexToScroll: number | undefined = 0,
  ref?: HTMLElement | null
) => {
  const [containerRef, setContainerRef] = useState<
    HTMLElement | null | undefined
  >(ref);

  useEffect(() => {
    if (containerRef) {
      const index = Math.max(
        0,
        Math.min(indexToScroll, containerRef.childNodes.length - 1)
      );
      containerRef.scrollTo({
        left: (containerRef.childNodes[index] as HTMLDivElement)?.offsetLeft,
        behavior: 'smooth',
      });
    }
  }, [indexToScroll, ref, containerRef]);

  if (ref !== containerRef) {
    setContainerRef(ref);
  }

  return { containerRef, setContainerRef };
};

export default useScrollToIndex;

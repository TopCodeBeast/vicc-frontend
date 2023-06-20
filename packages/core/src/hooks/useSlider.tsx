import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

type UseSliderOptions = {
  autoScroll?: boolean;
  threshold?: number;
  onIndexChange?: (index: number) => void;
};

const useSlider = ({
  autoScroll = false,
  threshold = 0.5,
  onIndexChange,
}: UseSliderOptions = {}) => {
  const scroller = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(-1);

  function scrollTo(index: number) {
    const scroll = scroller.current;
    if (!scroll) return;

    const child = scroll.children[index];

    if (child) {
      const offset =
        child.getBoundingClientRect().left -
        scroll.getBoundingClientRect().left;
      scroll.scrollBy({ left: offset, behavior: 'smooth' });
    }
  }

  const handleDotNavigate = useCallback(
    (direction: number) => {
      const scrollNode = scroller.current;
      if (!scrollNode) return;
      const nb = scrollNode.children.length;
      const rawIndex = active + direction;
      const index = rawIndex < 0 ? nb + rawIndex : rawIndex;
      scrollTo(index % nb);
    },
    [active]
  );

  useEffect(() => {
    const scrollNode = scroller.current;
    if (
      typeof IntersectionObserver === 'undefined' ||
      !scrollNode ||
      scrollNode.children.length <= 1
    ) {
      return () => {};
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const { target, isIntersecting } = entry;
          const n = Array.from(scrollNode.children).indexOf(target);
          if (isIntersecting) {
            setActive(n);
            onIndexChange?.(n);
          }
        });
      },
      { root: scrollNode, threshold: [threshold] }
    );
    Array.from(scrollNode.children).forEach(child => {
      observer.observe(child);
    });

    return () => observer.disconnect();
  }, [threshold, onIndexChange]);

  const cbRef = useRef<() => void>(() => {});
  useEffect(() => {
    const scrollNode = scroller.current;
    if (!scrollNode) return;
    cbRef.current = () => {
      if (autoScroll) {
        scrollTo((active + 1) % scrollNode.children.length);
      }
    };
  }, [active, autoScroll]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      cbRef.current();
    }, 10_000);

    return () => clearTimeout(timeout);
  }, [active, autoScroll]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      cbRef.current();
    }, 10_000);

    return () => clearTimeout(timeout);
  }, [active]);

  const handleDotClick = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    const { parentNode } = currentTarget;
    if (!parentNode) {
      return;
    }
    const i = Array.from(parentNode.children).indexOf(currentTarget);

    scrollTo(i);
  };

  return {
    scrollerRef: scroller,
    active,
    handleDotClick,
    handleDotNavigate,
  };
};

export default useSlider;

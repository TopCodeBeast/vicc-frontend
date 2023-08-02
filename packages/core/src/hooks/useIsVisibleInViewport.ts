import { useEffect, useState } from 'react';

const useIsVisibleInViewport = ({
  element,
  options,
}: {
  element?: React.MutableRefObject<HTMLElement | null>;
  options?: IntersectionObserverInit;
}) => {
  const [isVisible, setState] = useState(false);
  const current = element?.current;

  useEffect(() => {
    if (current && typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(([entry]) => {
        setState(entry.isIntersecting);
      }, options);

      observer.observe(current);

      return () => observer.unobserve(current);
    }
    return () => null;
  }, [current, options]);

  return isVisible;
};

export default useIsVisibleInViewport;

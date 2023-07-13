import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import LoadingIndicator, {
  Props as LoadingIndicatorProps,
} from '@core/atoms/loader/LoadingIndicator';

// This will call the fetch function when hasMore is true and the ref that is returned
// intersects with the viewport.
// The InfiniteScrollLoader component should be placed at the bottom of the list that is paginated.
// If custom style is required, use the returned ref value with the custom component at the bottom of
// the list that is paginated.
// The ref should have a height > 0px

const InfiniteScrollButton = styled.button`
  margin: var(--double-unit) auto;
  display: block;
`;

type Props = Pick<LoadingIndicatorProps, 'small' | 'fullHeight' | 'white'>;

export default (
  fetch: () => void,
  hasMore: boolean,
  fetching = false,
  rootMargin = '0px'
) => {
  const [node, setNode] = useState<HTMLElement | null>(null);

  // This ref is used to get a stable reference to our function to
  // avoid infinite loop when rendering our InfiniteScrollLoader
  const fetchRef = useRef(fetch);
  useEffect(() => {
    fetchRef.current = fetch;
  }, [fetch]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !node) {
      // SSR mode, skip this
      return () => {};
    }

    const handleIntersect = (entities: IntersectionObserverEntry[]) => {
      if (!fetching && entities[0].isIntersecting && hasMore) {
        fetchRef.current();
      }
    };
    const newObserver = new IntersectionObserver(handleIntersect, {
      threshold: 0.3,
      rootMargin,
    });
    newObserver.observe(node);
    return () => newObserver.disconnect();
  }, [fetching, hasMore, node, rootMargin]);

  return {
    ref: setNode,
    InfiniteScrollLoader: useCallback(
      ({ small = true, fullHeight = false, white }: Props) =>
        hasMore || fetching ? (
          <InfiniteScrollButton
            ref={setNode}
            onClick={() => !fetching && fetchRef.current()}
          >
            <LoadingIndicator
              small={small}
              fullHeight={fullHeight}
              white={white}
            />
          </InfiniteScrollButton>
        ) : null,
      [hasMore, setNode, fetching]
    ),
  };
};

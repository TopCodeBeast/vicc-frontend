import { useCallback, useEffect, useState } from 'react';

export function useLoadMore<T>(
  data: T[],
  pageSize: number
): [T[], () => void, boolean] {
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [endCursor, setEndCursor] = useState<number>(pageSize);

  useEffect(() => {
    setHasMore((data?.length || 0) - endCursor > 0);
  }, [data, endCursor]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setEndCursor(endCursor + pageSize);
    }
  }, [endCursor, pageSize, setEndCursor, hasMore]);

  return [data.slice(0, endCursor), loadMore, hasMore];
}

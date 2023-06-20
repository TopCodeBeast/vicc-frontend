import qs from 'qs';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useQueryString(
  field: string,
  defaultValue?: string
): string | undefined {
  const location = useLocation();
  return useMemo(
    () =>
      (qs.parse(location.search.slice(1))[field] || defaultValue)?.toString(),
    [field, location.search, defaultValue]
  );
}

export default useQueryString;

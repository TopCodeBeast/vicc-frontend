import { useMemo } from 'react';

export const useMemoArray = <T>(deps: T[]): T[] => {
  const stringifiedDeps = JSON.stringify(deps);
  return useMemo(() => JSON.parse(stringifiedDeps), [stringifiedDeps]) as T[];
};

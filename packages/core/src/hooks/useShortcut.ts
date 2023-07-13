import { DependencyList } from 'react';
import { useKey } from 'react-use';
import { KeyFilter } from 'react-use/lib/useKey';

const safeCallback = (callback: () => void) => {
  return (e: KeyboardEvent) => {
    if (!/input|textarea/i.test(document.activeElement?.tagName || '')) {
      e.preventDefault();
      callback();
    }
  };
};

export const useShortcut = (
  key: KeyFilter,
  callback: () => void,
  deps?: DependencyList
) => {
  useKey(key, safeCallback(callback), undefined, deps);
};

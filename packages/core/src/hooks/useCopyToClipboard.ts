import { useCallback } from 'react';

export default () => {
  return useCallback((textToCopy: any, callback = () => {}) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    callback();
  }, []);
};

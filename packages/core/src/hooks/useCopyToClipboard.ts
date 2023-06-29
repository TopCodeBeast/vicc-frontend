import { useCallback } from 'react';

export default () => {
  return useCallback((textToCopy, callback = () => {}) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    callback();
  }, []);
};

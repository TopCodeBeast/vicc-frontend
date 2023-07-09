import { useCallback, useState } from 'react';

export default () => {
  const [, set] = useState(true);
  return useCallback(() => set(oldValue => !oldValue), []); // toggle the state to force render
};

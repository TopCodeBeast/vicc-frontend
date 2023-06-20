import { ReactNode, useCallback, useState } from 'react';

import TMContextProvider, { Operation } from '.';

interface Props {
  children: ReactNode;
}

const TMProvider = ({ children }: Props) => {
  const [, setOperations] = useState<Operation[]>([]);

  const logOperation = useCallback(
    (operation: Operation) => {
      setOperations(v => [...v, operation]);
    },
    [setOperations]
  );

  const flushOperations = useCallback(() => {
    let res: Operation[] = [];
    setOperations(v => {
      res = v;
      return [];
    });
    return [...res];
  }, [setOperations]);

  return (
    <TMContextProvider
      value={{
        logOperation,
        flushOperations,
      }}
    >
      {children}
    </TMContextProvider>
  );
};

export default TMProvider;

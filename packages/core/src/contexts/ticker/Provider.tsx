import { ReactNode, useEffect, useState } from 'react';

import TickerContextProvider from '.';

interface Props {
  children: ReactNode;
}

const TickerProvider = ({ children }: Props) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TickerContextProvider
      value={{
        now,
      }}
    >
      {children}
    </TickerContextProvider>
  );
};

export default TickerProvider;

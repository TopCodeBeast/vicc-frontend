import { ReactNode } from 'react';

import TrackingContextProvider from '.';

interface Props {
  children: ReactNode;
  subPath: string;
}

const TrackingProvider = ({ children, subPath }: Props) => {
  return (
    <TrackingContextProvider value={{ subPath }}>
      {children}
    </TrackingContextProvider>
  );
};

export default TrackingProvider;

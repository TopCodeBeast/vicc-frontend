import { ReactNode } from 'react';

import Provider from '.';

interface Props {
  children: ReactNode;
  isReorgApp: boolean;
}

const ReorgAppProvider = ({ isReorgApp, children }: Props) => {
  return <Provider value={{ isReorgApp }}>{children}</Provider>;
};

export default ReorgAppProvider;

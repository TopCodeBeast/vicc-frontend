import { ReactNode, useState } from 'react';

import { MessagingContext, MessagingProvider } from '@sorare/wallet-shared';

import { WALLET_URL } from '../../config';
import Wallet from './Wallet';

interface Props {
  children: ReactNode;
}

const WalletProvider = ({ children }: Props) => {
  const [window, setWindow] = useState<Window | undefined>(undefined);

  return (
    <MessagingProvider
      Context={MessagingContext}
      allowedOrigins={[WALLET_URL]}
      target={{ window, origin: WALLET_URL }}
    >
      <Wallet setWindow={setWindow}>{children}</Wallet>
    </MessagingProvider>
  );
};

export default WalletProvider;

import { useState } from 'react';

import {
  Props as CreatFiatWalletProps,
  CreateFiatWallet,
} from '../CreateFiatWallet';
import {
  InterstitialContextModal,
  Props as InterstitialContextModalProps,
} from '../InterstitialContextModal';

type Props = Omit<InterstitialContextModalProps, 'onAccept'> &
  CreatFiatWalletProps;

export const CreateFiatWalletWithInterstitialModal = ({
  onDecline,
  mode,
  onClose,
  ...createFiatWalletProps
}: Props) => {
  const [showCreateFiatWallet, setShowCreateFiatWallet] = useState(false);

  if (showCreateFiatWallet) {
    return (
      <CreateFiatWallet
        {...createFiatWalletProps}
        onClose={() => {
          setShowCreateFiatWallet(false);
          onClose();
        }}
      />
    );
  }

  return (
    <InterstitialContextModal
      onAccept={() => setShowCreateFiatWallet(true)}
      {...{ onDecline, mode }}
    />
  );
};

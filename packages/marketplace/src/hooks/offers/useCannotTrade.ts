import { defineMessages } from 'react-intl';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useWalletNeedsRecover from '@sorare/core/src/hooks/recovery/useWalletNeedsRecover';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { messages as walletMessages } from '@sorare/core/src/lib/wallet';

const messages = defineMessages({
  unconfirmedDevice: {
    id: 'Offers.cannotTrade.unconfirmedDevice',
    defaultMessage:
      'To start trading, open your wallet and confirm your device',
  },
});

export default () => {
  const { currentUser } = useCurrentUserContext();
  const walletNeedsRecover = useWalletNeedsRecover();
  const {
    flags: { onlyAllowPrivateKeyAccessFromConfirmedDevice = false },
  } = useFeatureFlags();

  return () => {
    if (walletNeedsRecover) {
      return walletMessages.noPrivateKey;
    }
    if (!currentUser) return null;
    if (
      // !currentUser.confirmedDevice && //TODO******
      onlyAllowPrivateKeyAccessFromConfirmedDevice
    ) {
      return messages.unconfirmedDevice;
    }

    return null;
  };
};

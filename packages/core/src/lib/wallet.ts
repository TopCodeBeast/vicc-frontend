import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  noPrivateKey: {
    id: 'WalletDrawer.noPrivateKey',
    defaultMessage:
      "Your wallet is locked. This happens when you reset your password or if you haven't logged in for a long time. You will receive an email with instructions to recover your wallet. For security reasons, it can take up to 24 hours for you to receive this email.",
  },
  unconfirmedDevice: {
    id: 'WalletDrawer.unconfirmedDevice',
    defaultMessage: 'Confirm your device to access your wallet',
  },
});

import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { useWalletContext } from '@sorare/core/src/contexts/wallet';
import { WalletTab, useWalletDrawerContext } from '@sorare/core/src/contexts/walletDrawer';
import { userAttributes } from '@sorare/core/src/lib/glossary';

const messages = defineMessages({
  cta: {
    id: 'Settings.updatePassword.cta',
    defaultMessage: 'Change password',
  },
});

const UpdatePassword = () => {
  const { showWallet, setCurrentTab } = useWalletDrawerContext();

  const { prompt } = useWalletContext();

  return (
    <>
      <Text16>
        <FormattedMessage {...userAttributes.password} />
      </Text16>
      <Text16 bold>- - - -</Text16>
      <div>
        <Button
          onClick={() => {
            prompt('changePassword');
            setCurrentTab(WalletTab.CHANGE_PASSWORD);
            showWallet();
          }}
          color="darkGray"
          small
        >
          <FormattedMessage {...messages.cta} />
        </Button>
      </div>
    </>
  );
};

export default UpdatePassword;

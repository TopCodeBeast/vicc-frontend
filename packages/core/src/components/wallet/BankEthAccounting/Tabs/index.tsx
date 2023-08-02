import Big from 'bignumber.js';
import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { FiatWalletAccountState } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import CreateFiatWallet from '@core/components/fiatWallet/CreateFiatWallet';
import { CreateFiatWalletWithInterstitialModal } from '@core/components/fiatWallet/CreateFiatWalletWithInterstitialModal';
import { InterstitialContextModalMode } from '@core/components/fiatWallet/InterstitialContextModal';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';
import useEvents from '@core/lib/events/useEvents';
import { fiatWallet, wallet } from '@core/lib/glossary';

const Buttons = styled.div`
  display: flex;
  gap: var(--double-unit);
  width: 100%;
  & > * {
    width: 100%;
  }
`;

type Props = {
  cash?: boolean;
};

const messages = defineMessages({
  cashOut: {
    id: 'bankEthAccounting.tabs.withdrawCash',
    defaultMessage: 'Cash out',
  },
  withdraw: {
    id: 'bankEthAccounting.tabs.withdrawTo',
    defaultMessage: 'Withdraw',
  },
});

const Tabs = ({ cash }: Props) => {
  const {
    currentUser,
    walletPreferences: { onlyShowFiatCurrency },
  } = useCurrentUserContext();
  const { canDepositAndWithdraw } = useFiatBalance();

  const [showCreateFiatWallet, setShowCreateFiatWallet] = useState(false);
  const [
    showCreateFiatWalletWithInterstitialModal,
    setShowCreateFiatWalletWithInterstitialModal,
  ] = useState(false);
  const track = useEvents();
  const { setCurrentTab } = useWalletDrawerContext();

  if (!currentUser) return null;

  const { bankBalance, bankMappedEthereumAddress } = currentUser;
  const showWithdrawTab = !(
    new Big(bankBalance).eq(0) || !bankMappedEthereumAddress
  );

  return (
    <>
      <Buttons>
        <Button
          medium
          color="blue"
          onClick={() => {
            if (onlyShowFiatCurrency && !canDepositAndWithdraw) {
              setShowCreateFiatWalletWithInterstitialModal(true);
              return;
            }
            track('[Client] Click Add Funds');
            setCurrentTab(WalletTab.ADD_FUNDS);
          }}
        >
          <FormattedMessage
            {...(cash ? fiatWallet.addCash : wallet.addFunds)}
          />
        </Button>
        {showWithdrawTab && (
          <Button
            medium
            color="darkGray"
            onClick={() => {
              if (onlyShowFiatCurrency && !canDepositAndWithdraw) {
                setShowCreateFiatWallet(true);
                return;
              }
              setCurrentTab(WalletTab.WITHDRAW_WALLET_CONNECT);
            }}
          >
            <FormattedMessage
              id="bankEthAccounting.tabs.withdraw"
              defaultMessage="Withdraw"
            />
          </Button>
        )}
        <Button
          medium
          color="darkGray"
          onClick={() => {
            if (onlyShowFiatCurrency && !canDepositAndWithdraw) {
              setShowCreateFiatWallet(true);
              return;
            }
            setCurrentTab(WalletTab.WITHDRAW_TO);
          }}
        >
          <FormattedMessage
            {...(cash ? messages.cashOut : messages.withdraw)}
          />
        </Button>
      </Buttons>
      {showCreateFiatWalletWithInterstitialModal && (
        <CreateFiatWalletWithInterstitialModal
          onDismissActivationSuccess={() =>
            setShowCreateFiatWalletWithInterstitialModal(false)
          }
          statusTarget={FiatWalletAccountState.VALIDATED_OWNER}
          onClose={() => setShowCreateFiatWalletWithInterstitialModal(false)}
          canDismissAfterActivation
          onDecline={() => setShowCreateFiatWalletWithInterstitialModal(false)}
          mode={InterstitialContextModalMode.DEPOSIT}
        />
      )}
      {showCreateFiatWallet && (
        <CreateFiatWallet
          statusTarget={FiatWalletAccountState.VALIDATED_OWNER}
          canDismissAfterActivation={false}
          onClose={() => setShowCreateFiatWallet(false)}
        />
      )}
    </>
  );
};

export default Tabs;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { FiatWalletAccountState } from '__generated__/globalTypes';
import { Eth } from '@core/atoms/icons/Eth';
import { NeedsValidatedFiatWalletHelper } from '@core/components/fiatWallet/NeedsValidatedFiatWalletHelper';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';
import { getFaCurrencySymbol } from '@core/lib/fiat';

import { NavBlockButton } from '../NavBlockButton';

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Withdraw = () => {
  const {
    walletPreferences: { showEthWallet, showFiatWallet },
  } = useCurrentUserContext();
  const { setCurrentTab } = useWalletDrawerContext();
  const { canDepositAndWithdraw, fiatCurrency: fiatBalanceCurrency } =
    useFiatBalance();

  useEffect(() => {
    if (showEthWallet && !showFiatWallet) {
      setCurrentTab(WalletTab.WITHDRAW_TO_ETH_WALLET);
      return;
    }
    if (!showEthWallet && showFiatWallet) {
      setCurrentTab(WalletTab.WITHDRAW_TO_FIAT_WALLET);
    }
  }, [showEthWallet, showFiatWallet, setCurrentTab]);

  if (
    (showEthWallet && !showFiatWallet) ||
    (!showEthWallet && showFiatWallet)
  ) {
    return null;
  }
  return (
    <Content>
      <NavBlockButton
        icon={
          <FontAwesomeIcon icon={getFaCurrencySymbol(fiatBalanceCurrency)} />
        }
        onClick={() => {
          setCurrentTab(WalletTab.WITHDRAW_TO_FIAT_WALLET);
        }}
        title={
          <FormattedMessage
            id="Withdraw.withdrawCash"
            defaultMessage="Withdraw cash"
          />
        }
        helper={
          <NeedsValidatedFiatWalletHelper
            canListAndTradeHelper={
              <FormattedMessage
                id="Withdraw.helper.canListAndTrade"
                defaultMessage="To withdraw you must verify your identity by adding a government ID."
              />
            }
            defaultHelper={
              <FormattedMessage
                id="Withdraw.helper.default"
                defaultMessage="To withdraw you must activate your Cash Wallet and verify your identity by adding a government ID."
              />
            }
            statusTarget={FiatWalletAccountState.VALIDATED_OWNER}
          />
        }
        withArrow
        disabled={!canDepositAndWithdraw}
      />

      <NavBlockButton
        icon={<Eth />}
        onClick={() => {
          setCurrentTab(WalletTab.WITHDRAW_TO_ETH_WALLET);
        }}
        title={
          <FormattedMessage
            id="Withdraw.withdrawETH"
            defaultMessage="Withdraw ETH"
          />
        }
        withArrow
      />
    </Content>
  );
};

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
import { fiatWallet } from '@core/lib/glossary';

import { NavBlockButton } from '../NavBlockButton';

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AddFunds = () => {
  const {
    walletPreferences: { showEthWallet, showFiatWallet },
  } = useCurrentUserContext();
  const { setCurrentTab } = useWalletDrawerContext();
  const { canDepositAndWithdraw, fiatCurrency: fiatBalanceCurrency } =
    useFiatBalance();

  useEffect(() => {
    if (showEthWallet && !showFiatWallet) {
      setCurrentTab(WalletTab.ADD_FUNDS_TO_ETH_WALLET);
      return;
    }
    if (!showEthWallet && showFiatWallet) {
      setCurrentTab(WalletTab.ADD_FUNDS_TO_FIAT_WALLET);
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
          setCurrentTab(WalletTab.ADD_FUNDS_TO_FIAT_WALLET);
        }}
        title={<FormattedMessage {...fiatWallet.addCash} />}
        helper={
          <NeedsValidatedFiatWalletHelper
            canListAndTradeHelper={
              <FormattedMessage
                id="addFunds.addCash.helper.canListAndTrade"
                defaultMessage="To enable cash deposits, please verify your identity by adding a government-issued ID."
              />
            }
            defaultHelper={
              <FormattedMessage
                id="addFunds.addCash.helper.default"
                defaultMessage="To enable cash deposits, you must activate your Cash Wallet and verify your identity by adding a government ID."
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
          setCurrentTab(WalletTab.ADD_FUNDS_TO_ETH_WALLET);
        }}
        title={
          <FormattedMessage id="addFunds.addETH" defaultMessage="Add ETH" />
        }
        withArrow
      />
    </Content>
  );
};

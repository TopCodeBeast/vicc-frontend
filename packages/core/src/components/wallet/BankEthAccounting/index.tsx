import { ReactNode } from 'react';
import styled from 'styled-components';

import { useCurrentUserContext } from '@core/contexts/currentUser';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';

import { AddFunds } from './AddFunds';
import AddFundsToEthWallet from './AddFundsToEthWallet';
import AddFundsToEthWalletEth from './AddFundsToEthWalletEth';
import AddFundsToEthWalletFiat from './AddFundsToEthWalletFiat';
import AddFundsToFiatWallet from './AddFundsToFiatWallet';
import { Home } from './Home';
import { Settings } from './Settings';
import { Withdraw } from './Withdraw';
import { WithdrawFiat } from './Withdraw/WithdrawFiat';
import WithdrawEthTo from './WithdrawEthTo';
import { WithdrawWalletConnect } from './WithdrawWalletConnect';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

type Props = {
  settingsButton?: ReactNode;
};

export const BankEthAccounting = ({ settingsButton }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { currentTab } = useWalletDrawerContext();
  if (!currentUser) return null;

  return (
    <Content>
      {currentTab === WalletTab.HOME && (
        <Home settingsButton={settingsButton} />
      )}
      {currentTab === WalletTab.SETTINGS && <Settings />}
      {currentTab === WalletTab.ADD_FUNDS && <AddFunds />}
      {[
        WalletTab.ADD_FUNDS_TO_FIAT_WALLET,
        WalletTab.ADD_FUNDS_TO_FIAT_WALLET_REVIEW,
        WalletTab.ADD_FUNDS_TO_FIAT_WALLET_SUCCEEDED,
      ].includes(currentTab) && <AddFundsToFiatWallet />}
      {currentTab === WalletTab.ADD_FUNDS_TO_ETH_WALLET && (
        <AddFundsToEthWallet />
      )}
      {currentTab === WalletTab.ADD_FUNDS_TO_ETH_WALLET_ETH && (
        <AddFundsToEthWalletEth />
      )}
      {currentTab === WalletTab.ADD_FUNDS_TO_ETH_WALLET_FIAT && (
        <AddFundsToEthWalletFiat />
      )}
      {currentTab === WalletTab.WITHDRAW_WALLET_CONNECT && (
        <WithdrawWalletConnect />
      )}
      {currentTab === WalletTab.WITHDRAW_TO && <Withdraw />}
      {currentTab === WalletTab.WITHDRAW_TO_ETH_WALLET && <WithdrawEthTo />}
      {[
        WalletTab.WITHDRAW_TO_FIAT_WALLET,
        WalletTab.WITHDRAW_TO_FIAT_WALLET_REVIEW,
        WalletTab.WITHDRAW_TO_FIAT_WALLET_SUCCESS,
        WalletTab.WITHDRAW_TO_FIAT_WALLET_ADD_BANK_ACCOUNT,
      ].includes(currentTab) && <WithdrawFiat />}
    </Content>
  );
};

export default BankEthAccounting;

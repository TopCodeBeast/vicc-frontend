import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title3 } from '@core/atoms/typography';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import { fromWei } from '@core/lib/wei';

// import EthBalance from '../EthBalance';
// import FiatBalance from '../FiatBalance';
// import AddFunds from './AddFunds';
// import AddFundsEth from './AddFundsEth';
// import AddFundsFiat from './AddFundsFiat';
// import FirstLanding from './FirstLanding';
// import RecentActivity from './RecentActivity';
// import { SecurityWarning } from './SecurityWarning';
// import { Settings } from './Settings';
// import Tabs from './Tabs';
// import WithdrawEth from './WithdrawEth';
// import WithdrawEthTo from './WithdrawEthTo';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Home = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
`;

const HomeTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Balances = styled.div`
  display: flex;
  gap: var(--double-unit);
  > * {
    flex-basis: calc(50% - var(--unit));
    flex-grow: 1;
    flex-shrink: 0;
  }
`;

type Props = {
  settingsButton?: ReactNode;
};

export const BankEthAccounting = ({ settingsButton }: Props) => {
  const {
    currentUser,
    walletPreferences: { showFiatWallet, showEthWallet },
  } = useCurrentUserContext();

  const { currentTab } = useWalletDrawerContext();
  if (!currentUser) return null;
  // const showFirstLanding =
  //   !currentUser.depositedEth &&
  //   fromWei(currentUser.availableBalance) === 0 &&
  //   fromWei(currentUser.bankBalance) === 0 &&
  //   currentUser.pendingDeposits.length === 0;

  return (
    <Content>
      {currentTab === WalletTab.HOME && (
        <Home>
          <HomeTitle>
            <Title3>
              <FormattedMessage
                id="BankEthAccounting.Home.title"
                defaultMessage="My Sorare wallet"
              />
            </Title3>
            {settingsButton}
          </HomeTitle>
          {/* <SecurityWarning />
          <Balances>
            {showFiatWallet && <FiatBalance />}
            {showEthWallet && <EthBalance />}
          </Balances>
          {!showFirstLanding && (
            <>
              <Tabs />
              <RecentActivity />
            </>
          )}
          {showFirstLanding && <FirstLanding />} */}
        </Home>
      )}
      {/* {currentTab === WalletTab.SETTINGS && <Settings />}
      {currentTab === WalletTab.ADD_FUNDS && <AddFunds />}
      {currentTab === WalletTab.ADD_FUNDS_FIAT && <AddFundsFiat />}
      {currentTab === WalletTab.ADD_FUNDS_ETH && <AddFundsEth />}
      {currentTab === WalletTab.WITHDRAW && <WithdrawEth />}
      {currentTab === WalletTab.WITHDRAW_TO && <WithdrawEthTo />} */}
    </Content>
  );
};

export default BankEthAccounting;

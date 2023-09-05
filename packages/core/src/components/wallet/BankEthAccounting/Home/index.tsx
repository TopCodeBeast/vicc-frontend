import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title3 } from '@core/atoms/typography';
import EthBalance from '@core/components/wallet/EthBalance';
import FiatBalance from '@core/components/wallet/FiatBalance';
import { useCurrentUserContext } from '@core/contexts/currentUser';

import { ActivateFiatWallet } from '../ActivateFiatWallet';
import RecentActivity from '../RecentActivity';
import { SecurityWarning } from '../SecurityWarning';
import Tabs from '../Tabs';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
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
  settingsButton: ReactNode;
};

export const Home = ({ settingsButton }: Props) => {
  const {
    walletPreferences: { showFiatWallet, showEthWallet },
  } = useCurrentUserContext();

  return (
    <Root>
      <HomeTitle>
        <Title3>
          <FormattedMessage
            id="BankEthAccounting.Home.title"
            defaultMessage="My Vicc wallet"
          />
        </Title3>
        {settingsButton}
      </HomeTitle>
      <ActivateFiatWallet />
      <SecurityWarning />
      <Block>
        <Balances>
          {showFiatWallet && <FiatBalance />}
          {showEthWallet && <EthBalance />}
        </Balances>
        {showEthWallet && showFiatWallet && <Tabs />}
      </Block>
      <RecentActivity />
    </Root>
  );
};

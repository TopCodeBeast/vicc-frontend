import Big from 'bignumber.js';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useEvents from '@core/lib/events/useEvents';

const Buttons = styled.div`
  display: flex;
  gap: var(--unit);
  & > * {
    width: 100%;
  }
`;

const Tabs = () => {
  const { currentUser } = useCurrentUserContext();

  const track = useEvents();
  const { setCurrentTab } = useWalletDrawerContext();

  if (!currentUser) return null;

  const { bankBalance, bankMappedEthereumAddress } = currentUser;
  const showWithdrawTab = !(
    new Big(bankBalance).eq(0) || !bankMappedEthereumAddress
  );

  return (
    <Buttons>
      <Button
        medium
        color="blue"
        onClick={() => {
          setCurrentTab(WalletTab.ADD_FUNDS);
          track('[Client] Click Add Funds');
        }}
      >
        <FormattedMessage
          id="bankEthAccounting.tabs.addFunds"
          defaultMessage="Add funds"
        />
      </Button>
      {showWithdrawTab && (
        <Button
          medium
          color="darkGray"
          onClick={() => setCurrentTab(WalletTab.WITHDRAW)}
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
        onClick={() => setCurrentTab(WalletTab.WITHDRAW_TO)}
      >
        <FormattedMessage
          id="bankEthAccounting.tabs.withdrawTo"
          defaultMessage="Withdraw"
        />
      </Button>
    </Buttons>
  );
};

export default Tabs;

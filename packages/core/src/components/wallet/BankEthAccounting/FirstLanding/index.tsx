import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { AddFunds } from '@core/atoms/icons/AddFunds';
import { Text16, Title4 } from '@core/atoms/typography';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useEvents from '@core/lib/events/useEvents';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--double-unit) 0;
`;

const AddFundsIcon = styled(AddFunds)`
  width: 96px;
  height: 96px;
  margin: 0 auto;
  color: var(--c-brand-600);
`;

const Center = styled.div`
  text-align: center;
`;

const FirstLanding = () => {
  const track = useEvents();
  const { setCurrentTab } = useWalletDrawerContext();
  return (
    <Container>
      <AddFundsIcon />
      <Center>
        <Title4>
          <FormattedMessage
            id="bankEthAccounting.firstLanding.title"
            defaultMessage="Add funds to your wallet to buy or bid on Cards"
          />
        </Title4>
      </Center>
      <Center>
        <Text16>
          <FormattedMessage
            id="bankEthAccounting.firstLanding.subtitle"
            defaultMessage="For the quickest way to buy or bid on player Cards, you need to add funds to your wallet."
          />
        </Text16>
      </Center>
      <Button
        medium
        color="blue"
        onClick={() => {
          setCurrentTab(WalletTab.ADD_FUNDS);
          track('[Client] Click Add Funds');
        }}
      >
        <FormattedMessage
          id="bankEthAccounting.firstLanding.cta"
          defaultMessage="Add funds"
        />
      </Button>
    </Container>
  );
};
export default FirstLanding;

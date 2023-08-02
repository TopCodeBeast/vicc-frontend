import { faCreditCard } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Eth } from '@core/atoms/icons/Eth';
import Dialog from '@core/atoms/layout/Dialog';
import { Title3 } from '@core/atoms/typography';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useRamp from '@core/hooks/useRamp';
import useToggle from '@core/hooks/useToggle';
import useEvents from '@core/lib/events/useEvents';

import MoonpayForm from '../AddFundsToEthWalletFiat/MoonPayButton/MoonPayForm';
import { NavBlockButton } from '../NavBlockButton';

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  text-align: center;
  border-bottom: 1px solid var(--c-neutral-400);
  padding-bottom: var(--double-unit);
`;

const AddFundsToEthWallet = () => {
  const { available } = useRamp();
  const track = useEvents();
  const { setCurrentTab } = useWalletDrawerContext();
  const [isOpen, toggleMoonpay] = useToggle(false);

  const onClickAddFundsWithOnRamp = () => {
    if (!available) {
      toggleMoonpay();
      return;
    }
    setCurrentTab(WalletTab.ADD_FUNDS_TO_ETH_WALLET_FIAT);

    track('[Client] Choose Funding Method', {
      fundingMethod: 'FIAT',
    });
  };

  const onClickAddFundsWithEth = () => {
    setCurrentTab(WalletTab.ADD_FUNDS_TO_ETH_WALLET_ETH);
    track('[Client] Choose Funding Method', {
      fundingMethod: 'ETH',
    });
  };

  return (
    <Content>
      <Title>
        <Title3>
          <FormattedMessage
            id="NewDepositEth.title"
            defaultMessage="How would you like to add funds?"
          />
        </Title3>
      </Title>
      <NavBlockButton
        onClick={onClickAddFundsWithOnRamp}
        icon={<FontAwesomeIcon icon={faCreditCard} />}
        title={
          <FormattedMessage
            id="NewDepositEth.crediCardBlockTitle"
            defaultMessage="Card or bank transfer"
          />
        }
        description={
          <FormattedMessage
            id="NewDepositEth.creditCardBlockHelper"
            defaultMessage="Card transfers take 5-20 mins.{br}Bank transfers take 2-3 days."
            values={{
              br: <br />,
            }}
          />
        }
        withArrow
      />
      <NavBlockButton
        onClick={onClickAddFundsWithEth}
        icon={<Eth />}
        title={
          <FormattedMessage
            id="NewDepositEth.externalWalletBlockTitle"
            defaultMessage="ETH wallet"
          />
        }
        description={
          <FormattedMessage
            id="NewDepositEth.externalWalletBlockHelper"
            defaultMessage="Wallet transfers take 1-2 mins."
          />
        }
        withArrow
      />
      <Dialog open={isOpen} onClose={toggleMoonpay} hideCloseButton>
        {isOpen && <MoonpayForm />}
      </Dialog>
    </Content>
  );
};

export default AddFundsToEthWallet;

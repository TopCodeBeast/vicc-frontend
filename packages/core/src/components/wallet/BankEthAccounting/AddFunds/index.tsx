import { faCreditCard } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Eth } from '@core/atoms/icons/Eth';
import Dialog from '@core/atoms/layout/Dialog';
import { Text14, Title3, Title5 } from '@core/atoms/typography';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useRamp from '@core/hooks/useRamp';
import useToggle from '@core/hooks/useToggle';
import useEvents from '@core/lib/events/useEvents';

import MoonpayForm from '../AddFundsFiat/MoonPayButton/MoonPayForm';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const BlockText = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;

const Center = styled.div`
  text-align: center;
`;

const StyledText14 = styled(Text14)`
  color: var(--c-neutral-600);
`;

const BlockButton = styled(Button)`
  display: flex;
  padding: var(--double-unit);
  height: auto;
  background-color: var(--c-neutral-200);
  min-width: 338px;
  align-self: center;
  justify-content: flex-start;
  .dark-theme & {
    background-color: var(--c-neutral-400);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  gap: var(--double-unit);
  align-items: flex-start;
  text-align: left;
  white-space: break-spaces;
`;

const Icon = styled.div`
  padding: var(--unit);
  border-radius: 50%;
  width: var(--quadruple-unit);
  height: var(--quadruple-unit);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-neutral-300);
  background: var(--c-neutral-800);
`;

const AddFunds = () => {
  const { available } = useRamp();
  const track = useEvents();
  const { setCurrentTab } = useWalletDrawerContext();
  const [isOpen, toggleMoonpay] = useToggle(false);

  const onClickAddFundsWithOnRamp = () => {
    if (!available) {
      toggleMoonpay();
      return;
    }
    setCurrentTab(WalletTab.ADD_FUNDS_FIAT);

    track('[Client] Choose Funding Method', {
      fundingMethod: 'FIAT',
    });
  };

  const onClickAddFundsWithEth = () => {
    setCurrentTab(WalletTab.ADD_FUNDS_ETH);
    track('[Client] Choose Funding Method', {
      fundingMethod: 'ETH',
    });
  };

  return (
    <Content>
      <Center>
        <Title3>
          <FormattedMessage
            id="NewDepositEth.title"
            defaultMessage="How would you like to add funds?"
          />
        </Title3>
      </Center>
      <BlockButton color="gray" onClick={onClickAddFundsWithOnRamp}>
        <ButtonContent>
          <Icon>
            <FontAwesomeIcon icon={faCreditCard} />
          </Icon>
          <BlockText>
            <Title5>
              <FormattedMessage
                id="NewDepositEth.crediCardBlockTitle"
                defaultMessage="Card or bank transfer"
              />
            </Title5>
            <StyledText14>
              <FormattedMessage
                id="NewDepositEth.creditCardBlockHelper"
                defaultMessage="Card transfers take 5-20 mins.{br}Bank transfers take 2-3 days."
                values={{
                  br: <br />,
                }}
              />
            </StyledText14>
          </BlockText>
        </ButtonContent>
      </BlockButton>
      <BlockButton color="gray" onClick={onClickAddFundsWithEth}>
        <ButtonContent>
          <Icon>
            <Eth />
          </Icon>
          <BlockText>
            <Title5>
              <FormattedMessage
                id="NewDepositEth.externalWalletBlockTitle"
                defaultMessage="ETH wallet"
              />
            </Title5>
            <StyledText14>
              <FormattedMessage
                id="NewDepositEth.externalWalletBlockHelper"
                defaultMessage="Wallet transfers take 1-2 mins."
              />
            </StyledText14>
          </BlockText>
        </ButtonContent>
      </BlockButton>
      <Dialog open={isOpen} onClose={toggleMoonpay} hideCloseButton>
        {isOpen && <MoonpayForm />}
      </Dialog>
    </Content>
  );
};

export default AddFunds;

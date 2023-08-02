import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import apple_pay from '@core/assets/wallet/icon-apple_pay.png';
import g_pay from '@core/assets/wallet/icon-g_pay.png';
import mastercard from '@core/assets/wallet/icon-mastercard.png';
import visa from '@core/assets/wallet/icon-visa.png';
import ButtonsList from '@core/atoms/buttons/ButtonsList';
import { Text16, Title4 } from '@core/atoms/typography';
import useRamp from '@core/hooks/useRamp';

import MoonpayButton from './MoonPayButton';
import RampButton from './RampButton';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const CreditCards = styled.div`
  display: flex;
  gap: var(--half-unit);
  justify-content: center;
`;

const CreditCard = styled.img`
  height: 20px;
  width: auto;
`;

const AddFundsFiat = () => {
  const { available } = useRamp();
  return (
    <Content>
      <Title4>
        <FormattedMessage
          id="NewDepositEth.crediCardTitle"
          defaultMessage="Choose a deposit provider"
        />
      </Title4>
      <Text16>
        <FormattedMessage
          id="NewDepositEth.crediCardContent"
          defaultMessage="With Ramp or Moonpay you can fund your wallet using your preferred method including Apple Pay, Google Pay, bank transfers, and more."
        />
      </Text16>
      <ButtonsList>
        {Button => (
          <>
            {available && <RampButton ButtonComponent={Button} />}
            <MoonpayButton ButtonComponent={Button} />
          </>
        )}
      </ButtonsList>
      <CreditCards>
        <CreditCard alt="Visa" src={visa} />
        <CreditCard alt="Mastercard" src={mastercard} />
        <CreditCard alt="Apple Pay" src={apple_pay} />
        <CreditCard alt="Google Pay" src={g_pay} />
      </CreditCards>
    </Content>
  );
};

export default AddFundsFiat;

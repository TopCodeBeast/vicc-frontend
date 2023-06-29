import { FC } from 'react';
import styled from 'styled-components';

import moonpay from '@core/assets/wallet/icon-moonpay.svg';
import Dialog from '@core/atoms/layout/Dialog';
import { Text16 } from '@core/atoms/typography';
import useToggle from '@core/hooks/useToggle';
import useEvents from '@core/lib/events/useEvents';

import MoonpayForm from './MoonPayForm';

type Props = {
  ButtonComponent: FC<{ onClick?: () => void }>;
};
const Content = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
`;
export const MoonpayButton = ({ ButtonComponent }: Props) => {
  const [isOpen, toggleMoonpay] = useToggle(false);
  const track = useEvents();
  const toggleMoonpayAndTrack = () => {
    toggleMoonpay();
    track('[Client] Start ETH Deposit With Fiat', {
      onRampProvider: 'Moonpay',
    });
  };

  return (
    <>
      <ButtonComponent onClick={toggleMoonpayAndTrack}>
        <img alt="Moonpay" src={moonpay} />
        <Content>
          <Text16>Moonpay</Text16>
        </Content>
      </ButtonComponent>
      <Dialog open={isOpen} onClose={toggleMoonpay} hideCloseButton>
        <MoonpayForm />
      </Dialog>
    </>
  );
};

export default MoonpayButton;

import { FC } from 'react';
import styled from 'styled-components';

import ramp from '@core/assets/wallet/icon-ramp.svg';
import { Text16 } from '@core/atoms/typography';
import useRamp from '@core/hooks/useRamp';
import useEvents from '@core/lib/events/useEvents';

type Props = {
  ButtonComponent: FC<React.PropsWithChildren<{ onClick?: () => void }>>;
};

const Content = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
`;

export const RampButton = ({ ButtonComponent }: Props) => {
  const { show: openRamp } = useRamp();
  const track = useEvents();

  const openRampAndTrack = () => {
    openRamp();
    track('[Client] Start ETH Deposit With Fiat', {
      onRampProvider: 'Ramp',
    });
  };

  return (
    <ButtonComponent onClick={openRampAndTrack}>
      <img alt="Ramp" src={ramp} />
      <Content>
        <Text16>Ramp</Text16>
      </Content>
    </ButtonComponent>
  );
};

export default RampButton;

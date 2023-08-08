import { defineMessages } from 'react-intl';
import styled from 'styled-components';

import { TimeUntilNext } from '@core/atoms/ticker/TimeUntilNext';

const messages = defineMessages({
  timeLeft: {
    id: 'CardDrop.TimeUntilNext.timeLeft',
    defaultMessage: 'Next drop in {timeLeft}',
  },
});

const FullScreenCentered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimeUntilNextStyled = styled(TimeUntilNext)`
  font: var(--t-24);
`;
type Props = {
  next: Date;
};
export const NextDropCountdown = ({ next }: Props) => {
  return (
    <FullScreenCentered>
      <TimeUntilNextStyled timeLeftMessage={messages.timeLeft} next={next} />
    </FullScreenCentered>
  );
};

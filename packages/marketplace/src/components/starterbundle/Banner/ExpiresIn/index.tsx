import { defineMessages } from 'react-intl';
import styled from 'styled-components';

import { TimeUntilNext } from '@sorare/core/src/atoms/ticker/TimeUntilNext';

const messages = defineMessages({
  timeLeft: {
    id: 'StarterBundle.Banner.expiresIn',
    defaultMessage: 'Expires in {timeLeft}',
  },
});

const TimeUntilNextStyled = styled(TimeUntilNext)`
  display: inline-flex;
  text-align: center;
  font: var(--t-12);
`;

type Props = {
  date: Date;
};
export const ExpiresIn = ({ date: expiresIn }: Props) => {
  return (
    <TimeUntilNextStyled timeLeftMessage={messages.timeLeft} next={expiresIn} />
  );
};

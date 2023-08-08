import { MessageDescriptor, useIntl } from 'react-intl';
import styled from 'styled-components';

import { useTimeLeft } from '@core/hooks/useTimeLeft';

const Wrapper = styled.div`
  display: flex;
  gap: var(--half-unit);
  align-items: baseline;
  flex-wrap: wrap;
`;

type Props = {
  timeLeftMessage: MessageDescriptor;
  next: Date;
  className?: string;
  variables?: Record<string, any>;
};
export const TimeUntilNext = ({
  timeLeftMessage,
  next,
  className,
  variables = {},
}: Props) => {
  const { formatMessage } = useIntl();

  const { message } = useTimeLeft(next);

  return (
    <Wrapper className={className}>
      {formatMessage(timeLeftMessage, {
        ...variables,
        timeLeft: message,
      })}
    </Wrapper>
  );
};

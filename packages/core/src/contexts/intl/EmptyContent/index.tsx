import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';

interface Props {
  message: MessageDescriptor;
}
const GreyStripes = styled.div`
  color: var(--c-neutral-600);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background: repeating-linear-gradient(
    -45deg,
    var(--c-neutral-100),
    var(--c-neutral-100) 1px,
    var(--c-neutral-400) 1px,
    var(--c-neutral-400) 2px
  );
  border-radius: var(--unit);
`;

export const EmptyContent = (props: Props) => {
  const { message } = props;

  return (
    <GreyStripes>
      <Text16>
        <FormattedMessage {...message} />
      </Text16>
    </GreyStripes>
  );
};

export default EmptyContent;

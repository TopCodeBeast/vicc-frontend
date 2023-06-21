import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';
import { theme } from '@core/style/theme';

interface Props {
  message: MessageDescriptor;
}
const GreyStripes = styled.div`
  color: var(--c-neutral-600);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background: ${theme.backgrounds.veryDenseStroke};
  border-radius: ${theme.shape.borderRadius}px;
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

import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import Button, { Color } from '@core/atoms/buttons/Button';

const ButtonsBar = styled.div`
  display: flex;
  gap: var(--double-unit);
  flex-wrap: wrap;
`;

const PhoneNumberVerificationButton = ({
  message,
  onClick,
  color = 'darkGray',
}: {
  message: MessageDescriptor;
  onClick: () => void;
  color?: Color;
}) => {
  return (
    <ButtonsBar>
      <Button small onClick={onClick} color={color}>
        <FormattedMessage {...message} />
      </Button>
    </ButtonsBar>
  );
};

export default PhoneNumberVerificationButton;

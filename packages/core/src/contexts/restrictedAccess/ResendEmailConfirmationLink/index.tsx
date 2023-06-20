import { ButtonBaseProps } from '@material-ui/core';
import styled from 'styled-components';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';

const StyledButton = styled(ButtonBase)`
  display: block;
  font-size: inherit;
  color: var(--c-brand-600);
`;

const createResendEmailConfirmationButton = (buttonProps: ButtonBaseProps) => {
  return function Link(...chunks: string[]) {
    return (
      <StyledButton type="button" {...buttonProps}>
        {chunks}
      </StyledButton>
    );
  };
};

export default createResendEmailConfirmationButton;

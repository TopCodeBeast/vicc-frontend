import classnames from 'classnames';
import { FC } from 'react';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';

const ButtonWrapper = styled.div`
  transition: all 300ms ease-out;
  overflow: hidden;
  max-height: 0;
  &.enter {
    margin-top: var(--double-unit);
    max-height: 40px;
  }
`;

export const ConfirmButton: FC<{
  onClick?: () => void;
  lineupComplete: boolean;
}> = ({ onClick, children, lineupComplete }) => {
  return (
    <ButtonWrapper className={classnames({ enter: lineupComplete })}>
      <Button
        medium
        fullWidth
        disabled={!onClick}
        onClick={onClick}
        color="blue"
      >
        {children}
      </Button>
    </ButtonWrapper>
  );
};

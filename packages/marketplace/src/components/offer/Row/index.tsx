import classnames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';

type Props = {
  classes?: Record<string, never>;
  title?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  borderless?: boolean;
  disabled?: boolean;
};

const Root = styled(ButtonBase)`
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex-direction: row;
  padding: 10px 0px;
  align-items: center;
  &.Mui-disabled {
    opacity: 0.5;
  }
  &:not(:first-child) {
    border-top: 1px solid var(--c-neutral-400);
  }
  &.borderless {
    border-top: none;
    padding: 4px 6px;
  }
  width: 100%;
`;

export const Row = ({
  title,
  children,
  onClick,
  borderless = false,
  disabled,
}: Props) => {
  const renderRow = () => (
    <>
      {title}
      {children}
    </>
  );

  if (onClick) {
    return (
      <Root
        className={classnames({ borderless })}
        onClick={onClick}
        disabled={disabled}
      >
        {renderRow()}
      </Root>
    );
  }

  return (
    <Root className={classnames({ borderless })} as="div">
      {renderRow()}
    </Root>
  );
};

export default Row;

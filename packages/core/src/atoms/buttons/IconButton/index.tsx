import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { forwardRef } from 'react';
import styled, { css } from 'styled-components';

import Button, { Props as ButtonProps } from '../Button';

export interface Props
  extends Omit<ButtonProps, 'compact' | 'medium' | 'small'> {
  icon?: IconProp;
  shadow?: boolean;
  small?: boolean;
}

const Root = styled(Button)<{ medium: boolean }>`
  padding: 0;
  min-width: unset;

  ${({ medium }) =>
    medium &&
    css`
      width: 40px;
      height: 40px;
    `}
  &[aria-disabled='true'] {
    opacity: 0.5;
    pointer-events: none;
  }
  &.small {
    min-width: unset;
    width: var(--quadruple-unit);
    height: var(--quadruple-unit);
  }

  &.shadow {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  }
`;
const Label = styled.span<{ medium: boolean }>`
  font-size: 18px;
  ${({ medium }) =>
    medium &&
    css`
      font-size: 16px;
    `}

  line-height: 12px;
`;

export const IconButton = forwardRef<HTMLElement, Props>(function IconButton(
  props,
  ref
) {
  const { children, icon, small, shadow = false, className, ...rest } = props;
  const medium = true;

  return (
    <Root
      ref={ref}
      {...rest}
      medium={medium}
      className={classnames({ small, shadow }, className)}
    >
      <Label medium={medium}>
        {icon ? <FontAwesomeIcon icon={icon} /> : children}
      </Label>
    </Root>
  );
});

export default IconButton;

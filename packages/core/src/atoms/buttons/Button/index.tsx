import { Button as MuiButton } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button/Button';
import classnames from 'classnames';
import { forwardRef } from 'react';
import styled from 'styled-components';

import useClickHandler from '@core/hooks/useClickHandler';

export const colors = [
  'blue',
  'gray',
  'mediumGray',
  'darkGray',
  'green',
  'white',
  'red',
  'opa',
  'transparent',
  'black',
  'dark',
] as const;

export type Color = (typeof colors)[number];

export interface Props
  extends Omit<
    ButtonProps,
    | 'variant'
    | 'color'
    | 'classes'
    | 'size'
    | 'disableRipple'
    | 'disableFocusRipple'
    | 'disableTouchRipple'
  > {
  stroke?: boolean;
  small?: boolean;
  medium?: boolean;
  compact?: boolean;
  color?: Color;
  component?: any;
  to?: string;
  disableDebounce?: boolean;
  externalLink?: boolean;
  state?: { [key: string]: any };
}

const StyledButton = styled(MuiButton)`
  height: 60px;
  padding: 0px 20px;
  box-shadow: none;
  color: var(--c-neutral-100);
  border: none;
  background-color: var(--variantColor);
  border-radius: 2em !important;
  .MuiButton-label {
    letter-spacing: 0;
    white-space: nowrap;
    font-family: var(--sorareFont);
    font-weight: var(---t-bold);
    font-style: normal;
    & > * + * {
      margin-left: 5px;
    }
  }

  &:hover {
    text-decoration: none;
    color: var(--c-neutral-100);
    box-shadow: none;
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))
      var(--variantColor);
  }
  &:focus {
    color: var(--c-neutral-100);
  }
  &:disabled {
    color: var(--c-neutral-100);
    opacity: 0.5;
    &:hover {
      background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))
        var(--variantColor);
    }
  }
  &.stroke {
    color: var(--variantColor);
    background: none;
    border: 1px solid var(--variantColor);
    &:hover {
      color: var(--c-neutral-100);
      background: var(--variantColor);
    }
  }
  &.compact {
    border-radius: 4px;
    padding: 0px 10px;
    height: 18px;
    & .MuiButton-label {
      font-size: 12px;
      line-height: 18px;
    }
  }
  &.small {
    padding: 0 var(--double-unit);
    height: var(--quadruple-unit);
    & .MuiButton-label {
      font-size: 14px;
      line-height: 18px;
    }
  }
  &.medium {
    height: 40px;
    min-width: 40px;
    /* max padding before going higher than 40 if there is only 1char */
    padding: 0px 12px;
  }
  &.blue {
    --variantColor: var(--c-brand-600);
    .dark-theme & {
      &:not(.stroke) {
        color: var(--c-static-neutral-100);
      }
    }
  }
  &.gray {
    --variantColor: var(--c-neutral-200);
    color: var(--c-neutral-800);
  }
  &.darkGray {
    --variantColor: var(--c-neutral-400);
    color: var(--c-neutral-800);
  }
  &.black {
    --variantColor: var(--c-neutral-1000);
    &:hover {
      background: rgba(var(--c-rgb-neutral-1000), 0.85);
    }
  }
  &.mediumGray {
    color: var(--c-neutral-1000);
    --variantColor: var(--c-neutral-200);
    border: 2px solid var(--c-neutral-400);
    &.stroke {
      background: var(--variantColor);
      &:hover {
        background: var(--c-neutral-600);
        border: 2px solid var(--c-neutral-600);
      }
    }
  }
  &.green {
    --variantColor: var(--c-green-600);
  }
  &.white {
    --variantColor: var(--c-neutral-100);
    color: var(--c-neutral-1000);
    border: 1px solid var(--c-neutral-300);
    &:disabled {
      background: var(--c-neutral-300);
      color: var(--c-neutral-600);
      border: unset;
    }
    &:hover {
      background: var(--c-neutral-200);
    }
    &.stroke {
      color: var(--c-neutral-100);
      &:hover {
        color: var(--c-neutral-1000);
      }
    }
    .dark-theme & {
      background: var(--c-neutral-200);
      border: 2px solid var(--c-neutral-400);
      &:disabled {
        background: var(--c-neutral-300);
        color: var(--c-neutral-600);
        border: unset;
      }
      &.active,
      &:hover,
      &:focus {
        background: var(--c-neutral-300);
      }
    }
  }
  &.red {
    --variantColor: var(--c-red-600);
    &:not(.stroke) {
      color: var(--c-static-neutral-100);
    }
  }
  &.opa {
    color: var(--c-static-neutral-100);
    background: rgba(0, 0, 0, 0.1);
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
  &.dark {
    color: var(--c-neutral-100);
    background: var(--c-neutral-900);
  }
  &.transparent {
    color: inherit;
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
`;

export const Button = forwardRef<HTMLElement, Props>((props, ref) => {
  const {
    children,
    small,
    medium,
    compact,
    color,
    onClick,
    to,
    disableDebounce = false,
    stroke = false,
    externalLink = false,
    className,
    ...rest
  } = props;

  const clickHandler = useClickHandler(onClick, disableDebounce);

  return (
    <StyledButton
      innerRef={ref}
      onClick={clickHandler}
      {...(externalLink
        ? ({ target: '_blank', rel: 'noopener noreferrer' } as any)
        : {})}
      to={to}
      disableRipple
      disableFocusRipple
      disableTouchRipple
      {...rest}
      classes={{
        root: classnames(color, className, {
          small,
          medium,
          compact,
          stroke,
        }),
      }}
    >
      {children}
    </StyledButton>
  );
});

Button.displayName = 'Button';

export default Button;

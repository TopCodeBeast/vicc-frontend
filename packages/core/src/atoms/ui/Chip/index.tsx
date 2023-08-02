import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { LinkBox, LinkOther, LinkOverlay } from '@core/atoms/navigation/Box';
import { createVar } from '@core/style/utils';

const colorOpacities = [
  0.1, 0.15, 0.2, 0.3,
]; /** background, backgroundHover, action, actionHover */
const customBackground = createVar();
const customColor = createVar();

const pseudoElementBaseStyle = css`
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
  background-color: currentColor;
  border-radius: inherit;
  content: '';
`;
const ActionWrapper = styled(LinkOther)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: var(--unit);
  border-radius: 2em;
  font-size: 100%;
  line-height: 1;
  font-weight: normal;
  &:not(.transparent)::before {
    ${pseudoElementBaseStyle}
    opacity: ${colorOpacities[0]};
  }
  a&,
  button& {
    &:hover::before {
      opacity: ${colorOpacities[2]};
    }
    &:focus-visible {
      outline: 1px solid currentColor;
    }
  }
`;

const Root = styled(LinkBox)`
  display: inline-flex;
  isolation: isolate;
  gap: var(--unit);
  align-items: center;
  justify-content: center;
  padding: var(--unit) var(--double-unit);
  min-height: calc(var(--unit) * 5);
  min-width: calc(var(--unit) * 5);
  border-radius: var(--quadruple-unit);
  white-space: nowrap;
  color: var(--c-neutral-1000);
  font: var(--t-bold) var(--t-16);
  &:not(.disableBefore) {
    &::before {
      ${pseudoElementBaseStyle}
      opacity: ${colorOpacities[0]};
    }
    &::after {
      ${pseudoElementBaseStyle};
      z-index: -1;
      color: var(--c-neutral-100);
    }
  }
  &.disableBefore {
    &.hoverable:hover,
    &:focus-within {
      filter: brightness(90%) contrast(110%);
    }
  }
  ${ActionWrapper} {
    margin-right: calc(var(--unit) * -1);
  }
  & a,
  & button {
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
  }
  &.hoverable:hover::before,
  &:focus-within::before {
    opacity: ${colorOpacities[1]};
  }
  &.small,
  &.smaller {
    gap: var(--half-unit);
    ${ActionWrapper} {
      margin-right: calc(var(--half-unit) * -1);
    }
  }
  &.small {
    padding: var(--half-unit) var(--unit);
    min-height: var(--quadruple-unit);
    min-width: var(--quadruple-unit);
  }
  &.smaller {
    padding: 0 var(--unit);
    min-height: var(--triple-unit);
    min-width: var(--triple-unit);
    font: var(--t-bold) var(--t-14);
    ${ActionWrapper} {
      min-width: 18px;
      height: 18px;
    }
  }
  &.outlined {
    box-shadow: inset 0px 0px 0px 1px currentColor; /** inner border */
    background: var(--c-neutral-100);
    &::before,
    &::after {
      display: none;
    }
    &.hoverable:hover::before,
    &:focus-within::before {
      opacity: 0.05;
      display: block;
    }
  }
  &.red {
    color: var(--c-static-red-300);
  }
  &.green {
    color: var(--c-green-600);
  }
  &.gray {
    color: var(--c-neutral-600);
  }
  &.yellow {
    background: var(--c-yellow-600);
    color: var(--c-neutral-1000);
  }
  &.middleGrey {
    background: var(--c-neutral-600);
    color: var(--c-neutral-100);
  }
  &.black {
    color: var(--c-neutral-100);
    &:not(.outlined) {
      background: var(--c-neutral-1000);
    }
    &.outlined {
      color: var(--c-neutral-1000);
    }
  }
  &.custom {
    color: var(${customColor});
    &:not(.outlined) {
      background: var(${customBackground});
    }
    &.outlined {
      color: var(${customBackground});
    }
  }
`;
type LabelProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;
const Label = <T extends ElementType = 'div'>({
  as = 'div' as T,
  className,
  children,
  ...props
}: LabelProps<T>): React.JSX.Element => {
  return (
    <LinkOverlay as={as as any} {...props}>
      {children}
    </LinkOverlay>
  );
};

function getAsProp(
  props: { onClick?: () => void; href?: string },
  as?: ElementType
): ElementType {
  if (props.onClick) {
    return 'button';
  }
  if (props.href) {
    return 'a';
  }
  if (as) {
    return as;
  }
  return 'div';
}
type ActionProps<T extends ElementType> = {
  as?: T;
  icon?: IconProp;
  transparent?: boolean;
  children?: ReactNode;
} & ComponentPropsWithoutRef<T>;
const Action = <T extends ElementType = 'button'>({
  as,
  icon,
  transparent,
  children,
  ...props
}: ActionProps<T>): React.JSX.Element => {
  return (
    <ActionWrapper
      as={getAsProp(props, as)}
      className={classnames({ transparent })}
      {...props}
    >
      {icon && <FontAwesomeIcon icon={icon} size="xs" />}
      {children}
    </ActionWrapper>
  );
};

type Props = {
  label: ((props: typeof Label) => React.JSX.Element | null) | ReactNode;
  action?: (props: typeof Action) => ReactNode | null;
  iconLeft?: (props: typeof FontAwesomeIcon) => ReactNode | null;
  color?: 'red' | 'middleGrey' | 'gray' | 'black' | 'green' | 'yellow';
  custom?: { color?: string; background?: string };
  size?: 'small' | 'smaller';
  outlined?: boolean;
};
export const Chip = ({
  label,
  action,
  iconLeft,
  color,
  size,
  outlined,
  custom,
}: Props) => {
  const isRenderProp = typeof label === 'function';
  const computedLabel = isRenderProp && label(Label);
  const { onClick, href, to } =
    (typeof computedLabel !== 'boolean' && computedLabel?.props) || {};

  return (
    <Root
      className={classnames(color, { custom }, size, {
        outlined,
        hoverable: onClick || href || to,
        disableBefore: (color && !/red|green/.test(color)) || custom,
      })}
      style={{
        [customColor]: custom?.color,
        [customBackground]: custom?.background,
      }}
    >
      {iconLeft?.(FontAwesomeIcon)}
      {computedLabel || (!isRenderProp && <Label as="div">{label}</Label>)}
      {action?.(Action)}
    </Root>
  );
};

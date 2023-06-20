import classnames from 'classnames';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import BlockHeader from '@sorare/core/src/atoms/layout/BlockHeader';
import { theme } from '@sorare/core/src/style/theme';

type BlockProps = {
  id?: string;
  children?: ReactNode;
  title?: string | ReactNode;
  compact?: boolean;
  inline?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  to?: string;
  colored?: boolean;
  noCollapse?: boolean;
  border?: 'around' | 'between' | 'none' | 'around-block';
  variant?: 'round' | 'square';
  noPadding?: boolean;
  disableDebounce?: boolean;
  withHover?: boolean;
  className?: string;
};

const Root = styled.div`
  flex-grow: 1;
  padding: 20px;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    padding: var(--intermediate-unit);
  }
  background: var(--c-neutral-300);
  a&:hover,
  &.withHover:hover {
    background: var(--c-neutral-200);
    color: initial;
  }
  &.round {
    border-top-left-radius: var(--double-unit);
    border-top-right-radius: var(--double-unit);
  }
  &:not(.noCollapse) + &:not(.noCollapse) {
    border-top: none;
  }
  &.round:not(.noCollapse) + &.round:not(.noCollapse) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  &.round:last-of-type {
    border-bottom-left-radius: var(--double-unit);
    border-bottom-right-radius: var(--double-unit);
  }
  &.colored {
    background: var(--c-neutral-200);
  }
  &.colored:nth-of-type(2n) {
    background: var(--c-neutral-100);
  }
  &.compact {
    padding: 10px 20px;
  }
  &.inline {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &.disabled {
    color: var(--c-neutral-600);
  }
  &.border-none {
    border: none;
  }
  &.border-between {
    border: none;
    &:not(.noCollapse) + &:not(.noCollapse) {
      border-top: 1px solid var(--c-neutral-300);
    }
  }
  &.border-around-block {
    &:not(.noCollapse):not(:last-child) {
      border-bottom: none;
    }
  }
  &.noCollapse.round {
    border-radius: 8px;
  }
  &.noPadding {
    padding: 0;
  }
`;

const Block = (props: BlockProps) => {
  const {
    id,
    children,
    title,
    compact,
    inline,
    disabled,
    onClick,
    to,
    colored = false,
    noCollapse = false,
    border = 'around',
    variant = 'round',
    noPadding = false,
    disableDebounce = false,
    withHover = false,
    className: propClassName,
  } = props;

  const className = classnames(
    propClassName,
    `border-${border}`,
    {
      compact,
      inline,
      disabled,
      colored,
      noCollapse,
      noPadding,
      withHover,
    },
    variant
  );

  const renderContent = () => {
    if (onClick) {
      return (
        <Root
          as={ButtonBase}
          className={className}
          onClick={onClick}
          disabled={disabled}
          disableDebounce={disableDebounce}
        >
          {children}
        </Root>
      );
    }
    if (to) {
      return (
        <Root as={Link} to={to} className={className}>
          {children}
        </Root>
      );
    }
    return (
      <Root id={id} className={className}>
        {children}
      </Root>
    );
  };

  return (
    <>
      {title && <BlockHeader title={title} />}
      {renderContent()}
    </>
  );
};

export default Block;

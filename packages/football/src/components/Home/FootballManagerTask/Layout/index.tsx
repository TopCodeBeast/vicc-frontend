import classNames from 'classnames';
import { ComponentProps } from 'react';
import styled from 'styled-components';

import { LinkBox } from '@sorare/core/src/atoms/navigation/Box';

import { FootballManagerTaskProps } from '@football/components/home/FootballManagerTask/types';

const Wrapper = styled(LinkBox)`
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);
  padding: var(--unit) var(--double-unit) var(--unit) var(--unit);
  background: var(--c-neutral-200);
  & > img {
    width: var(--quadruple-unit);
  }
  text-align: left;
  &:hover,
  &:focus-within {
    &:not(.disabled) {
      background: var(--c-neutral-300);
    }
  }
`;

export const Layout = ({
  img,
  message,
  cta,
  disabled,
}: ComponentProps<NonNullable<FootballManagerTaskProps['Layout']>>) => {
  return (
    <Wrapper className={classNames({ disabled })}>
      {img}
      {message}
      {cta}
    </Wrapper>
  );
};

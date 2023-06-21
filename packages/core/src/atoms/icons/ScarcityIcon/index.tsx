import classNames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import { Rarity, So5LeaderboardRarity } from '@core/__generated__/globalTypes';

import { User } from '../User';

type ScarcityType =
  | Lowercase<keyof typeof So5LeaderboardRarity>
  | keyof typeof Rarity;

interface Props {
  scarcity: ScarcityType;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Icon = styled.span`
  display: inline-flex;
  border-radius: 2px;
  align-items: center;
  justify-content: center;
  color: var(--c-static-neutral-100);
  width: 1.5em;
  height: 2em;
  &.common {
    background: var(--c-gradient-common);
    color: var(--c-static-neutral-1000);
  }
  &.custom_series {
    background: var(--c-gradient-customSeries);
  }
  &.limited {
    background: var(--c-gradient-limited);
  }
  &.mix {
    background: var(--c-gradient-mix);
  }
  &.rare {
    background: var(--c-gradient-rare);
  }
  &.rare_pro {
    background: var(--c-gradient-rare);
  }
  &.super_rare {
    background: var(--c-gradient-superRare);
  }
  &.unique {
    background: var(--c-gradient-unique);
  }
  &.sm {
    font-size: 7px;
  }
  &.md {
    font-size: 10px;
  }
  &.lg {
    font-size: 14px;
  }
`;

export const ScarcityIcon = ({
  scarcity,
  size = 'sm',
  children = <User />,
}: Props) => {
  return (
    <Icon aria-label={scarcity} className={classNames(scarcity, size)}>
      {children}
    </Icon>
  );
};

export default ScarcityIcon;

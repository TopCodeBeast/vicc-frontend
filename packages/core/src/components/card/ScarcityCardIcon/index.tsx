import styled, { css } from 'styled-components';

import { Rarity } from '@core/__generated__/globalTypes';
import { User } from '@core/atoms/icons/User';

type Props = {
  scarcity: Rarity;
  border?: boolean;
  width?: number | string;
  height?: number | string;
  children?: boolean;
};

const backgroundColors: {
  [key in Rarity]: string;
} = {
  limited: 'var(--c-gradient-limited)',
  rare: 'var(--c-gradient-rare)',
  super_rare: 'var(--c-gradient-superRare)',
  unique: 'var(--c-gradient-unique)',
  common: '',
  custom_series: '',
};

const Root = styled.div<{
  scarcity: Rarity;
  border?: boolean;
  width?: number | string;
  height?: number | string;
}>`
  width: ${({ width }) => width || '17px'};
  height: ${({ height }) => height || '21px'};
  border-radius: 3px;
  color: var(--c-neutral-100);
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ border }) =>
    border &&
    css`
      border: 1px solid var(--c-neutral-100);
    `};

  background: ${({ scarcity }) => backgroundColors[scarcity]};
`;

export const ScarcityCardIcon = ({ children, ...props }: Props) => {
  return (
    <Root {...props}>
      {children}
      {!children && <User width="12px" />}
    </Root>
  );
};
export default ScarcityCardIcon;

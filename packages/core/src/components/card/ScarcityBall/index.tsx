import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import common from 'assets/balls/common.svg';
import custom_series from 'assets/balls/custom_series.svg';
import limited from 'assets/balls/limited.svg';
import mix from 'assets/balls/mix.png';
import rare from 'assets/balls/rare.svg';
import super_rare from 'assets/balls/super_rare.svg';
import unique from 'assets/balls/unique.svg';
import { scarcityMessages } from '@sorare/core/src/lib/scarcity';

export const supportedScarcities = [
  'common',
  'mix',
  'custom_series',
  'limited',
  'rare',
  'super_rare',
  'unique',
] as const;

export type ScarcityType = (typeof supportedScarcities)[number];
type Props = {
  scarcity: ScarcityType;
  iconOnly?: boolean;
  label?: React.ReactNode;
};

const images: {
  [key in ScarcityType]: string;
} = {
  common,
  limited,
  custom_series,
  mix,
  rare,
  super_rare,
  unique,
};

const Root = styled.span`
  display: flex;
  align-items: center;
`;
const Icon = styled.img`
  margin-right: 10px;
  width: 12px;
  height: 12px;
`;

export const ScarcityBall = ({ scarcity, iconOnly = false, label }: Props) => {
  return (
    <Root>
      <Icon alt={scarcity} src={images[scarcity]} />
      {!iconOnly && !label && (
        <FormattedMessage {...scarcityMessages[scarcity]} />
      )}
      {label}
    </Root>
  );
};

export default ScarcityBall;

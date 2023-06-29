import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import common from '@core/assets/balls/common.svg';
import limited from '@core/assets/balls/limited.svg';
import mix from '@core/assets/balls/mix.png';
import rare from '@core/assets/balls/rare.svg';
import super_rare from '@core/assets/balls/super_rare.svg';
import unique from '@core/assets/balls/unique.svg';
import { scarcityMessages } from '@core/lib/scarcity';

const Root = styled.span`
  display: flex;
  align-items: center;
`;
const Icon = styled.img`
  margin-right: var(--unit);
  width: 12px;
  height: 12px;
`;

type ScarcityType =
  | 'common'
  | 'mix'
  | 'limited'
  | 'rare'
  | 'rare_pro'
  | 'super_rare'
  | 'unique';

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
  mix,
  rare,
  rare_pro: rare,
  super_rare,
  unique,
};

export const ScarcityBallPro = ({
  scarcity,
  iconOnly = false,
  label,
}: Props) => {
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

export default ScarcityBallPro;

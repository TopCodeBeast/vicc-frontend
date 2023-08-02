import { ReactNode } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';

export type Color = 'green' | 'yellow' | 'red';

interface Props {
  message: MessageDescriptor;
  value: number | string;
  icon: ReactNode;
  iconColor?: Color;
}

const Line = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StatName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Logo = styled.div`
  margin-right: var(--unit);
  width: var(--quadruple-unit);
  height: var(--quadruple-unit);
  border-radius: var(--intermediate-unit);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-static-neutral-100);
  &.green {
    background: var(--c-green-600);
  }
  &.yellow {
    background: var(--c-yellow-600);
  }
  &.red {
    background: var(--c-red-600);
  }
`;

const StatNameText = styled(Text14)`
  color: var(--c-neutral-600);
`;
const StatValue = styled(Text14)`
  font-weight: var(--t-bold);
`;

const InfoLineWithLogoAndValue = ({
  message,
  value,
  icon,
  iconColor,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Line>
      <StatName>
        <Logo className={iconColor}>{icon}</Logo>
        <StatNameText>{formatMessage(message)}</StatNameText>
      </StatName>
      <StatValue>{value}</StatValue>
    </Line>
  );
};

export default InfoLineWithLogoAndValue;

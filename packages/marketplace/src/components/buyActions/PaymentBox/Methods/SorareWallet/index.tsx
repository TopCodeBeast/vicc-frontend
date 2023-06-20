import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { Color } from '@sorare/core/src/style/types';

const WalletIcon = styled.div<{ color: Color }>`
  border-radius: var(--half-unit);
  border: 1px solid ${({ color }) => color};
  background-color: ${({ color }) => color};
  padding: var(--half-unit) var(--intermediate-unit);
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(5 * var(--unit));
  font: var(--t-16);
  color: var(--c-neutral-100);
  .dark-theme & {
    color: var(--c-neutral-1000);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);
`;

const Text = styled.div`
  color: var(--c-brand-600);
`;
const Balance = styled.div`
  display: flex;
  gap: var(--unit);
`;

type Props = {
  icon: IconDefinition;
  color: Color;
  label: ReactNode;
  balance: ReactNode;
  withoutBalance?: boolean;
};

export const SorareWallet = ({
  icon,
  label,
  balance,
  withoutBalance,
  color = 'var(--c-brand-600)',
}: Props) => {
  return (
    <Row>
      <WalletIcon color={color}>
        <FontAwesomeIcon size="lg" icon={icon} />
      </WalletIcon>
      <Text>
        <Text16 color="var(--c-neutral-1000)">{label}</Text16>
        {!withoutBalance && <Balance>{balance}</Balance>}
      </Text>
    </Row>
  );
};

export default SorareWallet;

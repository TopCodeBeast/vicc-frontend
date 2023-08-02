import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { RainbowBox } from '@core/atoms/layout/RainbowBox';

const Root = styled(RainbowBox)`
  --inside: linear-gradient(var(--c-neutral-200), var(--c-neutral-200));
  display: inline-flex;
  align-items: center;
  gap: var(--half-unit);
  color: var(--c-neutral-1000);
  font-weight: var(--t-bold);
  border: 2px solid transparent;
  border-radius: var(--double-unit);
  box-sizing: border-box;
  padding: 0 var(--unit);
`;

type Props = {
  children: ReactNode;
  to: string;
};

export const ClubShopButton = ({ children, to }: Props) => {
  return (
    <Root to={to} as={Link}>
      {children}
    </Root>
  );
};

export default ClubShopButton;

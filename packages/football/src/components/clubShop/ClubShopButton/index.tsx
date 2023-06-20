import { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { RainbowBox } from '@sorare/core/src/atoms/layout/RainbowBox';
import { FOOTBALL_CLUB_SHOP } from '@sorare/core/src/constants/routes';

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
const ClubShopButton: FC = ({ children }) => {
  return (
    <Root to={FOOTBALL_CLUB_SHOP} as={Link}>
      {children}
    </Root>
  );
};

export default ClubShopButton;

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { SorareLogo } from '@sorare/core/src/atoms/icons/SorareLogo';
import { LANDING } from '@sorare/core/src/constants/routes';
import { theme } from '@sorare/core/src/style/theme';

import SmallerStarBall from '../SmallerStarBall';

const ResponsiveSorareLogo = styled(SorareLogo)`
  display: none;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    display: block;
  }
`;

const Logo = styled(Link)`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

type Props = {
  withStarball?: boolean;
};

export const HomeLink = ({ withStarball = false }: Props) => {
  return (
    <Logo to={LANDING} aria-label="Sorare">
      {withStarball && <SmallerStarBall />}
      <ResponsiveSorareLogo />
    </Logo>
  );
};

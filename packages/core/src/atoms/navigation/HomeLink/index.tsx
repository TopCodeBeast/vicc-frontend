import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { SorareLogo } from '@core/atoms/icons/SorareLogo';
import { LANDING } from '@core/constants/routes';
import { tabletAndAbove } from '@core/style/mediaQuery';

import SmallerStarBall from '../SmallerStarBall';

const ResponsiveSorareLogo = styled(SorareLogo)`
  display: none;
  @media ${tabletAndAbove} {
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

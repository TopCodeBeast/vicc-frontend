import { ReactNode } from 'react';
import styled from 'styled-components';

import { SorareLogo } from '@core/atoms/icons/SorareLogo';
import StarBall from '@core/atoms/icons/StarBall';
import Container from '@core/atoms/layout/Container';
import { theme } from '@core/style/theme';

import { BuildYourLegacyTitle } from '../BuildYourLegacyTitle';
import PlayNowButton from '../PlayNowButton';

const StyledContainer = styled(Container)`
  padding-top: calc(8 * var(--unit));
  padding-bottom: calc(8 * var(--unit));
`;

const Content = styled.div<{ backgroundImage?: string }>`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  background-size: cover;
  padding: ${({ backgroundImage }) => (backgroundImage ? `164px` : '0')}
    var(--double-unit);
  border-radius: var(--quadruple-unit);
  background-image: ${({ backgroundImage }) =>
    backgroundImage ? `url(${backgroundImage})` : 'none'};
  align-items: center;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding: 164px var(--double-unit);
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 1em;
  margin: 0 var(--unit);
  background-color: var(--c-static-neutral-100);
`;

const Logo = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

interface Props {
  logo: ReactNode;
  to: string;
  bgImage?: string;
  hideSorareLogo?: boolean;
}

const CTABanner = (props: Props) => {
  const { to, bgImage, logo, hideSorareLogo } = props;
  return (
    <StyledContainer>
      <Content backgroundImage={bgImage}>
        <Logo>
          {!hideSorareLogo && (
            <>
              <StarBall />
              <SorareLogo />
              <Divider />
            </>
          )}

          {logo}
        </Logo>
        <BuildYourLegacyTitle />
        <PlayNowButton color="white" to={to} />
      </Content>
    </StyledContainer>
  );
};
export default CTABanner;

import { ReactNode, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import styled from 'styled-components';

import WaypointComponent from '@core/atoms/animations/Waypoint';
import Container from '@core/atoms/layout/Container';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { theme } from '@core/style/theme';

import { BackgroundOverlay } from '../ui';

const Root = styled.div`
  position: relative;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding-top: calc(5 * var(--unit));
  }
`;

const ImgContainer = styled.div``;

const Img = styled.img`
  max-width: 100%;
  min-width: 0;
  height: auto;
`;

const StyledContent = styled(animated.div)`
  color: var(--c-static-neutral-100);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
  position: absolute;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  bottom: 50px;
  padding: 0 var(--double-unit);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    bottom: 0;
    gap: var(--quadruple-unit);
  }
`;

const LogosContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  margin-top: 60px;
`;

export const BuildYourLegacy = ({
  children,
  className,
  backgroundOverlayColor,
  logo,
  playerImg,
}: {
  children?: ReactNode;
  className?: string;
  backgroundOverlayColor: string;
  logo: ReactNode;
  playerImg: string;
}) => {
  const { up: isTablet } = useScreenSize('tablet');
  const [isVisible, setIsVisible] = useState(false);

  const appearFromTop = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(-50%, 0px)' : 'translate(-50%, -60px)',
    delay: 400,
  });

  return (
    <Root className={className}>
      <WaypointComponent onEnter={() => setIsVisible(true)} />
      <ImgContainer>
        {isTablet ? (
          <>
            <Container>
              <Img src={playerImg} width="1400" height="765" />
            </Container>
            <BackgroundOverlay $color={backgroundOverlayColor} />
          </>
        ) : (
          <Img src={playerImg} width="750" height="1000" />
        )}
      </ImgContainer>
      <StyledContent style={appearFromTop}>
        {children}
        {!isTablet && <LogosContainer>{logo}</LogosContainer>}
      </StyledContent>
    </Root>
  );
};

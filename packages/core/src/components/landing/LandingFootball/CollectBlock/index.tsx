import { ReactNode, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useSpring } from 'react-spring';
import styled from 'styled-components';

import WaypointComponent from '@sorare/core/src/atoms/animations/Waypoint';
import Container from '@sorare/core/src/atoms/layout/Container';
import {
  BackgroundOverlay,
  MixedFontTitle,
  Section,
  SubTitle,
  TitlesContainer,
} from 'components/landing/LandingFootball/ui';

import { CardsCarousel } from '../../CollectCards/CardsCarousel';

const messages = defineMessages({
  title: {
    id: 'Landing.CollectBlock.defaultTitle',
    defaultMessage: 'Build your team',
  },
  subtitle: {
    id: 'Landing.CollectBlock.defaultSubtitle',
    defaultMessage:
      'Set your five-man lineup and play in free competitions against global fans. Plus, play against friends in private leagues.',
  },
});

interface Img {
  src: string;
  alt: string;
}

interface Props {
  cards: Img[];
  title?: ReactNode;
  subtitle?: string;
  background?: string;
  backgroundOverlayColor: string;
}

const FullWidthBackground = styled.div`
  width: 100%;
  background-repeat: no-repeat;
  background-position: top;
  background-size: cover;
  position: relative;
  overflow: hidden;
`;

const StyledSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: calc(2 * var(--quadruple-unit));
`;

const CollectBlock = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  const {
    title = <FormattedMessage {...messages.title} />,
    subtitle,
    cards,
    background,
    backgroundOverlayColor,
  } = props;

  const appearFromTop = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(-60px)',
  });
  return (
    <FullWidthBackground
      style={{ backgroundImage: background ? `url(${background})` : 'none' }}
    >
      <BackgroundOverlay $color={backgroundOverlayColor} />
      <Container>
        <WaypointComponent onEnter={() => setIsVisible(true)} />
        <StyledSection>
          <TitlesContainer style={appearFromTop}>
            <MixedFontTitle>{title}</MixedFontTitle>
            {subtitle && <SubTitle>{subtitle}</SubTitle>}
          </TitlesContainer>
          <CardsCarousel cards={cards} />
        </StyledSection>
      </Container>
    </FullWidthBackground>
  );
};

export default CollectBlock;

import { Container } from '@material-ui/core';
import { ReactNode, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { animated, useSpring, useSprings } from 'react-spring';
import styled from 'styled-components';

import Waypoint from '@sorare/core/src/atoms/animations/Waypoint';
import {
  MixedFontTitle,
  SubTitle,
  TitlesContainer,
} from 'components/landing/LandingFootball/ui';
import MidfieldLine from 'components/landing/MidfieldLine';
import { range } from '@sorare/core/src/lib/arrays';
import { theme } from '@sorare/core/src/style/theme';

const messages = defineMessages({
  title: {
    id: 'Landing.ComposeBlock.defaultTitle',
    defaultMessage: 'Play',
  },
  subtitle: {
    id: 'Landing.ComposeBlock.defaultSubtitle',
    defaultMessage:
      'Set your five-man lineup and play in free competitions against global fans.{br}Plus, play against friends in private leagues.',
  },
});

const Background = styled.div`
  width: 100%;
  background-repeat: no-repeat;
  background-position: top;
  background-size: cover;
  position: relative;
  overflow: hidden;
`;

const Img = styled(animated.img).attrs({
  loading: 'lazy',
})`
  aspect-ratio: var(--card-aspect-ratio);
  max-width: 100%;
  min-width: 0;
  width: 100%;
  z-index: 1;
`;

const Pitch = styled.div`
  margin-top: calc(5 * var(--unit));
  text-align: center;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    margin-top: calc(9 * var(--unit));
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

  --starballSize: calc(10 * var(--unit));
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    gap: calc(7 * var(--unit));
    --starballSize: 140px;
  }

  & > * {
    width: calc(33% - 15px);

    @media (min-width: ${theme.breakpoints.values.tablet}px) {
      width: 200px;
    }
  }
`;

const Section = styled(Container)`
  padding-top: 60px;
  padding-bottom: 60px;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding-top: 100px;
    padding-bottom: 100px;
  }
`;

const FirstRow = styled(Row)`
  align-items: center;
  margin-bottom: calc(5 * var(--unit));
`;

const SecondRow = styled(Row)`
  align-items: flex-start;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(5 * var(--unit));
`;
interface Img {
  src: string;
  alt: string;
}

interface Props {
  title?: ReactNode;
  subtitle?: ReactNode;
  cards: [Img, Img, Img, Img, Img];
  background: string;
}

const ComposeBlock = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const {
    title = <FormattedMessage {...messages.title} />,
    subtitle = (
      <FormattedMessage
        {...messages.subtitle}
        values={{
          br: <br />,
        }}
      />
    ),
    background,
    cards,
  } = props;

  const base = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(-100px)',
  };

  const springs = useSprings(
    5,
    range(5).map((t, i) => ({
      ...base,
      delay: 200 * i,
    }))
  );

  const appearFromTop = useSpring({
    opacity: titleVisible ? 1 : 0,
    transform: titleVisible ? 'translateY(0px)' : 'translateY(-60px)',
  });

  return (
    <Background style={{ backgroundImage: `url(${background})` }}>
      <Section>
        <TitlesContainer style={appearFromTop}>
          <MixedFontTitle>{title}</MixedFontTitle>
          {subtitle && <SubTitle>{subtitle}</SubTitle>}
        </TitlesContainer>
        <Waypoint onEnter={() => setTitleVisible(true)} />
        <Pitch>
          <FirstRow>
            <Img src={cards[0].src} style={springs[0]} alt={cards[0].alt} />
            <Img src={cards[1].src} style={springs[1]} alt={cards[1].alt} />
          </FirstRow>
          <Waypoint onEnter={() => setIsVisible(true)} />
          <SecondRow>
            <Img src={cards[2].src} style={springs[2]} alt={cards[2].alt} />
            <Column>
              <MidfieldLine />
              <Img src={cards[3].src} style={springs[4]} alt={cards[3].src} />
            </Column>
            <Img src={cards[4].src} style={springs[3]} alt={cards[4].alt} />
          </SecondRow>
        </Pitch>
      </Section>
    </Background>
  );
};

export default ComposeBlock;

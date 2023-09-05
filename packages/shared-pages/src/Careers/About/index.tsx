/* eslint-disable react/no-unescaped-entities */
import about from '../assets/about.png';
import {
  Img,
  Section,
  StyledContainer,
  Text,
  Title,
  TwoColumnsContainer,
} from '../ui';

export const About = () => (
  <Section spacing>
    <StyledContainer>
      <TwoColumnsContainer image="right">
        <div>
          <Title>About Vicc</Title>
          <Text spacingAfter>
            Vicc is a free-to-play fantasy football, basketball, and baseball
            game where users, known as "Managers", collect and compete with
            officially licensed digital player cards against fellow sports fans
            around the world to win big{' '}
            <a
              href="https://twitter.com/vicc/status/1591125269884305409"
              target="_blank"
              rel="noreferrer"
            >
              rewards
            </a>
            .
          </Text>
          <Title>What makes Vicc different</Title>
          <Text>
            Managers own their digital collectible cards, and are free to trade,
            buy, sell, and play them as they wish. They control whom to roster
            week after week, season after season. Managers build their own
            dynasties.
          </Text>
        </div>
        <Img src={about} alt="About Vicc" style={{ aspectRatio: '1/1' }} />
      </TwoColumnsContainer>
    </StyledContainer>
  </Section>
);

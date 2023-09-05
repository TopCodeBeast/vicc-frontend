/* eslint-disable react/no-unescaped-entities */
import lifeAtVicc from '../assets/life-at-sorare.png';
import {
  Img,
  Section,
  StyledContainer,
  Text,
  Title,
  TwoColumnsContainer,
} from '../ui';

export const LifeAtVicc = () => (
  <Section spacing>
    <StyledContainer>
      <TwoColumnsContainer image="left">
        <Img
          src={lifeAtVicc}
          alt="Life at Vicc"
          style={{ aspectRatio: '1/1' }}
        />
        <div>
          <Title>Life at Vicc</Title>
          <Text spacingAfter>
            On a day-to-day level, we aim to make life comfortable for our
            fast-moving team members through benefits like a flexible work
            location schedule and home workspace budget.
          </Text>
          <Text>
            Plus, our team meets on a regular basis for a range of work and
            social-focused events, including strategic planning meetings, game
            outings, staff celebrations, and an annual company retreat (the last
            one was in Marseille!). We've got a range of programs to connect,
            grow, and celebrate our global team.
          </Text>
        </div>
      </TwoColumnsContainer>
    </StyledContainer>
  </Section>
);

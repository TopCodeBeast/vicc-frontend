import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { tabletAndAbove } from '@core/style/mediaQuery';

import { SectionFullText } from '../SectionFullText';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  justify-content: space-between;
  padding: calc(7 * var(--unit)) calc(3 * var(--unit));
  row-gap: var(--double-unit);
  text-align: center;
  column-gap: calc(10 * var(--unit));

  @media ${tabletAndAbove} {
    flex-direction: column;
    column-gap: calc(7 * var(--unit));
  }
`;

const HeadingWrapper = styled.h2`
  font-weight: 700;
  font-size: 30px;
  line-height: 100%;
  margin: 0;
  color: white;
  margin-bottom: var(--double-unit);
  font-family: Druk Wide, sans-serif;
  @media ${tabletAndAbove} {
    font-size: 60px;
    margin-bottom: var(--quadruple-unit);
  }
`;

const AnimationContainer = styled.div`
  width: 100%;
  max-width: 1680px;
  height: 100%;
  margin: auto;
  z-index: 0;
`;
const Fade = styled.div`
  width: 90%;
  max-width: 1680px;
  height: 100%;
  position: absolute;

  background: linear-gradient(
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0) 40%,
      rgba(0, 0, 0, 0) 90%,
      rgba(0, 0, 0, 1) 100%
    ),
    linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 20%),
    linear-gradient(-90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 20%);
`;

const path = "assets/fields/fallback.jpg";
export const TitleBlock = () => (
  <Wrapper>
    <AnimationContainer>
      <Fade />
    </AnimationContainer>
    <HeadingWrapper data-testid="section-text">COLLECT. PLAY. WIN</HeadingWrapper>
  </Wrapper>
);
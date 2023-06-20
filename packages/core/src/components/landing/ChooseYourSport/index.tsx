import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import dotsPattern from 'assets/dots-pattern.png';
import Container from '@sorare/core/src/atoms/layout/Container';
import { theme } from '@sorare/core/src/style/theme';

import { ChooseYourSportContent } from './Content';

const DottedBackground = styled.div`
  background: url(${dotsPattern}), #181818;
  flex-direction: column;
  align-items: center;
  display: flex;
  padding: 0 0 calc(5 * var(--unit));
`;

const Header = styled.h2`
  ${theme.styledFonts.drukWideSuper}
  font-size: 20px;
  line-height: 24px;
  color: white;
  text-transform: uppercase;
  align-self: flex-start;
  padding: var(--double-and-a-half-unit) 0;
  margin: 0;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 30px;
    line-height: 30px;
    padding: calc(5 * var(--unit)) 0;
  }
`;

export const ChooseYourSport = () => {
  return (
    <DottedBackground>
      <Container>
        <Header>
          <FormattedMessage
            id="ChooseYourOwn.title"
            defaultMessage="Choose your sport"
          />
        </Header>
      </Container>
      <ChooseYourSportContent />
    </DottedBackground>
  );
};

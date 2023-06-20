import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { sportsLabelsMessages } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

import {
  FeaturedSportFootball,
  FeaturedSportMLB,
  FeaturedSportNBA,
} from '../../FeaturedSport';

const FullWidthContainer = styled.div`
  max-width: ${theme.breakpoints.values.desktop}px;
  margin: 0 auto;
`;

const Body = styled.div`
  display: flex;
  justify-content: space-between;
  overflow: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  width: 100vw;
  gap: calc(3 * var(--unit));
  position: relative;
  padding: var(--half-unit) 0;
  &:before,
  &:after {
    content: '';
    display: block;
    width: 1px;
    flex: none;
  }

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    &:before,
    &:after {
      width: 0;
    }
    width: 100%;
    gap: var(--double-unit);
    flex-direction: row;
    align-items: stretch;
  }
`;

const MobileNavigation = styled.nav`
  display: flex;
  gap: var(--unit);
  align-self: flex-start;
  margin: 0 0 var(--double-unit) var(--unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    display: none;
  }
`;

const NavButton = styled(Button).attrs({
  type: 'button',
  small: true,
  stroke: true,
  color: 'white',
})``;

const scrollToElement = (elt: HTMLElement | null) => {
  if (elt?.parentNode) {
    (elt.parentNode as HTMLDivElement).scrollTo({
      left: elt.offsetLeft,
    });
  }
};

export const ChooseYourSportContent = ({
  hideNBA = false,
  hideBaseball = false,
  hideDescription = false,
  hideMobileNavigation = false,
}: {
  hideNBA?: boolean;
  hideBaseball?: boolean;
  hideDescription?: boolean;
  hideMobileNavigation?: boolean;
}) => {
  return (
    <>
      {!hideMobileNavigation ? (
        <MobileNavigation>
          <NavButton
            onClick={() => {
              scrollToElement(document.getElementById('football'));
            }}
          >
            <FormattedMessage {...sportsLabelsMessages.FOOTBALL} />
          </NavButton>
          {!hideNBA ? (
            <NavButton
              onClick={() => {
                scrollToElement(document.getElementById('nba'));
              }}
            >
              <FormattedMessage {...sportsLabelsMessages.NBA} />
            </NavButton>
          ) : null}
          {!hideBaseball ? (
            <NavButton
              onClick={() => {
                scrollToElement(document.getElementById('mlb'));
              }}
            >
              <FormattedMessage {...sportsLabelsMessages.BASEBALL} />
            </NavButton>
          ) : null}
        </MobileNavigation>
      ) : null}
      <FullWidthContainer>
        <Body>
          <FeaturedSportFootball hideDescription={hideDescription} />
          {!hideNBA ? (
            <FeaturedSportNBA hideDescription={hideDescription} />
          ) : null}
          {!hideBaseball ? (
            <FeaturedSportMLB hideDescription={hideDescription} />
          ) : null}
        </Body>
      </FullWidthContainer>
    </>
  );
};

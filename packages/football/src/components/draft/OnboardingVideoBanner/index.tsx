import { faCirclePlay } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import { LinkBox, LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { Title6 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_VIDEOS } from '@sorare/core/src/constants/routes';
import { Link } from '@sorare/core/src/routing/Link';

import thumbnailTutorial from 'assets/home/thumbnail_tutorial.jpg';
import { useFootballEvents } from 'lib/events';

const StyledContainer = styled(Container)`
  background-color: var(--c-brand-800);
  color: var(--c-static-neutral-100);
`;

const ContentWrapper = styled.div`
  padding: var(--double-unit) 0;
  display: flex;
  gap: var(--double-unit);
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: inherit;
  &:hover,
  &:focus {
    color: inherit;
  }
`;

const ThumbNail = styled.div`
  border: 2px solid var(--c-static-neutral-100);
  border-radius: var(--half-unit);
  height: calc(5 * var(--unit));
  aspect-ratio: 16/9;
  background: center / cover url(${thumbnailTutorial}), var(--c-neutral-200);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: var(--double-unit);
  height: var(--double-unit);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* Add a background behind the icon. Slightly smaller dimensions to avoid an ugly halo at the edge */
  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: 50%;
    background-color: var(--c-static-neutral-1000);
  }
`;

const StyledIcon = styled(FontAwesomeIcon)`
  color: var(--c-static-neutral-100);
  width: var(--double-unit);
  position: relative;
`;

export const OnboardingVideoBanner = () => {
  const track = useFootballEvents();

  return (
    <LinkBox as={StyledContainer}>
      <ContentWrapper>
        <ThumbNail>
          <IconWrapper>
            <StyledIcon icon={faCirclePlay} />
          </IconWrapper>
        </ThumbNail>
        <LinkOverlay
          onClick={() => {
            track('Click How To Video');
          }}
          as={StyledLink}
          to={generatePath(FOOTBALL_VIDEOS, {
            slug: 'football-beginner-guide',
          })}
        >
          <Title6 as="span">
            <FormattedMessage
              id="OnboardingVideoBanner.description"
              defaultMessage="Watch Sorare 101 and learn the basics of the game"
            />
          </Title6>
        </LinkOverlay>
      </ContentWrapper>
    </LinkBox>
  );
};

import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { HTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Skeleton } from '@core/atoms/animations/Skeleton';
import IconButton from '@core/atoms/buttons/IconButton';
import { Container } from '@core/atoms/container';
import { Title2 } from '@core/atoms/typography';
import getSafePreviousLocation from '@core/lib/navigation/getSafePreviousLocation';
import { laptopAndAbove } from '@core/style/mediaQuery';

import { CollectionHeaderConfettis } from './CollectionHeaderConfettis';

const Root = styled.div`
  position: relative;
  min-height: calc(21 * var(--unit)); /* 168px */
  color: var(--c-static-neutral-100);
  background-color: var(--c-static-neutral-800);
  background-size: cover;
`;

const Grid = styled.div`
  --logo-height: calc(14 * var(--unit)); /* 112px */
  display: grid;
  grid-template-areas:
    'back right-action'
    'logo logo'
    'name name'
    'stats stats';
  grid-template-columns: 1fr 1fr;
  grid-template-rows: max-content var(--logo-height) max-content max-content;
  gap: var(--intermediate-unit);
  padding: var(--double-unit) var(--unit);
  @media ${laptopAndAbove} {
    grid-template-areas:
      'back logo name right-action'
      '. stats stats stats';
    grid-template-columns: calc(8 * var(--unit)) var(--logo-height) 1fr max-content;
    grid-template-rows: var(--logo-height) max-content;
    gap: var(--double-unit) var(--quadruple-unit);
    padding: var(--triple-unit) 0 var(--double-unit);
  }
`;

const BackButton = styled(IconButton).attrs({
  color: 'mediumGray',
  component: Link,
  small: true,
  'aria-label': 'Back',
})`
  grid-area: back;
`;

const RightActionArea = styled.div`
  grid-area: right-action;
  justify-self: end;
`;

const LogoBackground = styled.div`
  grid-area: logo;
  display: flex;
  justify-self: center;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  width: 100px;
  height: 100px;
  background-color: rgba(var(--c-static-rgb-neutral-100), 0.5);
  backdrop-filter: blur(var(--half-unit));
  border: 1px solid rgba(var(--c-static-rgb-neutral-100), 0.1);
  border-radius: 100%;
  box-shadow: var(--shadow-400);
`;

const NameArea = styled.div`
  grid-area: name;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-self: center;
  @media ${laptopAndAbove} {
    justify-self: start;
    align-items: start;
  }
`;

const StatsArea = styled.div`
  grid-area: stats;
  padding: 0 var(--intermediate-unit);
  @media ${laptopAndAbove} {
    padding-left: 0;
  }
`;

const SkeletonLogo = styled(Skeleton)`
  --skeleton-highlight: rgba(var(--c-static-rgb-neutral-100), 0.1);
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const SkeletonDropdown = styled(Skeleton)`
  --skeleton-highlight: rgba(var(--c-static-rgb-neutral-100), 0.1);
  background-color: rgba(var(--c-rgb-neutral-1000), 0.1);
  width: calc(14 * var(--unit));
  height: var(--triple-unit);
`;

const SkeletonName = styled(Skeleton)`
  --skeleton-highlight: rgba(var(--c-static-rgb-neutral-100), 0.1);
  background-color: rgba(var(--c-rgb-neutral-1000), 0.1);
  width: calc(40 * var(--unit));
  height: var(--quadruple-unit);
  margin: var(--half-unit);
  @media ${laptopAndAbove} {
    height: calc(5 * var(--unit));
  }
`;

type Props = {
  isComplete: boolean;
  backRoute: string;
  name: string;
  collectionLogo: ReactNode;
  seasonDropdown?: ReactNode;
  rightAction?: ReactNode;
  stats?: ReactNode;
  loading?: boolean;
  noConfetti?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const CollectionHeader = ({
  backRoute,
  name,
  collectionLogo,
  seasonDropdown,
  rightAction,
  stats,
  isComplete,
  noConfetti = false,
  loading,
  className,
  ...props
}: Props) => {
  const safePreviousLocation = getSafePreviousLocation(backRoute);
  return (
    <Root className={classNames(className, 'dark-theme')} {...props}>
      {isComplete && !noConfetti && <CollectionHeaderConfettis />}
      <Container>
        <Grid>
          <BackButton
            // typings in react-router-dom is wrong. number is allowed as well
            // https://github.com/remix-run/react-router/pull/10133
            to={safePreviousLocation as string}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
          </BackButton>
          <RightActionArea>{rightAction}</RightActionArea>
          <LogoBackground>
            {loading ? <SkeletonLogo /> : <div>{collectionLogo}</div>}
          </LogoBackground>
          <NameArea>
            {seasonDropdown && (
              <>{loading ? <SkeletonDropdown /> : seasonDropdown}</>
            )}
            {loading ? <SkeletonName /> : <Title2 bold>{name}</Title2>}
          </NameArea>
          <StatsArea>{stats}</StatsArea>
        </Grid>
      </Container>
    </Root>
  );
};

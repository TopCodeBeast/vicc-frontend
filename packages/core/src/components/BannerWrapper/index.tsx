import { ReactElement } from 'react-markdown/lib/react-markdown';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import { SorareLogo } from '@sorare/core/src/atoms/icons/SorareLogo';
import StarBall from '@sorare/core/src/atoms/icons/StarBall';

import TheNextEraIsYours from './assets/theNextEraIsYours';
import WhereDynastyNeverDies from './assets/whereDynastyNeverDies';
import YourLegacyStartsNow from './assets/yourLegacyStartsNow';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  overflow: hidden;
`;

const BannerContainer = styled.div<{ dark?: boolean }>`
  --banner-item-width: var(--banner-item-width-override, 508px);
  --banner-item-height: var(--banner-item-height-override, 42px);

  width: 100%;
  height: var(--banner-item-height);
  overflow: hidden;
  display: flex;
  background: ${props =>
    props.dark
      ? 'var(--c-static-neutral-100)'
      : 'var(--c-static-neutral-1000)'};
  color: ${props =>
    props.dark
      ? 'var(--c-static-neutral-1000)'
      : 'var(--c-static-neutral-100)'};
  padding: var(--half-unit) 0;
  flex-wrap: nowrap;

  .left-to-right {
    animation: left-to-right 10s infinite linear;
    @keyframes left-to-right {
      0% {
        transform: translateX(calc(-1 * var(--banner-item-width)));
      }
      100% {
        transform: translateX(0%);
      }
    }
  }
  .right-to-left {
    animation: right-to-left 10s infinite linear;
    @keyframes right-to-left {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(calc(-1 * var(--banner-item-width)));
      }
    }
  }
`;

const BannerContentItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--triple-unit);
  flex: 0 0 var(--banner-item-width);
  padding: 0 var(--double-unit);
  overflow-y: hidden;
`;

const BannerContent = styled.div`
  width: 100%;
  flex: 0 0 100%;
  display: flex;
  align-items: center;
`;

const BannerHalfContent = ({ sport }: { sport: Sport }) => {
  return (
    <BannerContentItem>
      <LogoContainer>
        <StarBall color="currentColor" />
        <SorareLogo variant="currentColor" />
      </LogoContainer>
      {sport === Sport.FOOTBALL && <YourLegacyStartsNow />}
      {sport === Sport.BASEBALL && <TheNextEraIsYours />}
      {sport === Sport.NBA && <WhereDynastyNeverDies />}
    </BannerContentItem>
  );
};

export const Banner = ({
  animation,
  className,
  sport,
  dark,
}: {
  animation?: 'left-to-right' | 'right-to-left';
  className?: string;
  sport: Sport;
  dark?: boolean;
}) => {
  return (
    <BannerContainer dark={dark} className={className}>
      <BannerContent className={animation}>
        {[...Array(10).keys()].map(key => (
          <BannerHalfContent sport={sport} key={key} />
        ))}
      </BannerContent>
    </BannerContainer>
  );
};

export const SkinnyBanner = styled(Banner)`
  --banner-item-width-override: 330px;
  --banner-item-height-override: 32px;
`;

const BannerWrapper = ({
  children,
  dark,
  sport,
}: {
  dark?: boolean;
  children: ReactElement;
  sport: Sport;
}) => {
  return (
    <>
      <Banner animation="left-to-right" dark={dark} sport={sport} />
      {children}
      <Banner animation="right-to-left" dark={dark} sport={sport} />
    </>
  );
};

export default BannerWrapper;

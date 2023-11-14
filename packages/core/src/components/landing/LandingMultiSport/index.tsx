import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import useFontFaceObserver from '@sorare/use-font-face-observer';
import { Container } from '@core/atoms/layout/Container';
import Bold from '@core/atoms/typography/Bold';
import { useDefaultSportPages } from '@core/constants/routes';
import { useConfigContext } from '@core/contexts/config';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useReferrer from '@core/contexts/queryString/useReferrer';
import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';
import { Lifecycle } from '@core/hooks/useLifecycle';
import useEvents from '@core/lib/events/useEvents';
import MultiSportAppBar from '@core/routing/MultiSportAppBar';
import MultiSportFooter from '@core/routing/MultiSportFooter';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { ChooseYourSport } from '../ChooseYourSport';
import { CollectBlock } from '../CollectCards/CollectBlock';
import { CollectTitle } from '../CollectCards/CollectTitle';
import { ComposeBlock } from '../CollectCards/ComposeBlock';
import { WinBlock } from '../CollectCards/WinBlock';
import { SquadBlock } from '../CollectCards/SquadBlock';
import { FanBlock } from '../CollectCards/FanBlock';
import { WinEpicBlock } from '../CollectCards/WinEpicBlock';
import { OwnYourGame } from '../OwnYourGame';
import { TrustedBy } from '../TrustedBy';

import '@core/style/drukFontFaces.css';
import { PartnersBlock } from '../CollectCards/PartnersBlock';
import SportsFooter from '@sorare/core/src/routing/SportsFooter';
import { TitleBlock } from '../CollectCards/TitleBlock';

const DarkBackground = styled.div`
  background-color: black;
  overflow: hidden;
`;

const GreyBackground = styled.div`
  // background: var(--c-static-neutral-200);
  background: black;
`;

const WhiteBackground = styled.div`
  background: var(--c-static-neutral-100);
`;

const Spaced = styled.div`
  display: flex;
  flex-direction: column;

  @media ${tabletAndAbove} {
    gap: calc(5 * var(--unit));
  }
`;

const FullPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: min(100%, 100vh);
`;


const Background = styled.div`
  position: relative;
  width: 100%;
  background: black;
`;

const AnimationContainer = styled.div`
  width: 100%;
  max-width: 1680px;
  height: 100%;
  margin: auto;
  z-index: 0;
`;
const Fade = styled.div`
  width: 100%;
  max-width: 1680px;
  height: 100%;
  position: absolute;

  background: linear-gradient(
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0) 100%,
      rgba(0, 0, 0, 0) 90%,
      rgba(0, 0, 0, 1) 100%
    ),
    linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 20%),
    linear-gradient(-90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 20%);
`;

const Image = styled.img`
  width: 100%;
  max-width: 1680px;
  height: 100%;
  position: absolute;
  isolation: isolate;
`;

const path = "assets/fields/fallback.jpg";

const LandingMultiSport = () => {
  const { currentUser } = useCurrentUserContext();
  const { landingTheme } = useConfigContext();
  const fontStatus = useFontFaceObserver(
    [{ family: 'DrukWide-Super', weight: 'bold' }],
    { timeout: 1000 }
  );
  const { referrer, invalidReferrer, removeReferrer } = useReferrer();
  const { showNotification } = useSnackNotificationContext();
  const track = useEvents();
  const location = useLocation();

  const lastVisitedSport = (currentUser?.userSettings?.lifecycle as Lifecycle)
    ?.lastVisitedSport;
  const defaultSportPages = useDefaultSportPages();
  useEffect(() => {
    if (invalidReferrer) {
      showNotification(
        'unknownReferrer',
        { referrer, strong: Bold },
        {
          level: Level.ERROR,
          autoHideDuration: null,
          onClosed: removeReferrer,
        }
      );
    }
  }, [showNotification, invalidReferrer, referrer, removeReferrer]);

  useEffect(() => {
    if (!currentUser) {
      track('View Homepage Disconnected');
    }
  }, [currentUser, track]);

  if (lastVisitedSport) {
    return (
      <Navigate
        to={`${defaultSportPages[lastVisitedSport]}${location.search}`}
        replace
        state={location.state}
      />
    );
  }
  if (fontStatus === 'initial') return null; // allow rendering without the right font after the timeout
  return (
    <>
      <DarkBackground>
        {currentUser ? (
          <MultiSportAppBar color="transparent" />
        ) : (
          <OwnYourGame />
        )}
        {/* {(currentUser || !landingTheme?.sport) && <ChooseYourSport />} */}
      </DarkBackground>

      <GreyBackground>
        <Container>
          <Spaced>
            {/* <CollectTitle /> */}
            <FullPage>
              <TitleBlock />
            </FullPage>
            <FullPage>
              <SquadBlock />
            </FullPage>
            <FullPage>
              <FanBlock />
            </FullPage>
            <FullPage>
              <WinEpicBlock />
            </FullPage>
          </Spaced>
        </Container>
      </GreyBackground>
            
      <Background>
        <AnimationContainer>
          <Image src={path} alt="" />
          <Fade />
        </AnimationContainer>
        <PartnersBlock/>
        <SportsFooter />
      </Background>
    </>
  );
};

export default LandingMultiSport;

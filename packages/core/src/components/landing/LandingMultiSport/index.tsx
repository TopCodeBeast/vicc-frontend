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
import { theme } from '@core/style/theme';

import { ChooseYourSport } from '../ChooseYourSport';
import { CollectBlock } from '../CollectCards/CollectBlock';
import { CollectTitle } from '../CollectCards/CollectTitle';
import { ComposeBlock } from '../CollectCards/ComposeBlock';
import { WinBlock } from '../CollectCards/WinBlock';
import { OwnYourGame } from '../OwnYourGame';
import { TrustedBy } from '../TrustedBy';

import 'style/drukFontFaces.css';

const DarkBackground = styled.div`
  background-color: black;
  overflow: hidden;
`;

const GreyBackground = styled.div`
  background: var(--c-static-neutral-200);
`;

const WhiteBackground = styled.div`
  background: var(--c-static-neutral-100);
`;

const Spaced = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    gap: calc(5 * var(--unit));
  }
`;

const FullPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: min(100%, 100vh);
`;

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
        {(currentUser || !landingTheme?.sport) && <ChooseYourSport />}
      </DarkBackground>

      <GreyBackground>
        <Container>
          <Spaced>
            <CollectTitle />
            <FullPage>
              <CollectBlock />
            </FullPage>
            <FullPage>
              <ComposeBlock />
            </FullPage>
            <FullPage>
              <WinBlock />
            </FullPage>
          </Spaced>
        </Container>
      </GreyBackground>
      <WhiteBackground>
        <Container>
          <TrustedBy />
        </Container>
      </WhiteBackground>
      <MultiSportFooter />
    </>
  );
};

export default LandingMultiSport;

import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import useFontFaceObserver from '@sorare/use-font-face-observer';
import { Container } from '@core/atoms/container';
import Bold from '@core/atoms/typography/Bold';
import { LeaguesBlock } from '@core/components/landing/LeaguesBlock';
import { useDefaultSportPages } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useReferrer from '@core/contexts/queryString/useReferrer';
import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';
import { Lifecycle } from '@core/hooks/useLifecycle';
import useEvents from '@core/lib/events/useEvents';
import LoggedInAppBar from '@core/routing/MultiSportAppBar/LoggedInAppBar';
import NewLoggedOutAppBar from '@core/routing/MultiSportAppBar/NewLoggedOutAppBar';
import AppBarProvider from '@core/routing/MultiSportAppBar/context/Provider';
import MultiSportFooter from '@core/routing/MultiSportFooter';

import '@core/style/drukFontFaces.css';

import { NewOtherSports } from '../NewOtherSports';
import { Community } from './Community';
import { Experience } from './Experience';
import { Hero } from './Hero';
import { Prizes } from './Prizes';
import { ContentContainer } from './ui';

const DarkBackground = styled.div`
  overflow: hidden;
  position: relative;
  background-color: black;
  color: var(--c-static-neutral-100);
`;

const OtherSportsWrapper = styled(ContentContainer)`
  margin-bottom: calc(var(--unit) * 10);
`;

export const NewLandingMultiSport = () => {
  const { currentUser } = useCurrentUserContext();
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
    <DarkBackground>
      <AppBarProvider>
        {currentUser ? (
          <Container>
            <LoggedInAppBar />
          </Container>
        ) : (
          <NewLoggedOutAppBar />
        )}
      </AppBarProvider>
      <Hero />
      <LeaguesBlock />
      <Experience />
      <Prizes />
      <Community />
      <OtherSportsWrapper>
        <NewOtherSports />
      </OtherSportsWrapper>
      <MultiSportFooter />
    </DarkBackground>
  );
};

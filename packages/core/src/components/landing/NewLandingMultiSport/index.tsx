import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import useFontFaceObserver from '@sorare/use-font-face-observer';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { useDefaultSportPages } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useReferrer from '@sorare/core/src/contexts/queryString/useReferrer';
import { Level, useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { Lifecycle } from '@sorare/core/src/hooks/useLifecycle';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import NewLoggedOutAppBar from '@sorare/core/src/routing/MultiSportAppBar/NewLoggedOutAppBar';
import MultiSportFooter from '@sorare/core/src/routing/MultiSportFooter';

import 'style/drukFontFaces.css';

import { NewOtherSports } from '../NewOtherSports';
import { CommunityBlock } from './CommunityBlock';
import { ExperienceBlock } from './ExperienceBlock';
import { Hero } from './Hero';
import { LeaguesBlock } from './LeaguesBlock';
import { PrizesBlock } from './PrizesBlock';
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
      <NewLoggedOutAppBar />
      <Hero />
      <LeaguesBlock />
      <ExperienceBlock />
      <PrizesBlock />
      <CommunityBlock />
      <OtherSportsWrapper>
        <NewOtherSports />
      </OtherSportsWrapper>
      <MultiSportFooter />
    </DarkBackground>
  );
};

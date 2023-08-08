import { ReactNode, useEffect } from 'react';
import { useIntl } from 'react-intl';

import Bold from '@core/atoms/typography/Bold';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useHighLightContext } from '@core/contexts/highlight';
import { useBgLocation } from '@core/hooks/useBgLocation';
import useLifecycle, { Lifecycle } from '@core/hooks/useLifecycle';

import {
  messages as newSigningsMessages,
  steps as newSigningsSteps,
} from './newSignings';
import {
  messages as transferMarketMessages,
  steps as transferMarketSteps,
} from './transferMarket';
import { Tour } from './types';

const tourSteps: { [key in Tour]: readonly string[] } = {
  transferMarket: transferMarketSteps,
  newSignings: newSigningsSteps,
};

const messages: { [key in Tour]: any } = {
  transferMarket: transferMarketMessages,
  newSignings: newSigningsMessages,
};

export const tourStepName = (tour: Tour, stepName: string) =>
  `tour-${tour}-${stepName}`;

export const tourStepMessage = (tour: Tour, stepName: string) =>
  messages[tour][stepName];

export type HighlightTour = {
  name: string | null;
  message?: ReactNode;
  inModal?: boolean;
};

function useTour(tour: Tour, stepName: string): HighlightTour {
  const { currentUser } = useCurrentUserContext();
  const bgLocation = useBgLocation();
  const { highlight, highlighted, prevHighlighted } = useHighLightContext();
  const { update: saveStep } = useLifecycle();
  const { formatMessage } = useIntl();

  const message = formatMessage(tourStepMessage(tour, stepName), {
    b: Bold,
  });

  const stepNames = tourSteps[tour];
  const stepIndex = stepNames.indexOf(stepName);
  const name = tourStepName(tour, stepName);

  const display =
    currentUser &&
    prevHighlighted !== name &&
    ((stepIndex === 0 &&
      !(currentUser.userSettings.lifecycle as Lifecycle)?.[tour]) ||
      (currentUser.userSettings.lifecycle as Lifecycle)?.[tour] ===
        stepNames[stepIndex - 1]);

  useEffect(() => {
    if (display && highlighted !== name) {
      const callback = () => {
        saveStep(tour, stepName);
      };

      highlight(name, { message, callback });
    }
  }, [
    display,
    highlight,
    highlighted,
    message,
    name,
    saveStep,
    stepName,
    tour,
  ]);

  if (!display) return { name: null };

  return {
    name,
    message,
    inModal: !!bgLocation,
  };
}

export default useTour;

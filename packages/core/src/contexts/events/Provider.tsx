/* eslint-disable no-console */
import { ReactNode } from 'react';

import { isForcedEnv, isProduction } from '@core/config';

import EventsContextProvider from '.';

interface Props {
  children: ReactNode;
}

declare global {
  interface Window {
    analytics: {
      identify: (userId: string, traits?: { [trait: string]: any }) => void;
      track: (
        eventName: string,
        properties?: { [property: string]: any }
      ) => void;
      reset: () => void;
      user: () => {
        id: () => string;
        traits: (traits?: any) => any;
      };
      // From https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#page
      // > "if you pass only one string to page it is assumed to be name"
      page: (pageName: string | undefined) => void;
      addSourceMiddleware: () => void;
      load: () => void;
    };
  }
}

export const ETH_DEPOSITED_TRAIT = 'eth_deposited';
export const ETH_WITHDRAWN_TRAIT = 'eth_withdrawn';
const ETH_TRANSFERRED_TRAIT = 'eth_transferred';

// By default segment analytics.js caches the user traits and sends them
// with each identify call. As some of amplitude traits have special
// properties like increment (trait is incremented by the sent value
// on each identify call).
const TRAITS_TO_RESET = [
  ETH_DEPOSITED_TRAIT,
  ETH_WITHDRAWN_TRAIT,
  ETH_TRANSFERRED_TRAIT,
];

const resetUserTraits = () => {
  if (!window.analytics) return;

  const { user } = window.analytics;
  if (user) {
    const traits = user().traits();
    TRAITS_TO_RESET.forEach(t => delete traits[t]);
    user().traits(traits);
  }
};

interface IdentifyArgs {
  userId?: string;
  traits?: { [trait: string]: any };
}

const identify = ({ userId, traits }: IdentifyArgs): void => {
  if (!window.analytics) return;

  const { user } = window.analytics;
  if (!userId && !user) {
    console.warn('Unable to identify without a userId');
    return;
  }

  const uuid = userId || user().id();

  window.analytics.identify(uuid, traits);
  if ((!isProduction || isForcedEnv()) && process.env.NODE_ENV !== 'test') {
    console.log('🪲 Analytics User Identified: ', uuid, traits);
  }

  resetUserTraits();
};

const track = (
  event: string,
  properties?: { [propery: string]: any }
): void => {
  if (window.analytics) {
    window.analytics.track(event, properties);
  }
  if ((!isProduction || isForcedEnv()) && process.env.NODE_ENV !== 'test') {
    console.log('🪲 Analytics Event Tracked: "%s"', event, properties);
  }
};

export const EventsProvider = ({ children }: Props) => {
  return (
    <EventsContextProvider
      value={{
        identify: (id: string, traits?: { [trait: string]: any }) =>
          identify({ userId: id, traits }),
        track,
      }}
    >
      {children}
    </EventsContextProvider>
  );
};

export default EventsProvider;

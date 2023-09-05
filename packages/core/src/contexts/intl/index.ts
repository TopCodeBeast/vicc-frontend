import { StripeElementLocale } from '@stripe/stripe-js';
import { createContext, useContext } from 'react';
import { FormatNumberOptions, IntlShape } from 'react-intl';

import { RoundingMode } from '@core/lib/wei';

export type DisplayOptions = {
  hideSymbol?: boolean;
};

export type FormatWeiArgs = FormatNumberOptions;

export interface IntlContext extends IntlShape {
  formatEth: (
    value: string | number,
    options?: FormatNumberOptions,
    displayOptions?: DisplayOptions
  ) => string;
  formatWei: (
    value: string,
    roundingMode?: RoundingMode,
    options?: FormatNumberOptions,
    displayOptions?: DisplayOptions
  ) => string;
  formatCardBonus: (value: number) => string;
  formatFixtureDate: (vicc5Fixture: {
    startDate: ISO8601DateTime;
    endDate: ISO8601DateTime;
  }) => string;
  formatDistanceToNow: (date: Date, options?: { addSuffix: boolean }) => string;
  formatDistanceToNowStrict: (
    date: Date,
    options?: { addSuffix: boolean }
  ) => string;
  setLocale: (newLocale: string) => void;
  dir: 'rtl' | 'ltr';
}

const SUPPORTED_LOCALES = [
  'en-US',
  'en-GB',
  'de-DE',
  'es-ES',
  'fr-FR',
  'it-IT',
  'ru-RU',
  'tr-TR',
  'ar',
] as const;

export type LOCALE_KEY = (typeof SUPPORTED_LOCALES)[number];

export const localeConfig: {
  [index in LOCALE_KEY]: {
    date: () => Promise<any>;
    dir: 'rtl' | 'ltr';
    name: string;
  };
} = {
  'en-US': {
    date: async () => import('date-fns/locale/en-US'),
    dir: 'ltr',
    name: 'English (US)',
  },
  'en-GB': {
    date: async () => import('date-fns/locale/en-GB'),
    dir: 'ltr',
    name: 'English (UK)',
  },
  'de-DE': {
    date: async () => import('date-fns/locale/de'),
    dir: 'ltr',
    name: 'Deutsch',
  },
  'es-ES': {
    date: async () => import('date-fns/locale/es'),
    dir: 'ltr',
    name: 'Español',
  },
  'fr-FR': {
    date: async () => import('date-fns/locale/fr'),
    dir: 'ltr',
    name: 'Français',
  },
  'it-IT': {
    date: async () => import('date-fns/locale/it'),
    name: 'Italiano',
    dir: 'ltr',
  },
  'ru-RU': {
    date: async () => import('date-fns/locale/ru'),
    name: 'русский',
    dir: 'ltr',
  },
  'tr-TR': {
    date: async () => import('date-fns/locale/tr'),
    name: 'Türk',
    dir: 'ltr',
  },
  ar: {
    date: async () => import('date-fns/locale/ar-DZ'),
    name: 'العربية',
    dir: 'rtl',
  },
};

export type AvailableLocale = keyof typeof localeConfig;

export const STRIPE_LOCALES: Record<AvailableLocale, StripeElementLocale> = {
  ar: 'ar',
  'de-DE': 'de',
  'en-US': 'en',
  'en-GB': 'en-GB',
  'es-ES': 'es-ES',
  'fr-FR': 'fr-FR',
  'it-IT': 'it-IT',
  'ru-RU': 'ru',
  'tr-TR': 'tr',
} as const;

export const intlContext = createContext<IntlContext | null>(null);

export const useIntlContext = () => useContext(intlContext)!;

export default intlContext.Provider;

import { createContext, useContext } from 'react';
import { FormatNumberOptions, IntlShape } from 'react-intl';

import { RoundingMode } from '@sorare/core/src/lib/wei';

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
  formatFixtureDate: (so5Fixture: {
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
    name: 'Espa�ol',
  },
  'fr-FR': {
    date: async () => import('date-fns/locale/fr'),
    dir: 'ltr',
    name: 'Fran�ais',
  },
  'it-IT': {
    date: async () => import('date-fns/locale/it'),
    name: 'Italiano',
    dir: 'ltr',
  },
  'ru-RU': {
    date: async () => import('date-fns/locale/ru'),
    name: '???????',
    dir: 'ltr',
  },
  'tr-TR': {
    date: async () => import('date-fns/locale/tr'),
    name: 'T�rk',
    dir: 'ltr',
  },
  ar: {
    date: async () => import('date-fns/locale/ar-DZ'),
    name: '???????',
    dir: 'rtl',
  },
};

export type AvailableLocale = keyof typeof localeConfig;

export const intlContext = createContext<IntlContext | null>(null);

export const useIntlContext = () => useContext(intlContext)!;

export default intlContext.Provider;

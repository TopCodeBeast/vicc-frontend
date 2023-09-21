import { useEffect, useState } from 'react';

import { FRONTEND_ASSET_HOST } from '@core/constants/assets';
import { load } from '@core/lib/http';
import { toLanguageCode } from '@core/lib/i18n';

import { REVISION } from '../config';

export const AVAILABLE_LOCALES = [
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
const AVAILABLE_LANGUAGES = AVAILABLE_LOCALES.map(toLanguageCode);
export const ALLOWED_LOCALES = AVAILABLE_LANGUAGES.concat(AVAILABLE_LOCALES);

type AvailableLocale = (typeof AVAILABLE_LOCALES)[number];
type AvailableLanguages = 'en' | 'de' | 'es' | 'fr' | 'it' | 'ru' | 'tr';
export type AllowedLocales = AvailableLocale | AvailableLanguages;

let DEV_TRANSLATIONS: Record<string, () => Promise<any>> = {};
if (import.meta.env.DEV) {
  // To get the translations run the `yarn i18n:lokalise:download` script
  DEV_TRANSLATIONS = import.meta.glob('./translations/*.json');
}

export default (locale: AllowedLocales, testMode = false) => {
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const formattedLocale = locale.split('-')[0];

    const loadLiveTranslations = async (revision: string) =>
      load(`${FRONTEND_ASSET_HOST}/i18n/${revision}/${formattedLocale}.json.gz`)
        .then(t =>
          setTranslations(existingTranslations => ({
            ...existingTranslations,
            ...(t as any),
          }))
        )
        .catch(() => {});

    if (!testMode) {
      if (REVISION === 'development') {
        if (formattedLocale === 'en') {
          // for english translations, just rely on what's in the code
        } else if (import.meta.env.MASTER_COMMIT_REF) {
          // otherwise load the associated master translations
          loadLiveTranslations(import.meta.env.MASTER_COMMIT_REF);
        }
      } else {
        loadLiveTranslations(REVISION);
      }
    } else if (formattedLocale !== 'en') {
      // In test mode access translations locally
      const key = `./translations/${formattedLocale}.json`;

      if (Object.keys(DEV_TRANSLATIONS).includes(key)) {
        DEV_TRANSLATIONS[key]().then(data => setTranslations(data.default));
      }
    }
  }, [locale, testMode]);

  return translations;
};

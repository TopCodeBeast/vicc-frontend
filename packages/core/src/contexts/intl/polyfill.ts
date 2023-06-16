import { shouldPolyfill as shouldDateTimeFormatPolyfill } from '@formatjs/intl-datetimeformat/should-polyfill';
import { shouldPolyfill as shouldLocalePolyfill } from '@formatjs/intl-locale/should-polyfill';

export async function polyfillLocale() {
  // This platform already supports Intl.Locale
  if (shouldLocalePolyfill()) {
    await import('@formatjs/intl-locale/polyfill');
  }
}

export async function polyfillDateTimeFormat(locale: string) {
  if (shouldDateTimeFormatPolyfill()) {
    // Load the polyfill 1st BEFORE loading data
    await import('@formatjs/intl-datetimeformat/polyfill');
  }

  if ((Intl.DateTimeFormat as any).polyfilled) {
    // Parallelize CLDR data loading
    const dataPolyfills = [import('@formatjs/intl-datetimeformat/add-all-tz')];
    switch (locale) {
      default:
        dataPolyfills.push(
          import('@formatjs/intl-datetimeformat/locale-data/en')
        );
        break;
      case 'de':
        dataPolyfills.push(
          import('@formatjs/intl-datetimeformat/locale-data/de')
        );
        break;
      case 'fr':
        dataPolyfills.push(
          import('@formatjs/intl-datetimeformat/locale-data/fr')
        );
        break;
      case 'it':
        dataPolyfills.push(
          import('@formatjs/intl-datetimeformat/locale-data/it')
        );
        break;
      case 'ru':
        dataPolyfills.push(
          import('@formatjs/intl-datetimeformat/locale-data/ru')
        );
        break;
      case 'tr':
        dataPolyfills.push(
          import('@formatjs/intl-datetimeformat/locale-data/tr')
        );
        break;
      case 'es':
        dataPolyfills.push(
          import('@formatjs/intl-datetimeformat/locale-data/es')
        );
        break;
      case 'ar':
        dataPolyfills.push(
          import('@formatjs/intl-datetimeformat/locale-data/ar')
        );
        break;
    }
    await Promise.all(dataPolyfills);
  }
}

import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { ReactNode, memo, useEffect, useState } from 'react';
import {
  FormatDateOptions,
  FormatNumberOptions,
  IntlProvider as ReactIntlProvider,
  useIntl,
} from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import useLocalStorage from '@sorare/core/src/hooks/useLocalStorage';
import useTranslations, {
  ALLOWED_LOCALES,
  AllowedLocales,
} from 'i18n/useTranslations';
import detectBrowserLanguage from '@sorare/core/src/lib/detectBrowserLanguage';
import { RoundingMode, fromWei } from '@sorare/core/src/lib/wei';

import IntlContextProvider, {
  AvailableLocale,
  DisplayOptions,
  localeConfig,
} from '.';
import { LOCALE_STORAGE_KEY } from '../../constants/intl';
import { polyfillDateTimeFormat, polyfillLocale } from './polyfill';

interface InnerProps {
  children: ReactNode;
  setLocale: (newLocale: string) => void;
  testMode: boolean;
}

const DEFAULT_LOCALE: AllowedLocales = 'en-US';
const getAllowedLocales = (locale: string | null) =>
  ALLOWED_LOCALES.includes(locale || '') ? (locale as AllowedLocales) : null;

const InnerComponent = ({ children, setLocale, testMode }: InnerProps) => {
  const intl = useIntl();
  const locale = intl.locale as AvailableLocale;
  const config = localeConfig[locale];
  const [dateLocaleConfig, setDateLocaleConfig] = useState();

  const formatEth = (
    value: number | string,
    options?: FormatNumberOptions,
    displayOptions?: DisplayOptions
  ) => {
    const opts = { minimumFractionDigits: 3, ...options };
    return `${intl.formatNumber(Number.parseFloat(value.toString()), opts)}${
      displayOptions?.hideSymbol ? '' : '\xa0ETH'
    }`;
  };

  const formatCardBonus = (value: number) =>
    intl.formatNumber(value, {
      style: 'percent',
      maximumFractionDigits: 1,
      signDisplay: 'always',
    });

  /**
   * Formats the fixture period (startDate - endDate)
   * If both date belong to the same month, return for instance 8–12 May
   * If both date belong to different months, return 31 May–2 June
   */
  const formatFixtureDate = (so5Fixture: {
    startDate: ISO8601DateTime;
    endDate: ISO8601DateTime;
  }) => {
    const { startDate, endDate } = so5Fixture;
    const options: FormatDateOptions = { month: 'short', day: 'numeric' };
    const [startDateM, endDateM] = [new Date(startDate), new Date(endDate)];
    if (new Date(startDateM).getMonth() === new Date(endDateM).getMonth()) {
      return intl
        .formatDate(endDate, options)
        .replace(
          endDateM.getDate().toString(),
          `${startDateM.getDate()} – ${endDateM.getDate()}`
        );
    }
    return `${intl.formatDate(startDate, options)} – ${intl.formatDate(
      endDate,
      options
    )}`;
  };

  const formatWei = (
    value: string,
    roundingMode?: RoundingMode,
    options?: FormatNumberOptions,
    displayOptions?: DisplayOptions
  ) => {
    // We display a precision of 4 digits OR at least 2 significant numbers
    // 1Eth is 10^18wei, the length of the string is the power of 10
    const precision = Math.max(4, 18 - value.length + 2);

    const ethValue = fromWei(value, precision, roundingMode);

    // We want to display the significant digits, discarding trailing 0
    const [, fractionnal] = ethValue.toString().split('.');
    return formatEth(
      ethValue,
      {
        minimumFractionDigits: fractionnal?.length,
        ...options,
      },
      displayOptions
    );
  };

  const formatDistanceToNowWithLocale = (
    date: Date,
    { addSuffix } = { addSuffix: true }
  ) =>
    formatDistanceToNow(date, {
      addSuffix,
      locale: dateLocaleConfig,
    });

  const formatDistanceToNowStrictWithLocale = (
    date: Date,
    { addSuffix } = { addSuffix: true }
  ) =>
    formatDistanceToNowStrict(date, {
      addSuffix,
      locale: dateLocaleConfig,
    });

  useEffect(() => {
    if (!testMode && config) {
      config.date().then(c => setDateLocaleConfig(c.default));

      const root = document.querySelector('html');
      if (root) root.dir = config.dir;
    }
  }, [config, testMode]);

  useEffect(() => {
    const html = window.document.documentElement;

    if (html) html.lang = locale.toString();
  }, [locale, config]);

  return (
    <IntlContextProvider
      value={{
        ...intl,
        dir: config?.dir || 'ltr',
        formatEth,
        formatWei,
        formatCardBonus,
        formatFixtureDate,
        setLocale,
        formatDistanceToNow: formatDistanceToNowWithLocale,
        formatDistanceToNowStrict: formatDistanceToNowStrictWithLocale,
      }}
    >
      {children}
    </IntlContextProvider>
  );
};

interface Props {
  children: ReactNode;
  testMode?: boolean;
  timeZone?: string;
}

export const IntlProvider = ({
  children,
  testMode = false,
  timeZone,
}: Props) => {
  const [polyfillLoaded, setPolyfillLoaded] = useState(testMode);
  const [searchParams, setSearchParams] = useSearchParams();
  const localeFromUrl = searchParams.get('lang');
  const [locale, setLocale] = useLocalStorage(LOCALE_STORAGE_KEY, () =>
    detectBrowserLanguage()
  );
  const safeLocaleFromUrl = getAllowedLocales(localeFromUrl);
  const safeSavedLocale = getAllowedLocales(locale);
  const safeLocale = safeLocaleFromUrl || safeSavedLocale || DEFAULT_LOCALE;

  const translations = useTranslations(safeLocale, testMode);

  if (safeLocaleFromUrl && safeSavedLocale !== safeLocaleFromUrl) {
    setLocale(safeLocaleFromUrl);
  }

  useEffect(() => {
    if (localeFromUrl) {
      searchParams.delete('lang');
      setSearchParams(searchParams, { replace: true });
    }
  }, [localeFromUrl, searchParams, setSearchParams]);

  useEffect(() => {
    if (testMode) {
      return;
    }
    Promise.all([
      polyfillLocale(),
      polyfillDateTimeFormat(safeLocale.split('-')[0]),
    ]).then(() => setPolyfillLoaded(true));
  }, [safeLocale, testMode]);

  if (!polyfillLoaded) return null;

  return (
    <ReactIntlProvider
      locale={safeLocale}
      defaultLocale="en"
      key={safeLocale}
      messages={translations}
      onError={() => {}}
      timeZone={timeZone}
    >
      <InnerComponent setLocale={setLocale} testMode={testMode}>
        {children}
      </InnerComponent>
    </ReactIntlProvider>
  );
};

export default memo(IntlProvider);

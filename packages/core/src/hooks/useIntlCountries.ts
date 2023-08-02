import { useMemo } from 'react';

import { useIntlContext } from '@core/contexts/intl';
import { sortBy } from '@core/lib/arrays';
import countries from '@core/lib/countries.json';

export const useIntlCountries = () => {
  const { locale } = useIntlContext();
  return useMemo(
    () =>
      sortBy(
        country => country.label,
        Object.entries(countries).map(entry => ({
          value: entry[0],
          label:
            entry[1]?.[locale.slice(0, 2) as keyof (typeof entry)[1]] ||
            entry[1].en,
        }))
      ),
    [locale]
  );
};

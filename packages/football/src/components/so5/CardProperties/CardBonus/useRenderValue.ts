import Big from 'bignumber.js';
import { useCallback } from 'react';

import { useIntlContext } from '@sorare/core/src/contexts/intl';

export const useRenderValue = () => {
  const { formatNumber } = useIntlContext();
  return useCallback(
    (value: Big | number) => {
      return formatNumber(new Big(value).multipliedBy(100).toNumber(), {
        maximumFractionDigits: 1,
        signDisplay: 'always',
      });
    },
    [formatNumber]
  );
};
export default useRenderValue;

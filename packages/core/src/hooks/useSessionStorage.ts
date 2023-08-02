import { useCallback } from 'react';

import {
  ConversionCreditCampaign,
  MonetaryAmount,
  Sport,
} from '__generated__/globalTypes';

export enum SESSION_STORAGE {
  sport = 'sport',
  signupPromo = 'signup-promo',
}

export type SessionStorageEntries = {
  [SESSION_STORAGE.sport]: Sport;
  [SESSION_STORAGE.signupPromo]: Omit<
    ConversionCreditCampaign,
    'maxDiscount'
  > & {
    maxDiscount: Omit<
      MonetaryAmount,
      'eurFixed' | 'usdFixed' | 'gbpFixed' | 'weiFixed'
    >;
  };
};

export const useSessionStorage = <K extends keyof SessionStorageEntries>(
  key: K
): {
  getValue: () => SessionStorageEntries[K] | null;
  setValue: (value: SessionStorageEntries[K] | null) => void;
} => {
  const getValue = useCallback(() => {
    const stringValue = sessionStorage.getItem(key);

    if (stringValue) {
      try {
        return JSON.parse(stringValue) as SessionStorageEntries[K];
      } catch {
        return null;
      }
    }

    return null;
  }, [key]);

  const setValue = useCallback(
    (v: SessionStorageEntries[K] | null) => {
      if (v !== null) {
        sessionStorage.setItem(key, JSON.stringify(v));
      } else {
        sessionStorage.removeItem(key);
      }
    },
    [key]
  );

  return { getValue, setValue };
};

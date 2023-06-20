import { isValidUrl, sanitizeRedirectUrl } from '@sorare/core/src/lib/uri';

import useQueryString from './useQueryString';

export const useRedirectUrl = () => {
  const redirectUrl = useQueryString('redirectUrl');
  if (!redirectUrl) {
    return undefined;
  }
  const cleanRedirectUrl = sanitizeRedirectUrl(redirectUrl);
  const isRedirectUrlValid = isValidUrl(cleanRedirectUrl);

  return isRedirectUrlValid ? cleanRedirectUrl : undefined;
};

import { setContext } from '@apollo/client/link/context';
import cookie from 'react-cookies';

import {
  cloudflareAccessHeaders,
  xsrfCookieName,
  xsrfHeaderName,
} from '@core/lib/http';

import {
  CLIENT_TYPE,
  REVISION,
  TAB_VERSION,
  VERSION,
  isProduction,
} from '../../../config';

export const authLink = setContext(async (_, { headers }) => {
  const xsrfToken = cookie.load(xsrfCookieName);

  const extraHeaders: { [key: string]: string } = {};
  if (xsrfToken !== undefined) {
    extraHeaders[xsrfHeaderName] = xsrfToken;
  }
  if (
    import.meta.env.MODE === 'development' &&
    isProduction &&
    import.meta.env.SORARE_COM_API_KEY
  ) {
    extraHeaders.APIKEY = import.meta.env.SORARE_COM_API_KEY;
  }
  return {
    headers: {
      ...headers,
      ...cloudflareAccessHeaders,
      'sorare-client': CLIENT_TYPE,
      'sorare-version': VERSION,
      'sorare-build': REVISION,
      'sorare-tab-version': TAB_VERSION,
      ...extraHeaders,
    },
  };
});

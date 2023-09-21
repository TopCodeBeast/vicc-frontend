import axios from 'axios';

import {
  API_ROOT,
  CLIENT_TYPE,
  REVISION,
  TAB_VERSION,
  VERSION,
  isMockprod,
  isStaging,
} from '../config';
import { toCamelCase } from './toCamelCase';

export const xsrfHeaderName = 'X-CSRF-Token';
export const xsrfCookieName = 'csrftoken';
export const xsrfReceivingHeaderName = 'csrf-token';
export const cloudflareAccessHeaders =
  import.meta.env.NODE_ENV === 'development' && (isStaging || isMockprod)
    ? {
        'CF-Access-Client-Id': import.meta.env.CLOUDFLARE_ACCESS_CLIENT_ID,
        'CF-Access-Client-Secret': import.meta.env.CLOUDFLARE_ACCESS_CLIENT_SECRET,
      }
    : {};

export const onError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data;
  }

  // Something happened in setting up the request that triggered an Error
  return { error: error.message };
};

const instance = ({ withCredentials = true } = {}) =>
  axios.create({
    baseURL: API_ROOT,
    xsrfCookieName,
    xsrfHeaderName,
    // withCredentials, //TODO*********Axios
    headers: {
      ...cloudflareAccessHeaders,
      'sorare-client': CLIENT_TYPE,
      'sorare-version': VERSION,
      'sorare-build': REVISION,
      'sorare-tab-version': TAB_VERSION,
    },
  });

export const client = instance({ withCredentials: true });
export const clientWithoutCredentials = instance({ withCredentials: false });

export const formatUpdateUserErrors = (errors: any) =>
  Object.entries<any>(errors).reduce<Record<string, string>>((sum, cur) => {
    const [key, [err]] = cur;
    sum[toCamelCase(key)] = err;
    return sum;
  }, {});

export async function load<T extends NonNullable<unknown>>(
  url: string,
  withCredentials = false
): Promise<T> {
  const c = withCredentials ? client : axios;

  const { data } = await c.get(url);
  return data;
}

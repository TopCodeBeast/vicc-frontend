import { format } from 'date-fns';
import qs from 'qs';

import config from './config.json';

type Environment = 'staging' | 'development' | 'production' | 'mockprod';

const { hostname, search } =
  typeof window !== 'undefined'
    ? window.location
    : { hostname: '', search: '' };

const forcedEnv: Environment | undefined = qs.parse(search, {
  ignoreQueryPrefix: true,
}).force_env as Environment;

if (forcedEnv && typeof sessionStorage !== 'undefined') {
  sessionStorage.setItem('forcedEnv', forcedEnv);
}

const forcedFlags: Environment | undefined = qs.parse(search, {
  ignoreQueryPrefix: true,
}).force_flags as Environment;

if (forcedFlags && typeof sessionStorage !== 'undefined') {
  sessionStorage.setItem('forcedFlags', forcedFlags);
}

const forcedFlag = qs.parse(search, {
  ignoreQueryPrefix: true,
  decoder(value) {
    if (/^(\d+|\d*\.\d+)$/.test(value)) {
      return parseFloat(value);
    }
    const keywords: Record<string, boolean | null | undefined> = {
      true: true,
      false: false,
      null: null,
      undefined,
    };
    if (value in keywords) {
      return keywords[value];
    }
    return value;
  },
}).force_flag;

if (forcedFlag && typeof sessionStorage !== 'undefined') {
  sessionStorage.setItem('forcedFlag', JSON.stringify(forcedFlag));
}

const getEnvConfig = () => {
  if (import.meta.env.STORYBOOK === 'true') {
    // Always use local env in storybook
    return config.development;
  }
  if (hostname.match(/vicc-dev/)) {
    return config.staging;
  }
  if (hostname.match(/sorare.tech/)) {
    return config.mockprod;
  }
  if (hostname.match(/sorare.co$/)) {
    return {
      ...config.production,
      backendHost: config.production.backendHost.replace(
        'sorare.com',
        'sorare.co'
      ),
      walletUrl: config.production.walletUrl.replace('sorare.com', 'sorare.co'),
      wsUrl: config.production.wsUrl.replace('sorare.com', 'sorare.co'),
    };
  }
  if (hostname === 'frontend') {
    // this case is used when taking card snapshot in the dev environment
    return {
      ...config.development,
      backendHost: 'http://backend:3000',
    };
  }
  if (hostname.match(/.*\.local/)) {
    return {
      ...config.development,
      backendHost: `${window.location.protocol}//${window.location.hostname}:3000`,
      walletUrl: `${window.location.protocol}//${window.location.hostname}:3002`,
    };
  }

  if (hostname.match(/localhost|(192\.168\..*\..*)/)) {
    return {
      ...config.development,
      walletUrl: config.development.walletUrl.replace(
        'http:',
        window.location.protocol
      ),
    };
  }

  return config.production;
};

let envConfig = getEnvConfig();
const sessionForcedEnv: Environment | null =
  typeof sessionStorage !== 'undefined'
    ? (sessionStorage.getItem('forcedEnv') as Environment)
    : null;
const sessionForcedFlags: Environment | null =
  typeof sessionStorage !== 'undefined'
    ? (sessionStorage.getItem('forcedFlags') as Environment)
    : null;

export const ACTUAL_ENV = envConfig.env;

if (sessionForcedEnv && config[sessionForcedEnv]) {
  envConfig = {
    ...config[sessionForcedEnv],
    launchDarklyClientSideID: envConfig.launchDarklyClientSideID,
    walletUrl: envConfig.walletUrl,
  };
}

if (
  ACTUAL_ENV !== 'production' &&
  sessionForcedFlags &&
  config[sessionForcedFlags]
) {
  envConfig = {
    ...envConfig,
    launchDarklyClientSideID:
      config[sessionForcedFlags].launchDarklyClientSideID,
  };
}

export const isForcedEnv = () => {
  return (
    typeof sessionStorage !== 'undefined' &&
    sessionStorage &&
    !!sessionStorage.getItem('forcedEnv')
  );
};

export const ENV = envConfig.env;
export const isStaging = ENV === 'staging';
export const isMockprod = ENV === 'mockprod';
export const isProduction = ENV === 'production';

export const API_ROOT = envConfig.backendHost;
export const API_PATH = '/graphql';
export const US_SPORTS_API_ROOT =
  envConfig.usSportsBackendHost || envConfig.backendHost;
export const US_SPORTS_API_PATH = '/sports/graphql';
export const SOFE_API_ROOT = envConfig.sofeHost || envConfig.backendHost;
export const SOFE_API_PATH =
  import.meta.env.MODE === 'development' && !isForcedEnv()
    ? '/graphql'
    : '/federation/graphql';
export const WS_ROOT = `${envConfig.wsUrl}/cable`;
export const BRAZE_SDK_ENDPOINT = envConfig.brazeSdkEndpoint;
export const BRAZE_API_KEY = envConfig.brazeApiKey;
export const STRIPE_PUBLIC_KEY = envConfig.stripePublicKey;
export const WALLET_URL = envConfig.walletUrl;
export const ETHERSCAN_URL =
  envConfig.env === 'production'
    ? 'https://etherscan.io'
    : 'https://goerli.etherscan.io';
export const PORTIS_ID = envConfig.portisId;
export const RAMP_API_KEY = envConfig.rampApiKey;
export const RAMP_URL = envConfig.rampUrl;
export const MOONPAY_URL = envConfig.moonpayUrl;
export const LAUNCH_DARKLY_CLIENT_SIDE_ID = envConfig.launchDarklyClientSideID;
export const SEGMENT_API_KEY = envConfig.segmentApiKey;
export const IMPACT_PAGE_LOAD_API_URL = envConfig.impactPageLoadAPIUrl;
export const WALLET_CONNECT_PROJECT_ID = 'b1e8df3bb981e9917bfeeb0ad4110bb7';

export const CLIENT_TYPE = 'Web';
export const REVISION = import.meta.env?.VITE_COMMIT_REF || 'development';
export const IS_TEST_RUNNER =
  import.meta.env.NODE_ENV === 'test' || import.meta.env.STORYBOOK === 'true';
export const TAB_VERSION = format(new Date(), 'yyyyMMddHHmmss');
export const VERSION =
  REVISION === 'development' || import.meta.env.MODE === 'development'
    ? TAB_VERSION
    : Number(import.meta.env.VITE_TIMESTAMP_VERSION);

export const SO5_SENTRY_DSN =
  'https://6aa84363323647f78159a04b60f11ffe@o1067581.ingest.sentry.io/6105154';

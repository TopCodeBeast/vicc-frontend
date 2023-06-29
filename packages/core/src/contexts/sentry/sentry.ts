import {
  BrowserOptions,
  BrowserTracing,
  Integrations,
  init,
  reactRouterV6Instrumentation,
  withProfiler,
} from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

import { SOFE_API_PATH, SOFE_API_ROOT } from '@core/config';

// See https://gist.github.com/impressiver/5092952
const communityIgnoredErrors = [
  // Random plugins/extensions
  'top.GLOBALS',
  // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
  'originalCreateNotification',
  'canvas.contentDocument',
  'MyApp_RemoveAllHighlights',
  'http://tt.epicplay.com',
  "Can't find variable: ZiteReader",
  'jigsaw is not defined',
  'ComboSearch is not defined',
  'http://loading.retry.widdit.com/',
  'atomicFindClose',
  // Facebook borked
  'fb_xd_fragment',
  // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
  // See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
  'bmi_SafeAddOnload',
  'EBCallBackMessageReceived',
  // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
  'conduitPage',
  // Generic error code from errors outside the security sandbox
  // You can delete this if using raven.js > 1.0, which ignores these automatically.
  'Script error.',
  // Those are actual errors which are raised whenever there is a recaptcha error
  // there is nothing to do for those
  'Invalid recaptcha token',
];

const customIgnoredErrors = [
  // Ignoring this because there's nothing that can be done when this is thrown, and currently
  // thrown by launchdarkly API
  'A network error occurred',

  // Ignore network failed errors as they are not actionable & already handled with an error page
  'TypeError: Failed to fetch', // Chrome
  'TypeError: NetworkError when attempting to fetch resource', // Firefox
  'Error: Load failed', // iOS

  // TODO(SO5-952): Remove these once we can actually solve it, but for now they're spamming us
  "Cannot read properties of undefined (reading 'focus')",
  "undefined is not an object (evaluating 't.input.focus')",

  // skip rate limit errors
  /rate limit exceeded/,

  // Ignore errors from API calls done while being logged out
  /Not authorized to access/,
];

const ignoredErrorPatterns = [
  ...communityIgnoredErrors,
  ...customIgnoredErrors,
];

const ignoredUrls = [
  // Facebook flakiness
  /graph\.facebook\.com/i,
  // Facebook blocked
  /connect\.facebook\.net\/en_US\/all\.js/i,
  // Woopra flakiness
  /eatdifferent\.com\.woopra-ns\.com/i,
  /static\.woopra\.com\/js\/woopra\.js/i,
  // Chrome extensions
  /extensions\//i,
  /^chrome:\/\//i,
  // Other plugins
  /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
  /webappstoolbarba\.texthelp\.com\//i,
  /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
];

export const startSentry = ({
  dsn,
  env,
  release,
}: {
  dsn: string;
  env: string;
  release: string;
}) => {
  const sentryEnv = env === 'production' ? 'prod' : env;
  const isDevelopment = sentryEnv === 'development';
  const options: BrowserOptions = {
    dsn,
    environment: sentryEnv,
    allowUrls: isDevelopment ? [] : ['/static/js', '/assets'],
    denyUrls: ignoredUrls,
    ignoreErrors: ignoredErrorPatterns,
    integrations: [
      new Integrations.GlobalHandlers({
        onerror: true,
        onunhandledrejection: false,
      }),
      new Integrations.Breadcrumbs({
        console: sentryEnv !== 'development',
      }),
      new BrowserTracing({
        tracePropagationTargets: [`${SOFE_API_ROOT}${SOFE_API_PATH}`],
        routingInstrumentation: reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
    ],
    tracesSampleRate: 0.01,
    release,
    autoSessionTracking: false,
  };
  init(options);
};

export { withProfiler };

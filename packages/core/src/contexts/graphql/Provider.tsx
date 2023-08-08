import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  ServerError,
  createHttpLink,
  fallbackHttpConfig,
  selectHttpOptionsAndBody,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { Consumer, createConsumer } from '@rails/actioncable';
import { addBreadcrumb, withScope } from '@sentry/react';
import { createUploadLink, isExtractableFile } from 'apollo-upload-client';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import extractFiles from 'extract-files/extractFiles.mjs';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import cookie from 'react-cookies';

import { useDeviceFingerprintContext } from '@core/contexts/deviceFingerprint';
import { useIntlContext } from '@core/contexts/intl';
import { useSentryContext } from '@core/contexts/sentry';
import { useSessionContext } from '@core/contexts/session';
import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';
import OperationStoreClient from '@core/gql/OperationStoreClient';
import { dataIdFromObject } from '@core/gql/idFromObject';
import introspectionResult from '@core/gql/introspectionResult.json';
import { useDebugLink } from '@core/hooks/graphql/useDebugLink';
import { useTMLink } from '@core/hooks/graphql/useTMLink';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import {
  cloudflareAccessHeaders,
  xsrfCookieName,
  xsrfHeaderName,
  xsrfReceivingHeaderName,
} from '@core/lib/http';

import GraphqlContextProvider from '.';
import {
  API_PATH,
  API_ROOT,
  CLIENT_TYPE,
  REVISION,
  SOFE_API_PATH,
  SOFE_API_ROOT,
  TAB_VERSION,
  VERSION,
  WS_ROOT,
  isMockprod,
  isProduction,
  isStaging,
} from '../../config';
import ActionCableLink from './ActionCableLink';
import { typePolicies } from './typePolicies';

const cable = () => createConsumer(WS_ROOT);

const MAX_RETRIES = 8;
const INITIAL_RETRY_DELAY = 1000;

export const createCache = () =>
  new InMemoryCache({
    dataIdFromObject,
    possibleTypes: introspectionResult.possibleTypes,
    typePolicies,
  });

export const coreCache = createCache();

const hasSubscriptionOperation = ({
  query: { definitions },
}: {
  query: { definitions: any };
}) =>
  definitions.some(
    ({ kind, operation }: { kind: string; operation: string }) =>
      kind === 'OperationDefinition' && operation === 'subscription'
  );

const SILENT_STATUS_CODES = [404];
const SILENT_GRAPHQL_CODES = ['NOT_FOUND', 'UNAUTHORIZED'];

interface Props {
  children: ReactNode;
  uri?: string;
  disableGraphQLErrorsReport?: boolean;
}

export const GraphqlProvider = ({
  children,
  uri = `${SOFE_API_ROOT}${SOFE_API_PATH}`,
  disableGraphQLErrorsReport = false,
}: Props) => {
  const { showNotification } = useSnackNotificationContext();
  const { locale } = useIntlContext();
  const [wsCable, setWsCable] = useState<Consumer>(cable());
  const [seonSession, setSeonSession] = useState('');
  const { sendSafeError } = useSentryContext();
  const { sessionId, apiKey } = useSessionContext();
  const { deviceFingerprint } = useDeviceFingerprintContext();
  const {
    flags: { useOfflineSupport = false },
  } = useFeatureFlags();

  useEffect(() => {
    const seonStatus = {
      available: true,
    };
    /*if (window.seon && sessionId) {
      window.seon.config({
        session_id: sessionId,
        audio_fingerprint: true,
        canvas_fingerprint: true,
        webgl_fingerprint: true,
        onError: message => {
          sendSafeError(
            new Error(`Unexpected seon issue error found: ${message}`)
          );
        },
      });
      try {
        window.seon.getBase64Session(data => {
          if (seonStatus.available) {
            try {
              setSeonSession(data);
            } catch (e) {
              sendSafeError(
                new Error(
                  `Failed updating seon session data because of an unexpected error: ${e}`
                )
              );
            }
          }
        });
      } catch (e) {
        sendSafeError(
          new Error(
            `Failed retrieving seon session data because of an unexpected error: ${e}`
          )
        );
      }
    }*/
    return () => {
      seonStatus.available = false;
    };
  }, [sendSafeError, sessionId]);

  const authLink = useMemo(
    () =>
      setContext(async (_, { headers }) => {
        return {
          headers: {
            ...headers,
            ...cloudflareAccessHeaders,
            'sorare-client': CLIENT_TYPE,
            'sorare-version': VERSION,
            'sorare-build': REVISION,
            'sorare-tab-version': TAB_VERSION,
            'Accept-Language': locale,
            DEVICE_FINGERPRINT: await deviceFingerprint(),
            [xsrfHeaderName]: cookie.load(xsrfCookieName),
            'Seon-Session': seonSession,
            ...(apiKey && { APIKEY: apiKey }),
            // ...(import.meta.env.MODE === 'development' &&
            //   isProduction &&
            //   process.env.SORARE_COM_API_KEY && {
            //     APIKEY: process.env.SORARE_COM_API_KEY,
            //   }),
          },
        };
      }),
    [seonSession, locale, apiKey, deviceFingerprint]
  );

  const debugLink = useDebugLink();
  const tmLink = useTMLink({ path: new URL(uri).pathname });

  const link = useMemo(() => {
    /* eslint-enable consistent-return */
    const onErrorLink = onError(
      ({ networkError, graphQLErrors, operation, forward }) => {
        if (networkError) {
          if ('statusCode' in networkError && networkError.statusCode === 401) {
            // session has expired, retry the request
            return forward(operation);
          }

          // In the case of 429 network error for signIn, we make this error silent cause we want to have an inline error instead of a notification:
          // Error is handled at a lower level in the form directly
          if (
            'statusCode' in networkError &&
            networkError.statusCode === 429 &&
            operation?.operationName === 'SignInMutation'
          ) {
            return undefined;
          }

          if (
            !('statusCode' in networkError) ||
            !SILENT_STATUS_CODES.includes(networkError.statusCode)
          ) {
            addBreadcrumb({ level: 'debug', data: { networkError } });
            showNotification('errors', { errors: [networkError.message] });
          }
          /*if ('statusCode' in networkError && networkError.statusCode === 503) {
            const { start, end, msg } = (networkError as ServerError).result
              .maintenance;

            if (msg) {
              showNotification('serviceUnderMaintenance', {
                start,
                end,
                msg,
              });
            }
          }*/
        }
        if (graphQLErrors) {
          const messages = graphQLErrors.map(e => e.message);
          showNotification('errors', { errors: messages });
        }

        /*if (
          !disableGraphQLErrorsReport &&
          (graphQLErrors || (networkError as ServerError)?.result?.message) &&
          // HTTP 500 errors are already logged in the backend
          (networkError as ServerError)?.statusCode !== 500
        ) {
          withScope(scope => {
            scope.setTag('kind', operation.operationName);
            scope.setExtra('variables', operation.variables);
            graphQLErrors?.forEach(err => {
              if (SILENT_GRAPHQL_CODES.includes(err.extensions?.code)) {
                return;
              }
              sendSafeError(
                new Error(
                  `GraphqlError: "${err.message}" in ${
                    operation.operationName
                  } > ${(err.path ?? []).join(' > ')})`,
                  {
                    cause: err,
                  }
                )
              );
            });
            if ((networkError as ServerError)?.result?.message) {
              const serverNetWorkError = networkError as ServerError;
              sendSafeError(
                new Error(
                  `GraphqlNetworkError: "${serverNetWorkError.result.message}" in ${operation.operationName}`,
                  {
                    cause: networkError,
                  }
                )
              );
            }
          });
        }*/

        return undefined;
      }
    );

    const retryLink = new RetryLink({
      delay: {
        initial: INITIAL_RETRY_DELAY,
        jitter: true,
        max: Infinity,
      },
      attempts(count, _operation, error) {
        if (typeof (error as ServerError)?.statusCode === 'number') {
          return false;
        }

        return !!error && count < MAX_RETRIES;
      },
    });
    /* eslint-disable consistent-return */

    const httpLink = createHttpLink({ uri });

    /*const httpLink = ApolloLink.split(
      hasSubscriptionOperation,
      new ActionCableLink({ cable: wsCable }) as any,
      createUploadLink({
        uri: operation => {
          // FIXME: (https://gitlab.com/sorare/frontend/-/merge_requests/9705/diffs#note_1443894551)
          // multipart is not working with sofe.
          // We need to keep this code until https://linear.app/sorare/issue/PLT-3014/dont-use-multipart-in-graphql-requests is addressed
          const { body } = selectHttpOptionsAndBody(
            operation,
            fallbackHttpConfig
          );
          // Inspired by https://github.com/jaydenseric/apollo-upload-client/blob/master/public/createUploadLink.js#L123
          const { files } = extractFiles(body, isExtractableFile);
          const isMultipart = files.size > 0;
          return isMultipart ? `${API_ROOT}${API_PATH}` : uri;
        },
        fetchOptions: {
          referrerPolicy: 'unsafe-url',
        },
        fetch: async (requestUri: RequestInfo, options?: RequestInit) => {
          return fetch(requestUri, options).then(response => {
            // Hack to redirect to Cloudflare Access login page in dev
            if (
              (isStaging || isMockprod) &&
              response.url.startsWith('https://sorare.cloudflareaccess.com')
            ) {
              window.location.replace(API_ROOT);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && !contentType.includes('application/json')) {
              response.text().then(body => {
                sendSafeError(
                  new Error(
                    `Invalid content type ${contentType} for response ${body}`
                  )
                );
              });
            }
            return response;
          });
        },
        credentials: 'include',
        headers: {
          accept: 'application/json',
        },
      })
    );*/

    const afterwareLink = new ApolloLink((operation, forward) => {
      return forward
        ? forward(operation).map(response => {
            const ctx = operation.getContext();
            if (!ctx.response) return response;

            const {
              response: { headers },
            } = ctx;
            if (headers?.get(xsrfReceivingHeaderName)) {
              const expires = new Date();
              expires.setFullYear(expires.getFullYear() + 1);

              cookie.save(
                xsrfCookieName,
                headers.get(xsrfReceivingHeaderName),
                {
                  path: '/',
                  // make sure the cookie is available on subdomains
                  domain: window.location.hostname.replace(
                    /.*\.sorare\./,
                    'sorare.'
                  ),
                  expires,
                }
              );
            }
            if (
              import.meta.env.MODE === 'development' &&
              headers?.get('X-bullet-footer-text')
            ) {
              showNotification(
                'errors',
                {
                  errors: JSON.parse(headers?.get('X-bullet-footer-text')),
                },
                {
                  level: Level.ERROR,
                }
              );
            }

            return response;
          })
        : null;
    });

    return ApolloLink.from(
      [
        debugLink,
        tmLink,
        afterwareLink,
        authLink,
        // OperationStoreClient()?.apolloLink,
        useOfflineSupport && retryLink,
        onErrorLink,
        httpLink,
      ].filter(Boolean)
    );
  }, [
    wsCable,
    debugLink,
    tmLink,
    authLink,
    useOfflineSupport,
    disableGraphQLErrorsReport,
    showNotification,
    sendSafeError,
    uri,
  ]);

  const client = useMemo(() => {
    return new ApolloClient({
      link,
      cache: coreCache,
      assumeImmutableResults: true,
      resolvers: {},
    });
  }, [link]);

  const refreshWsCable = useCallback(() => {
    setWsCable(cable());
    return null;
  }, [setWsCable]);

  return (
    <GraphqlContextProvider value={{ refreshWsCable }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </GraphqlContextProvider>
  );
};

export default GraphqlProvider;

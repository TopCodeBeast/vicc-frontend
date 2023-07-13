import { ComponentType, lazy as lazyNoRetry } from 'react';

import { SilencedError } from '@core/contexts/sentry/ErrorBoundary';

const MAX_RETRIES = 5;
const FAILED_TO_FETCH = 'Failed to fetch dynamically imported module';
const IMPORTING_SCRIPT_MODULE_FAILED = 'Importing a module script failed';
const NO_INTERNET = 'No Internet! Please check your network connection.';

type ComponentTypeImport<TYPE extends ComponentType<any> = ComponentType<any>> =
  { default: TYPE };

const retry = async <T extends ComponentTypeImport>(
  fn: () => Promise<T>,
  retriesLeft = MAX_RETRIES,
  interval = 5000
): Promise<T> => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch(e => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // nicely fail the failing imported module fetching
            if (
              e.message?.includes(FAILED_TO_FETCH) ||
              e.message?.includes(IMPORTING_SCRIPT_MODULE_FAILED)
            ) {
              reject(new SilencedError(NO_INTERNET, e));
            } else {
              reject(e);
            }
            return;
          }

          // eslint-disable-next-line no-console
          console.log(
            `Failed to resolve, retrying (${
              MAX_RETRIES - retriesLeft + 1
            }/${MAX_RETRIES}) in ${interval}ms...`,
            e
          );

          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
};

export const lazy = <T extends ComponentType<any>>(
  fn: () => Promise<ComponentTypeImport<T>>
) =>
  lazyNoRetry<T>(async () => retry<ComponentTypeImport<T>>(async () => fn()));

export default retry;

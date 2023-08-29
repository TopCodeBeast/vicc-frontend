import { ServerError } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { withScope } from '@sentry/react';
import { print } from 'graphql/language/printer';

import { SnackNotificationContext } from '@core/contexts/snackNotification';
import { sendSafeError } from '@core/lib/error';

const SILENT_STATUS_CODES = [404];

/* eslint-disable consistent-return */
export const retryLink = (
  showNotification: SnackNotificationContext['showNotification']
) =>
  onError(({ networkError, graphQLErrors, operation, forward }): any => {
    if (networkError) {
      if ('statusCode' in networkError && networkError.statusCode === 401) {
        // session has expired, retry the request
        return forward(operation);
      }
      if (
        !('statusCode' in networkError) ||
        !SILENT_STATUS_CODES.includes(networkError.statusCode)
      ) {
        showNotification('errors', { errors: [networkError.message] });
      }
      if ('statusCode' in networkError && networkError.statusCode === 503) {
        const { start, end, msg } = ((networkError as ServerError).result as any).maintenance; //TODO

        if (msg) {
          showNotification('serviceUnderMaintenance', {
            start,
            end,
            msg,
          });
        }
      }
    }
    if (graphQLErrors) {
      withScope(scope => {
        scope.setTag(
          'version',
          operation.getContext().headers['sorare-version']
        );
        scope.setTag('kind', operation.operationName);
        // Log query and variables as extras
        // (make sure to strip out sensitive data!)
        scope.setExtra('query', print(operation.query));
        scope.setExtra('variables', operation.variables);

        graphQLErrors.forEach(err => {
          showNotification('errors', { errors: err.message });

          if (err.extensions?.displayMessage) {
            // Those are legit errors that only required a notification
            return;
          }

          sendSafeError(
            new Error(
              `GraphqlError: "${err.message}" in ${
                operation.operationName
              } > ${(err.path ?? []).join(' > ')}`,
              { cause: err }
            )
          );
        });
      });
    }
  });
/* eslint-enable consistent-return */

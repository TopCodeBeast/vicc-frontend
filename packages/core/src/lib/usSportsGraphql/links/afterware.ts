import { ApolloLink } from '@apollo/client';

import { Level, SnackNotificationContext } from '@core/contexts/snackNotification';

export const afterwareLink = (
  showNotification: SnackNotificationContext['showNotification']
) =>
  new ApolloLink((operation, forward) => {
    return forward
      ? forward(operation).map(response => {
          const ctx = operation.getContext();
          if (!ctx.response) return response;

          const {
            response: { headers },
          } = ctx;
          if (
            import.meta.env.NODE_ENV === 'development' &&
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

// eslint-disable-next-line sorare/no-unrendered-component-imports
import { ApolloClient, ApolloLink } from '@apollo/client';

import { coreCache } from '@core/contexts/graphql/Provider';
import { SnackNotificationContext } from '@core/contexts/snackNotification';
import OperationStoreClient from '@core/gql/OperationStoreClient';

import { afterwareLink } from './links/afterware';
import { authLink } from './links/auth';
import { httpLink } from './links/http';
import { retryLink } from './links/retry';

export const getUsSportsApolloClient = ({
  showNotification,
  debugLink,
  tmLink,
  uri,
}: {
  showNotification: SnackNotificationContext['showNotification'];
  debugLink?: ApolloLink;
  tmLink?: ApolloLink;
  uri: string;
}) => {
  const link = ApolloLink.from(
    [
      debugLink,
      tmLink,
      afterwareLink(showNotification),
      authLink,
      OperationStoreClient()?.apolloLink,
      retryLink(showNotification),
      httpLink(uri),
    ].filter(Boolean)
  );

  return new ApolloClient({
    link,
    cache: coreCache,
    assumeImmutableResults: true,
    resolvers: {},
  });
};

import {
  BaseSubscriptionOptions,
  DocumentNode,
  useSubscription,
} from '@apollo/client';

/**
 * This empty component holds the subscription
 * Without triggering a full rerender of the app on each subscription event
 */
export const Subscription = ({
  gql,
  variables,
}: {
  gql: DocumentNode;
  variables?: BaseSubscriptionOptions;
}) => {
  useSubscription(gql, variables);
  return null;
};

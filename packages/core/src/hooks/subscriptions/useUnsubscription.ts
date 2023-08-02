import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

import {
  DeleteSubscriptionMutation,
  DeleteSubscriptionMutationVariables,
} from './__generated__/useUnsubscription.graphql';
import { SUBSCRIPTION_STATS_QUERY } from './useSubscribersCount';

const DELETE_SUBSCRIPTION_MUTATION = gql`
  mutation DeleteSubscriptionMutation($input: deleteSubscriptionInput!) {
    deleteSubscription(input: $input) {
      subscription {
        slug
        subscriber {
          ... on CurrentUser {
            slug
            mySubscriptions {
              nodes {
                slug
              }
            }
            followingCount
          }
        }
      }
    }
  }
` as TypedDocumentNode<
  DeleteSubscriptionMutation,
  DeleteSubscriptionMutationVariables
>;

export default function useUnsubscription() {
  const [unsubscribe] = useMutation(DELETE_SUBSCRIPTION_MUTATION);

  return async (subscription: { slug: string }) =>
    unsubscribe({
      variables: {
        input: {
          slug: subscription.slug,
        },
      },
      refetchQueries: [SUBSCRIPTION_STATS_QUERY, 'NetworkFollowingQuery'],
    });
}

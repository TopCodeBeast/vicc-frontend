import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

import {
  UpdateSubscriptionMutation,
  UpdateSubscriptionMutationVariables,
} from './__generated__/useUpdateSubscription.graphql';

const UPDATE_SUBSCRIPTION_MUTATION = gql`
  mutation UpdateSubscriptionMutation($input: updateSubscriptionInput!) {
    updateSubscription(input: $input) {
      subscription {
        slug
        subscribableType
        subscribableSlug
        preferences {
          slug
          notifyForRarities
        }
      }
    }
  }
` as TypedDocumentNode<
  UpdateSubscriptionMutation,
  UpdateSubscriptionMutationVariables
>;

export default function useUpdateSubscription(subscription: { slug: string }) {
  const [updateSubscription] = useMutation(UPDATE_SUBSCRIPTION_MUTATION);

  return async (rarities: readonly string[], enabled: boolean) =>
    updateSubscription({
      variables: {
        input: {
          slug: subscription.slug,
          rarities: [...rarities],
          enabled,
        },
      },
    });
}

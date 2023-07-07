import { gql, useMutation } from '@apollo/client';

import { GetCurrentUserSubscriptionProps } from '@core/contexts/follow';
// import { getInteractionContext } from '@core/lib/events';

import {
  CreateSubscriptionMutation,
  CreateSubscriptionMutationVariables,
} from './__generated__/useSubscription.graphql';
import { SUBSCRIPTION_STATS_QUERY } from './useSubscribersCount';

const CREATE_SUBSCRIPTION_MUTATION = gql`
  mutation CreateSubscriptionMutation($input: createSubscriptionInput!) {
    createSubscription(input: $input) {
      subscription {
        slug
        subscribableSlug
        subscribableType
        preferences {
          slug
          notifyForRarities
        }
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
`;

export default function useSubscription() {
  const [subscribe] = useMutation<
    CreateSubscriptionMutation,
    CreateSubscriptionMutationVariables
  >(CREATE_SUBSCRIPTION_MUTATION);
  // const interactionContext = getInteractionContext();

  return async (subscribable: GetCurrentUserSubscriptionProps) => {
    return subscribe({
      variables: {
        input: {
          subscribable: {
            type: subscribable.__typename as any, //TODO****
            slug: subscribable.slug,
          },
          // interactionContext,
        },
      },
      refetchQueries: [SUBSCRIPTION_STATS_QUERY, 'NetworkFollowingQuery'],
    });
  };
}

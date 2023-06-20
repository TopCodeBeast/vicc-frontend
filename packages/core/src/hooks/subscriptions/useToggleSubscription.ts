import { useCallback } from 'react';

import {
  GetCurrentUserSubscriptionProps,
  useFollowContext,
} from '@sorare/core/src/contexts/follow';

import useSubscription from './useSubscription';
import useUnsubscription from './useUnsubscription';

export default (
  subscription: { slug: string } | null,
  subscribable: GetCurrentUserSubscriptionProps
) => {
  const unsubscribe = useUnsubscription();
  const subscribe = useSubscription();
  const { removeFromMySubscriptions, addToMySubscriptions } =
    useFollowContext();

  const toggleSubscription = useCallback(() => {
    if (subscription) {
      unsubscribe(subscription).then(() => {
        removeFromMySubscriptions(subscription.slug);
      });
    } else {
      subscribe(subscribable).then(data => {
        if (data?.data?.createSubscription?.subscription) {
          addToMySubscriptions(data.data.createSubscription.subscription);
        }
      });
    }
  }, [
    subscription,
    subscribable,
    subscribe,
    unsubscribe,
    removeFromMySubscriptions,
    addToMySubscriptions,
  ]);

  return toggleSubscription;
};

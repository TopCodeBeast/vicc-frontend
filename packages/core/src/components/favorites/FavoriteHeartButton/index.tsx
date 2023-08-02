import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { Color } from '@core/atoms/buttons/Button';
import IconButton from '@core/atoms/buttons/IconButton';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import {
  GetCurrentUserSubscriptionProps,
  useFollowContext,
} from '@core/contexts/follow';
import useToggleSubscription from '@core/hooks/subscriptions/useToggleSubscription';

import FavoriteCardIcon from '../FavoriteHeartIcon';

interface Props {
  subscribable: GetCurrentUserSubscriptionProps;
  small?: boolean;
  color?: Color;
  solid?: boolean;
  onAddToFavoritesSuccess?: () => void;
}

export const FavoriteHeartButton = ({
  subscribable,
  small,
  color = 'transparent',
  solid = true,
  onAddToFavoritesSuccess = () => {},
}: Props) => {
  const { formatMessage } = useIntl();
  const { getCurrentUserSubscription } = useFollowContext();
  const { currentUser } = useCurrentUserContext();
  const subscription = getCurrentUserSubscription(subscribable);
  const [subscriptionState, setSubscriptionState] = useState(!!subscription);

  const toggleSubscription = useToggleSubscription(subscription, subscribable);

  useEffect(() => {
    setSubscriptionState(!!getCurrentUserSubscription(subscribable));
  }, [subscribable, getCurrentUserSubscription]);

  if (!currentUser) return null;

  return (
    <IconButton
      small={small}
      color={color}
      onClick={() => {
        setSubscriptionState(!subscriptionState);
        toggleSubscription();

        if (!subscriptionState) {
          onAddToFavoritesSuccess();
        }
      }}
      aria-label={
        subscriptionState
          ? formatMessage({
              id: 'Follower.unfollow',
              defaultMessage: 'Unfollow',
            })
          : formatMessage({
              id: 'Follower.add',
              defaultMessage: 'Follow',
            })
      }
    >
      <FavoriteCardIcon
        hasCurrentUserSubscription={subscriptionState}
        solid={solid}
      />
    </IconButton>
  );
};

export default FavoriteHeartButton;

import { useState } from 'react';
import { useIntl } from 'react-intl';

import { Color } from '@sorare/core/src/atoms/buttons/Button';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import {
  GetCurrentUserSubscriptionProps,
  useFollowContext,
} from '@sorare/core/src/contexts/follow';
import useToggleSubscription from '@sorare/core/src/hooks/subscriptions/useToggleSubscription';

import FavoriteCardIcon from '../FavoriteHeartIcon';

interface Props {
  subscribable: GetCurrentUserSubscriptionProps;
  small?: boolean;
  color?: Color;
  solid?: boolean;
}

export const FavoriteHeartButton = ({
  subscribable,
  small,
  color = 'transparent',
  solid = true,
}: Props) => {
  const { formatMessage } = useIntl();
  const { getCurrentUserSubscription } = useFollowContext();
  const { currentUser } = useCurrentUserContext();
  const subscription = getCurrentUserSubscription(subscribable);
  const [subscriptionState, setSubscriptionState] = useState(!!subscription);

  const toggleSubscription = useToggleSubscription(subscription, subscribable);

  if (!currentUser) return null;

  return (
    <IconButton
      small={small}
      color={color}
      onClick={() => {
        setSubscriptionState(sub => !sub);
        toggleSubscription();
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

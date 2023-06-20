import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Button, { Props as ButtonProps } from '@sorare/core/src/atoms/buttons/Button';
import { useCurrentUserContext } from 'contexts/currentUser';
import useSubscription from '@sorare/core/src/hooks/subscriptions/useSubscription';
import useUnsubscription from '@sorare/core/src/hooks/subscriptions/useUnsubscription';
import useLoggedCallback from '@sorare/core/src/hooks/useLoggedCallback';

interface Subscription {
  slug: string;
}

interface Subscribable {
  __typename: string;
  slug: string;
}

interface Props extends ButtonProps {
  subscribable: Subscribable;
  initialSubscription?: Subscription | null;
}

const FollowButton = ({
  subscribable,
  initialSubscription = null,
  ...rest
}: Props) => {
  const [subscription, setSubscription] = useState<Subscription | null>(
    initialSubscription
  );
  const [hover, setHover] = useState<boolean>(false);
  const unsubscribe = useUnsubscription();
  const subscribe = useSubscription();
  const { currentUser } = useCurrentUserContext();

  const loggedHandler = useLoggedCallback<
    React.MouseEvent<HTMLElement, MouseEvent>
  >(event => {
    event.stopPropagation();

    if (subscription) {
      unsubscribe(subscription).then(() => setSubscription(null));
    } else {
      subscribe(subscribable).then(({ data }) => {
        if (!data) return;
        setSubscription({
          slug: data.createSubscription!.subscription!.slug,
        });
      });
    }
  });

  if (
    currentUser?.slug === subscribable.slug &&
    subscribable.__typename === 'User'
  ) {
    return null;
  }

  const variant = subscription && hover ? 'red' : 'white';
  const messageIfHover = hover ? (
    <FormattedMessage id="FollowButton.unfollow" defaultMessage="Unfollow" />
  ) : (
    <FormattedMessage id="FollowButton.following" defaultMessage="Following" />
  );

  return (
    <Button
      onClick={loggedHandler}
      color={variant}
      onMouseEnter={() => {
        if (subscription) setHover(true);
      }}
      onMouseLeave={() => {
        if (subscription) setHover(false);
      }}
      {...rest}
    >
      <span>
        {subscription ? (
          messageIfHover
        ) : (
          <FormattedMessage id="FollowButton.follow" defaultMessage="Follow" />
        )}
      </span>
    </Button>
  );
};

export default FollowButton;

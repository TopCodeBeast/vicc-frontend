import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button, { Props as ButtonProps } from '@core/atoms/buttons/Button';
import {
  GetCurrentUserSubscriptionProps,
  useFollowContext,
} from '@core/contexts/follow';
import useToggleSubscription from '@core/hooks/subscriptions/useToggleSubscription';
import useLoggedCallback from '@core/hooks/useLoggedCallback';

interface Props extends Omit<ButtonProps, 'onChange' | 'classes'> {
  subscribable: GetCurrentUserSubscriptionProps;
  onChange?: (value: boolean) => void;
}

const Root = styled(Button)`
  &.stroke {
    background-color: white;
  }
`;

export const FollowButton = (props: Props) => {
  const { subscribable, onChange, className, ...rest } = props;
  const { getCurrentUserSubscription } = useFollowContext();

  const subscription = getCurrentUserSubscription(subscribable);
  const toggleSubscription = useToggleSubscription(subscription, subscribable);

  const loggedToggleSubscription = useLoggedCallback<any>(toggleSubscription);

  return (
    <Root
      onClick={e => {
        onChange?.(!subscription);
        loggedToggleSubscription(e);
      }}
      className={className}
      color="blue"
      stroke={!subscription}
      medium
      {...rest}
    >
      <span>
        {subscription ? (
          <FormattedMessage id="Follower.remove" defaultMessage="Following" />
        ) : (
          <FormattedMessage id="Follower.add" defaultMessage="Follow" />
        )}
      </span>
    </Root>
  );
};

export default FollowButton;

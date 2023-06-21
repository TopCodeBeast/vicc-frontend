import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';
import { GetCurrentUserSubscriptionProps } from '@core/contexts/follow';
import useSubscribersCount from '@core/hooks/subscriptions/useSubscribersCount';

const Count = styled(Text16)`
  font-weight: 900;
  white-space: nowrap;
`;
interface Props {
  subscribable: GetCurrentUserSubscriptionProps;
  shorten?: boolean;
}
const SubscribersCount = ({ subscribable, shorten }: Props) => {
  const subscribersCount = useSubscribersCount(subscribable);

  return (
    <Count>
      {shorten ? (
        <span>
          {Intl.NumberFormat('en', { notation: 'compact' }).format(
            subscribersCount
          )}
        </span>
      ) : (
        <FormattedMessage
          id="Follower.count"
          defaultMessage="{subscriptionsCount, number} {subscriptionsCount, plural, one {Follower} other {Followers}}"
          values={{ subscriptionsCount: subscribersCount }}
        />
      )}
    </Count>
  );
};

export default SubscribersCount;

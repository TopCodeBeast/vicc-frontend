import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import Bold from '@core/atoms/typography/Bold';
import { DumbNotification } from '@core/components/activity/DumbNotification';
import { INVITE } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { ReferralRewardNotification_referralRewardNotification } from './__generated__/index.graphql';

type Props = CommonNotificationProps & {
  notification: ReferralRewardNotification_referralRewardNotification;
};

const messages = defineMessages({
  referrer_reward_ready_to_claim: {
    id: 'Activity.Notifications.referrerRewardReadyToClaim',
    defaultMessage: 'You won a <b>referral reward</b> as a <b>referrer</b>',
  },
  referee_reward_ready_to_claim: {
    id: 'Activity.Notifications.refereeRewardReadyToClaim',
    defaultMessage: 'You won a <b>referral reward</b> as a <b>referee</b>',
  },
});

export const ReferralRewardNotification = ({
  notification,
  ...rest
}: Props) => {
  const { currentUser } = useCurrentUserContext();

  const { name, createdAt, sport, read } = notification;

  const title = messages[name as keyof typeof messages];

  return (
    <DumbNotification
      title={title && <FormattedMessage {...title} values={{ b: Bold }} />}
      userAvatar={currentUser}
      link={generatePath(INVITE)}
      createdAt={createdAt}
      sport={sport}
      read={read}
      {...rest}
    />
  );
};

ReferralRewardNotification.fragments = {
  referralRewardNotification: gql`
    fragment ReferralRewardNotification_referralRewardNotification on ReferralRewardNotification {
      ...Notification_notificationInterface
    }
    ${commonNotificationInterfaceFragment}
    ${DumbNotification.fragments.tokenPicture}
  ` as TypedDocumentNode<ReferralRewardNotification_referralRewardNotification>,
};

import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';

import Bold from '@sorare/core/src/atoms/typography/Bold';
import { DumbNotification } from 'components/activity/DumbNotification';
import { FOOTBALL_COMPETITION_DETAILS } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { ChallengeNotification_challengeNotification } from './__generated__/index.graphql';

type Props = CommonNotificationProps & {
  notification: ChallengeNotification_challengeNotification;
};

export const ChallengeNotification = ({ notification, ...rest }: Props) => {
  const { currentUser } = useCurrentUserContext();

  const { createdAt, challenge, challengeable, sport, read } = notification;

  const link = generatePath(FOOTBALL_COMPETITION_DETAILS, {
    competition: challengeable.slug,
    tab: 'details',
  });
  return (
    <DumbNotification
      title={
        <FormattedMessage
          id="Activity.Notifications.challengeCompleted"
          defaultMessage="You have completed the challenge <b>{description}</b>"
          values={{ b: Bold, description: challenge.description }}
        />
      }
      userAvatar={currentUser}
      link={link}
      createdAt={createdAt}
      sport={sport}
      read={read}
      {...rest}
    />
  );
};

ChallengeNotification.fragments = {
  challengeNotification: gql`
    fragment ChallengeNotification_challengeNotification on ChallengeNotification {
      ...Notification_notificationInterface
      challenge {
        id
        description
      }
      challengeable {
        ... on So5Leaderboard {
          slug
        }
      }
    }
    ${commonNotificationInterfaceFragment}
  `,
};

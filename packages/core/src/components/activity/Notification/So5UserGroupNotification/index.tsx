import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';

import Bold from '@sorare/core/src/atoms/typography/Bold';
import { DumbNotification } from 'components/activity/DumbNotification';
import {
  FOOTBALL_PRIVATE_LEAGUES_DETAILS,
  PrivateLeaguesTab,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { So5UserGroupNotification_so5UserGroupNotification } from './__generated__/index.graphql';

type Props = CommonNotificationProps & {
  notification: So5UserGroupNotification_so5UserGroupNotification;
};

export const So5UserGroupNotification = ({ notification, ...rest }: Props) => {
  const { currentUser } = useCurrentUserContext();

  const {
    createdAt,
    so5UserGroup,
    membership,
    otherMembershipsCount,
    sport,
    read,
  } = notification;

  const link = generatePath(FOOTBALL_PRIVATE_LEAGUES_DETAILS, {
    slug: so5UserGroup.slug,
    tab: PrivateLeaguesTab.MEMBERS,
  });

  return (
    <DumbNotification
      title={
        <FormattedMessage
          id="Activity.Notifications.so5UserGroupJoined"
          defaultMessage="<b>{nickname}{otherMembershipsCount, plural, =0 {} one { and 1 other} other { and {otherMembershipsCount} others}}</b> joined your private league <b>{displayName}</b>"
          values={{
            b: Bold,
            nickname: membership?.user.nickname,
            displayName: so5UserGroup.displayName,
            otherMembershipsCount,
          }}
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

So5UserGroupNotification.fragments = {
  so5UserGroupNotification: gql`
    fragment So5UserGroupNotification_so5UserGroupNotification on So5UserGroupNotification {
      ...Notification_notificationInterface
      so5UserGroup {
        id
        slug
        displayName
      }
      membership {
        id
        user {
          slug
          nickname
        }
      }
      otherMembershipsCount
    }
    ${commonNotificationInterfaceFragment}
  `,
};

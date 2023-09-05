import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';

import Bold from '@core/atoms/typography/Bold';
import { DumbNotification } from '@core/components/activity/DumbNotification';
import {
  FOOTBALL_PRIVATE_LEAGUES_DETAILS,
  PrivateLeaguesTab,
} from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { Vicc5UserGroupNotification_vicc5UserGroupNotification } from './__generated__/index.graphql';

type Props = CommonNotificationProps & {
  notification: Vicc5UserGroupNotification_vicc5UserGroupNotification;
};

export const Vicc5UserGroupNotification = ({ notification, ...rest }: Props) => {
  const { currentUser } = useCurrentUserContext();

  const {
    createdAt,
    vicc5UserGroup,
    membership,
    otherMembershipsCount,
    sport,
    read,
  } = notification;

  const link = generatePath(FOOTBALL_PRIVATE_LEAGUES_DETAILS, {
    slug: vicc5UserGroup.slug,
    tab: PrivateLeaguesTab.MEMBERS,
  });

  return (
    <DumbNotification
      title={
        <FormattedMessage
          id="Activity.Notifications.vicc5UserGroupJoined"
          defaultMessage="<b>{nickname}{otherMembershipsCount, plural, =0 {} one { and 1 other} other { and {otherMembershipsCount} others}}</b> joined your private league <b>{displayName}</b>"
          values={{
            b: Bold,
            nickname: membership?.user.nickname,
            displayName: vicc5UserGroup.displayName,
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

Vicc5UserGroupNotification.fragments = {
  vicc5UserGroupNotification: gql`
    fragment Vicc5UserGroupNotification_vicc5UserGroupNotification on Vicc5UserGroupNotification {
      ...Notification_notificationInterface
      vicc5UserGroup {
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
  ` as TypedDocumentNode<Vicc5UserGroupNotification_vicc5UserGroupNotification>,
};

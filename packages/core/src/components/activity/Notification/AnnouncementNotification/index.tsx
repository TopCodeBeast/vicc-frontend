import { gql } from '@apollo/client';
import { generatePath } from 'react-router-dom';

import { DumbNotification } from 'components/activity/DumbNotification';
import { ACTIVITY_NEWS_SHOW } from '@sorare/core/src/constants/routes';
import idFromObject from '@sorare/core/src/gql/idFromObject';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { AnnouncementNotification_announcementNotification } from './__generated__/index.graphql';

type Props = CommonNotificationProps & {
  notification: AnnouncementNotification_announcementNotification;
};

export const AnnouncementNotification = ({ notification, ...rest }: Props) => {
  const {
    createdAt,
    announcement: { id, title },
    sport,
    read,
  } = notification;

  return (
    <DumbNotification
      title={title}
      link={generatePath(ACTIVITY_NEWS_SHOW, { id: idFromObject(id) })}
      createdAt={createdAt}
      sport={sport}
      read={read}
      {...rest}
    />
  );
};

AnnouncementNotification.fragments = {
  announcementNotification: gql`
    fragment AnnouncementNotification_announcementNotification on AnnouncementNotification {
      ...Notification_notificationInterface
      announcement {
        id
        title
      }
    }
    ${commonNotificationInterfaceFragment}
  `,
};

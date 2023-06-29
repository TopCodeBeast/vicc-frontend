import { gql } from '@apollo/client';
import { useCallback } from 'react';

import { useInGameNotificationContext } from '@core/contexts/inGameNotification';

import AuctionNotification from './AuctionNotification';
import {
  NotificationDialog_notification,
  NotificationDialog_notification_AuctionNotification_ as NotificationDialog_notification_AuctionNotification,
} from './__generated__/index.graphql';

interface Props {
  notification: NotificationDialog_notification;
}

export const NotificationDialog = ({ notification }: Props) => {
  const { markNotificationsAsRead } = useInGameNotificationContext();

  const onClose = useCallback(() => {
    markNotificationsAsRead([notification]);
  }, [markNotificationsAsRead, notification]);

  switch (notification!.__typename) {
    case 'AuctionNotification':
      return (
        <AuctionNotification
          onClose={onClose}
          notification={
            notification as NotificationDialog_notification_AuctionNotification
          }
        />
      );
    default:
      return null;
  }
};

NotificationDialog.fragments = {
  notification: gql`
    fragment NotificationDialog_notification on Notification {
      ... on NotificationInterface {
        id
        sport
      }
      ... on AuctionNotification {
        ...NotificationDialog_AuctionNotification_auctionNotification
      }
    }
    ${AuctionNotification.fragments.notification}
  `,
};

export default NotificationDialog;

import { gql } from '@apollo/client';
import { useCallback } from 'react';

import { useInGameNotificationContext } from '@core/contexts/inGameNotification';
import useFeatureFlags from '@core/hooks/useFeatureFlags';

import AuctionNotification from './AuctionNotification';
import { CardCollectionNotification } from './CardCollectionNotification';
import {
  NotificationDialog_notification,
  NotificationDialog_notification_AuctionNotification_ as NotificationDialog_notification_AuctionNotification,
  NotificationDialog_notification_CardCollectionNotification_ as NotificationDialog_notification_CardCollectionNotification,
} from './__generated__/index.graphql';

interface Props {
  notification: NotificationDialog_notification;
}

export const NotificationDialog = ({ notification }: Props) => {
  const { markNotificationsAsRead } = useInGameNotificationContext();
  const {
    flags: { useCardCollectionNotificationDialog = false },
  } = useFeatureFlags();

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
    case 'CardCollectionNotification':
      return useCardCollectionNotificationDialog ? (
        <CardCollectionNotification
          onClose={onClose}
          notification={
            notification as NotificationDialog_notification_CardCollectionNotification
          }
        />
      ) : null;
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
      ... on CardCollectionNotification {
        ...NotificationDialog_CardCollectionNotification_cardCollectionNotification
      }
    }
    ${AuctionNotification.fragments.notification}
    ${CardCollectionNotification.fragments.notification}
  `,
};

export default NotificationDialog;

import { gql } from '@apollo/client';

export const commonNotificationInterfaceFragment = gql`
  fragment Notification_notificationInterface on NotificationInterface {
    id
    name
    createdAt
    sport
    read
  }
`;

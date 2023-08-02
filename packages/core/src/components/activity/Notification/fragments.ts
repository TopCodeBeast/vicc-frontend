import { TypedDocumentNode, gql } from '@apollo/client';

import { Notification_notificationInterface } from './__generated__/fragments.graphql';

export const commonNotificationInterfaceFragment = gql`
  fragment Notification_notificationInterface on NotificationInterface {
    id
    name
    createdAt
    sport
    read
  }
` as TypedDocumentNode<Notification_notificationInterface>;

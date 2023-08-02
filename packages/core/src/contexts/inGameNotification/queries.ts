import { TypedDocumentNode, gql } from '@apollo/client';

import Notification from '@core/components/activity/Notification';
import NotificationDialog from '@core/components/notification/NotificationDialog';

import {
  InGameNotificationProvider_notification,
  InGameNotificationProvider_notifications,
  InGameNotificationQuery,
  InGameNotificationQueryVariables,
  MarkNotificationsAsReadMutation,
  MarkNotificationsAsReadMutationVariables,
} from './__generated__/queries.graphql';

const notification = gql`
  fragment InGameNotificationProvider_notification on Notification {
    ... on NotificationInterface {
      id
      name
      read
      sport
      createdAt
    }
    ...NotificationDialog_notification
    ...Notification_notification
  }
  ${NotificationDialog.fragments.notification}
  ${Notification.fragments.notification}
` as TypedDocumentNode<InGameNotificationProvider_notification>;

const notifications = gql`
  fragment InGameNotificationProvider_notifications on CurrentUser {
    slug
    unreadNotificationsCount
    allUnreadNotificationsCount: unreadNotificationsCount(
      categories: $notificationCategories
    )
    allNotifications: notifications(
      first: $pageSize
      after: $notificationCursor
      categories: $notificationCategories
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        ...InGameNotificationProvider_notification
      }
    }
    currentSportUnreadAnnouncementsCount: unreadNotificationsCount(
      sports: $sports
      categories: $announcementCategories
    )
    currentSportAnnouncements: notifications(
      first: $pageSize
      after: $notificationCursor
      sports: $sports
      categories: $announcementCategories
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        ...InGameNotificationProvider_notification
      }
    }
  }
  ${notification}
` as TypedDocumentNode<InGameNotificationProvider_notifications>;

export const IN_GAME_NOTIFICATION_QUERY = gql`
  query InGameNotificationQuery(
    $notificationCursor: String
    $pageSize: Int
    $sports: [Sport!]
    $notificationCategories: [NotificationCategoryInput!]
    $announcementCategories: [NotificationCategoryInput!]
  ) {
    currentUser {
      slug
      ...InGameNotificationProvider_notifications
    }
  }
  ${notifications}
` as TypedDocumentNode<
  InGameNotificationQuery,
  InGameNotificationQueryVariables
>;

export const MARK_NOTIFICATIONS_AS_READ_MUTATION = gql`
  mutation MarkNotificationsAsReadMutation(
    $input: markNotificationsAsReadInput!
    $notificationCursor: String
    $pageSize: Int
    $sports: [Sport!]
    $notificationCategories: [NotificationCategoryInput!]
    $announcementCategories: [NotificationCategoryInput!]
  ) {
    markNotificationsAsRead(input: $input) {
      currentUser {
        slug
        ...InGameNotificationProvider_notifications
      }
      errors {
        path
        message
        code
      }
    }
  }
  ${notifications}
` as TypedDocumentNode<
  MarkNotificationsAsReadMutation,
  MarkNotificationsAsReadMutationVariables
>;

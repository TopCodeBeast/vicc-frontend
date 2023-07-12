import { gql } from '@apollo/client';

// import Notification from '@core/components/activity/Notification';
// import NotificationDialog from '@core/components/notification/NotificationDialog';

// const notification = gql`
//   fragment InGameNotificationProvider_notification on Notification {
//     ... on NotificationInterface {
//       id
//       name
//       read
//       sport
//       createdAt
//     }
//     #...NotificationDialog_notification
//     #...Notification_notification
//   }
//   #{NotificationDialog.fragments.notification}
//   #{Notification.fragments.notification}
// `;

// const notifications = gql`
//   fragment InGameNotificationProvider_notifications on CurrentUser {
//     slug
//     unreadNotificationsCount
//     allUnreadNotificationsCount: unreadNotificationsCount(
//       categories: $notificationCategories
//     )
//     allNotifications: notifications(
//       first: $pageSize
//       after: $notificationCursor
//       categories: $notificationCategories
//     ) {
//       pageInfo {
//         endCursor
//         hasNextPage
//       }
//       nodes {
//         ...InGameNotificationProvider_notification
//       }
//     }
//     currentSportUnreadAnnouncementsCount: unreadNotificationsCount(
//       sports: $sports
//       categories: $announcementCategories
//     )
//     currentSportAnnouncements: notifications(
//       first: $pageSize
//       after: $notificationCursor
//       sports: $sports
//       categories: $announcementCategories
//     ) {
//       pageInfo {
//         endCursor
//         hasNextPage
//       }
//       nodes {
//         ...InGameNotificationProvider_notification
//       }
//     }
//   }
//   ${notification}
// `;

// export const IN_GAME_NOTIFICATION_QUERY = gql`
//   query InGameNotificationQuery(
//     $notificationCursor: String
//     $pageSize: Int
//     $sports: [Sport!]
//     $notificationCategories: [NotificationCategoryInput!]
//     $announcementCategories: [NotificationCategoryInput!]
//   ) {
//     currentUser {
//       slug
//       ...InGameNotificationProvider_notifications
//     }
//   }
//   ${notifications}
// `;

// export const MARK_NOTIFICATIONS_AS_READ_MUTATION = gql`
//   mutation MarkNotificationsAsReadMutation(
//     $input: markNotificationsAsReadInput!
//     $notificationCursor: String
//     $pageSize: Int
//     $sports: [Sport!]
//     $notificationCategories: [NotificationCategoryInput!]
//     $announcementCategories: [NotificationCategoryInput!]
//   ) {
//     markNotificationsAsRead(input: $input) {
//       currentUser {
//         slug
//         ...InGameNotificationProvider_notifications
//       }
//       errors {
//         path
//         message
//         code
//       }
//     }
//   }
//   ${notifications}
// `;

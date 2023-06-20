import { gql } from '@apollo/client';
import { useMemo } from 'react';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import NotificationDialog from '@sorare/core/src/components/notification/NotificationDialog';
import { useInGameNotificationContext } from '@sorare/core/src/contexts/inGameNotification';
import { importantNotifications } from '@sorare/core/src/lib/notifications';

import { useImportantNotification_notification } from './__generated__/useImportantNotification.graphql';

export const useImportantNotification = () => {
  const { notifications } = useInGameNotificationContext();

  const importantNotification:
    | useImportantNotification_notification
    | undefined
    | null = useMemo(() => {
    if (notifications.length) {
      return notifications
        .filter(n => n && !n.read && n.sport === Sport.FOOTBALL)
        .find(n => n && importantNotifications.includes(n.name));
    }
    return null;
  }, [notifications]);

  return importantNotification;
};

useImportantNotification.fragments = {
  notification: gql`
    fragment useImportantNotification_notification on Notification {
      ...NotificationDialog_notification
    }
    ${NotificationDialog.fragments.notification}
  `,
};

export default useImportantNotification;

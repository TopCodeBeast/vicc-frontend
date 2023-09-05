import { useMemo } from 'react';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { useInGameNotificationContext } from '@sorare/core/src/contexts/inGameNotification';
import { importantNotifications } from '@sorare/core/src/lib/notifications';

export const useImportantNotification = () => {
  const { notifications } = useInGameNotificationContext();

  const importantNotification = useMemo(() => {
    if (notifications.length) {
      return notifications
        .filter(n => n && !n.read && n.sport === Sport.CRICKET)
        .find(n => n && importantNotifications.includes(n.name));
    }
    return null;
  }, [notifications]);

  return importantNotification;
};

export default useImportantNotification;

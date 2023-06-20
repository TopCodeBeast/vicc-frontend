import { gql } from '@apollo/client';
import { Suspense } from 'react';

import { lazy } from '@sorare/core/src/lib/retry';

import useImportantNotification from 'hooks/useImportantNotification';

const NotificationDialog = lazy(
  async () =>
    import('@sorare/core/src/components/notification/NotificationDialog')
);

export const UserDialog = () => {
  const importantNotification = useImportantNotification();

  if (importantNotification)
    return (
      <Suspense fallback={null}>
        <NotificationDialog
          key={importantNotification.id}
          notification={importantNotification}
        />
      </Suspense>
    );

  return null;
};

UserDialog.fragments = {
  notification: gql`
    fragment UserDialog_notification on Notification {
      ...useImportantNotification_notification
    }
    ${useImportantNotification.fragments.notification}
  `,
};

export default UserDialog;

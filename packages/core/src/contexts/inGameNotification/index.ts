import { createContext, useContext } from 'react';

import { InGameNotificationProvider_notification } from './__generated__/queries.graphql';

interface InGameNotificationContext {
  notifications: InGameNotificationProvider_notification[];
  loading: boolean;
  markNotificationsAsRead: (notifications: { id: string }[]) => void;
  unreadNotifications: number;
}

export const inGameNotificationContext =
  createContext<InGameNotificationContext | null>(null);

export const useInGameNotificationContext = () =>
  useContext(inGameNotificationContext)!;

export default inGameNotificationContext.Provider;

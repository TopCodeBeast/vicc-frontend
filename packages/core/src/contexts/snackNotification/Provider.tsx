import { SnackbarOrigin } from '@material-ui/core';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useIntl } from 'react-intl';

import SnackNotificationContextProvider, {
  Level,
  SnackNotificationOptions,
  notifications,
} from '.';
import { InlineNotification } from './InlineNotification';
import Notification from './SnackNotification';

type Props = {
  children: ReactNode;
};

const formatValues = (values: any): { [key: string]: string } => {
  if (typeof values !== 'object') return {};

  return Object.keys(values).reduce<{ [key: string]: string }>(
    (formattedVal, key) => {
      formattedVal[key] = Array.isArray(values[key])
        ? values[key].join('\n')
        : values[key];
      return formattedVal;
    },
    {}
  );
};

const InlineNotificationsContext = createContext<ReactNode>(null);

export const useInlineNotificationsContext = () =>
  useContext(InlineNotificationsContext);

export const SnackNotificationProvider = ({ children }: Props) => {
  const { formatMessage } = useIntl();
  const [notification, setNotification] = useState<{
    id: keyof typeof notifications;
    inline: boolean;
    values?: any;
    options?: {
      level?: Level;
      link?: string;
      onClosed?: () => void;
      anchorOrigin?: SnackbarOrigin;
    };
  } | null>(null);
  const { onClosed, anchorOrigin, ...options } = notification?.options || {};

  const showNotification = useCallback(
    (
      id: keyof typeof notifications,
      values = {},
      opts?: SnackNotificationOptions
    ) => {
      setNotification({
        id,
        values,
        options: opts,
        inline: id === 'confirmEmail',
      });
    },
    []
  );

  const onClose = useCallback(() => {
    setNotification(null);
    if (onClosed) {
      onClosed();
    }
  }, [onClosed]);

  return (
    <SnackNotificationContextProvider value={{ showNotification }}>
      <InlineNotificationsContext.Provider
        value={
          notification?.inline ? (
            <InlineNotification
              notification={formatMessage(
                notifications[notification.id],
                formatValues(notification.values)
              )}
              onClose={onClose}
            />
          ) : null
        }
      >
        {notification && !notification.inline && (
          <Notification
            notification={formatMessage(
              notifications[notification.id],
              formatValues(notification.values)
            )}
            opts={options}
            onClose={onClose}
            anchorOrigin={anchorOrigin}
          />
        )}
        {children}
      </InlineNotificationsContext.Provider>
    </SnackNotificationContextProvider>
  );
};

export default SnackNotificationProvider;

import { useMutation } from '@apollo/client';
// import Favico from 'favico.js';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { NotificationCategoryInput, Sport } from '__generated__/globalTypes';
import { allGroups } from '@core/components/activity/constants';
import { flattenGroups } from '@core/components/activity/utils';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import idFromObject from '@core/gql/idFromObject';
import useQuery from '@core/hooks/graphql/useQuery';
import { Lifecycle } from '@core/hooks/useLifecycle';

import InGameNotificationContextProvider from './index';
import {
  IN_GAME_NOTIFICATION_QUERY,
  MARK_NOTIFICATIONS_AS_READ_MUTATION,
} from './queries';

const AnnouncementCategoryInput: NotificationCategoryInput = {
  name: 'announcement',
  type: 'AnnouncementNotification',
};

const NOTIFICATION_TO_DISPLAY = 15;

/**
 * Provides the in-game notifications for the logged user.
 */
export const InGameNotificationProvider: FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const { currentUser } = useCurrentUserContext();
  const globalUnreadNotificationsCount =
    currentUser?.unreadNotificationsCount || 0;
  const lifecycle = currentUser?.userSettings?.lifecycle as Lifecycle;
  const lastVisitedSport = lifecycle?.lastVisitedSport;

  const [lastSport, setLastSport] = useState<Sport | undefined>(
    lastVisitedSport
  );
  const [
    lastGlobalUnreadNotificationsCount,
    setLastGlobalUnreadNotificationsCount,
  ] = useState(globalUnreadNotificationsCount);

  const { data, loading, refetch } = useQuery(IN_GAME_NOTIFICATION_QUERY, {
    variables: {
      pageSize: NOTIFICATION_TO_DISPLAY,
      sports: lastSport ? [lastSport] : undefined,
      notificationCategories: flattenGroups(allGroups),
      announcementCategories: [AnnouncementCategoryInput],
    },
  });
  const [markNotificationsAsReadMutation] = useMutation(
    MARK_NOTIFICATIONS_AS_READ_MUTATION
  );

  if (lastSport !== lastVisitedSport) {
    setLastSport(lastVisitedSport);
    refetch({
      sports: lastVisitedSport ? [lastVisitedSport] : undefined,
    });
  }

  const favicons = useMemo(() => {
    /*const faviconList: any[] = [];
    document
      .querySelectorAll('link[rel=icon], link[rel="shortcut icon"]')
      .forEach(element => {
        faviconList.push(
          new Favico({
            fontFamily: 'apercu-pro, sans-serif',
            bgColor: '#4662f7',
            element,
          })
        );
      });
    return faviconList;*/
    return [];//TODO
  }, []);

  if (globalUnreadNotificationsCount > lastGlobalUnreadNotificationsCount) {
    setLastGlobalUnreadNotificationsCount(globalUnreadNotificationsCount);
    refetch();
  }

  const unreadNotifications =
    (data?.currentUser?.allUnreadNotificationsCount || 0) +
    (data?.currentUser?.currentSportUnreadAnnouncementsCount || 0);

  useEffect(() => {
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Errors/Dead_object
    try {
      favicons.forEach(element => {
        if (unreadNotifications && unreadNotifications > 0) {
          element.badge(unreadNotifications);
        } else {
          element.reset();
        }
      });
    } catch (e) {
      if (
        !(e instanceof TypeError) ||
        e.message !== "can't access dead object"
      ) {
        throw e;
      }
    }
  }, [favicons, unreadNotifications]);

  const markNotificationsAsRead = useCallback(
    async (notifications?: { id: string }[]) => {
      const notificationIds = notifications
        ?.map(({ id }) => idFromObject(id))
        .filter(Boolean);

      if ((unreadNotifications || 0) > 0 && !loading) {
        const { data: mutationData } = await markNotificationsAsReadMutation({
          variables: {
            input: {
              notificationIds,
            },
            sports: lastSport ? [lastSport] : undefined,
            notificationCategories: flattenGroups(allGroups),
            announcementCategories: [AnnouncementCategoryInput],
          },
        });
        setLastGlobalUnreadNotificationsCount(
          mutationData?.markNotificationsAsRead?.currentUser
            ?.unreadNotificationsCount || 0
        );
      }
    },
    [loading, markNotificationsAsReadMutation, unreadNotifications, lastSport]
  );

  const notifications = useMemo(() => {
    const allNotifications = data?.currentUser?.allNotifications.nodes;
    const annoucements = data?.currentUser?.currentSportAnnouncements.nodes;

    const filteredNotifications = [
      ...(allNotifications || []),
      ...(annoucements || []),
    ].filter(Boolean);

    const mostRecentNotifications = filteredNotifications
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, NOTIFICATION_TO_DISPLAY);

    return mostRecentNotifications;
  }, [data]);

  const contextValue = useMemo(
    () => ({
      notifications,
      unreadNotifications,
      loading,
      markNotificationsAsRead,
    }),
    [notifications, unreadNotifications, loading, markNotificationsAsRead]
  );

  return (
    <InGameNotificationContextProvider value={contextValue}>
      {children}
    </InGameNotificationContextProvider>
  );
};

export default InGameNotificationProvider;

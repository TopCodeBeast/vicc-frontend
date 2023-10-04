import { TypedDocumentNode, gql } from '@apollo/client';

import { Sport } from '__generated__/globalTypes';

import {
  NotificationPreferencesQuery,
  NotificationPreferencesQueryVariables,
  useNotificationPreferences_notificationPreference,
  useNotificationPreferences_userSettings,
} from './__generated__/useNotificationPreferences.graphql';
import useQuery from './graphql/useQuery';

const notificationPreferencesFragment = gql`
  fragment useNotificationPreferences_notificationPreference on NotificationPreference {
    name
    value
    defaultValue
    values
  }
` as TypedDocumentNode<useNotificationPreferences_notificationPreference>;

export const USE_NOTIFICATION_PREFERENCES_USER_SETTINGS = gql`
  fragment useNotificationPreferences_userSettings on UserSettings {
    id
    notificationPreferences: notificationPreferences {
      ...useNotificationPreferences_notificationPreference
    }
  }
  ${notificationPreferencesFragment}
` as TypedDocumentNode<useNotificationPreferences_userSettings>;

const NOTIFICATION_PREFERENCES_QUERY = gql`
  query NotificationPreferencesQuery {
    currentUser {
      slug
      userSettings {
        id
        ...useNotificationPreferences_userSettings
      }
    }
  }
  ${USE_NOTIFICATION_PREFERENCES_USER_SETTINGS}
` as TypedDocumentNode<
  NotificationPreferencesQuery,
  NotificationPreferencesQueryVariables
>;

export const useNotificationPreferences = (sport: Sport) => {
  const { data, loading } = useQuery(NOTIFICATION_PREFERENCES_QUERY);

  if (loading || !data?.currentUser) return [];

  const { userSettings } = data.currentUser;

  return {
    [Sport.CRICKET]: userSettings.notificationPreferences,
    [Sport.NBA]: userSettings.notificationPreferences,
    [Sport.BASEBALL]: userSettings.notificationPreferences,
  }[sport];
};

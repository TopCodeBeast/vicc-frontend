import { gql } from '@apollo/client';

import { Sport } from '__generated__/globalTypes';

import {
  NotificationPreferencesQuery,
  NotificationPreferencesQueryVariables,
} from './__generated__/useNotificationPreferences.graphql';
import useQuery from './graphql/useQuery';

const notificationPreferencesFragment = gql`
  fragment useNotificationPreferences_notificationPreference on NotificationPreference {
    name
    value
    defaultValue
    values
  }
`;

export const useNotificationPreferences_userSettings = gql`
  fragment useNotificationPreferences_userSettings on UserSettings {
    id
    footballNotificationPreferences: notificationPreferences(sport: FOOTBALL) {
      ...useNotificationPreferences_notificationPreference
    }
    nbaNotificationPreferences: notificationPreferences(sport: NBA) {
      ...useNotificationPreferences_notificationPreference
    }
    baseballNotificationPreferences: notificationPreferences(sport: BASEBALL) {
      ...useNotificationPreferences_notificationPreference
    }
  }
  ${notificationPreferencesFragment}
`;

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
  ${useNotificationPreferences_userSettings}
`;

export const useNotificationPreferences = (sport: Sport) => {
  const { data, loading } = useQuery<
    NotificationPreferencesQuery,
    NotificationPreferencesQueryVariables
  >(NOTIFICATION_PREFERENCES_QUERY);

  if (loading || !data?.currentUser) return [];

  const { userSettings } = data.currentUser;

  return {
    [Sport.FOOTBALL]: userSettings.footballNotificationPreferences,
    [Sport.NBA]: userSettings.nbaNotificationPreferences,
    [Sport.BASEBALL]: userSettings.baseballNotificationPreferences,
  }[sport];
};

import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';

import { LOCALE_STORAGE_KEY } from '@core/constants/intl';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';
import useLocalStorage from '@core/hooks/useLocalStorage';

import {
  UpdateUserSettingsLocaleMutation,
  UpdateUserSettingsLocaleMutationVariables,
} from './__generated__/useSetLocale.graphql';

const UPDATE_USER_SETTINGS_LOCALE_MUTATION = gql`
  mutation UpdateUserSettingsLocaleMutation($input: updateUserSettingsInput!) {
    updateUserSettings(input: $input) {
      userSettings {
        id
        locale
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

export const useSetLocale = () => {
  const { locale, setLocale } = useIntlContext();
  const { currentUser } = useCurrentUserContext();
  const [storageLocale] = useLocalStorage(LOCALE_STORAGE_KEY, '');
  const userLocale = currentUser ? currentUser.userSettings.locale : null;

  const [mutate, { loading }] = useMutation<
    UpdateUserSettingsLocaleMutation,
    UpdateUserSettingsLocaleMutationVariables
  >(UPDATE_USER_SETTINGS_LOCALE_MUTATION);

  useEffect(() => {
    const saveUserLocale = (newLocale: string) => {
      mutate({
        variables: {
          input: {
            locale: newLocale,
          },
        },
      });
    };

    if (loading) return;

    if (storageLocale && userLocale !== storageLocale && currentUser?.slug) {
      // save locale to user
      saveUserLocale(storageLocale);
    } else if (userLocale && userLocale !== locale) {
      // update locale from user
      setLocale(userLocale);
    }
  }, [
    currentUser?.slug,
    loading,
    locale,
    mutate,
    setLocale,
    storageLocale,
    userLocale,
  ]);

  return { locale, setLocale };
};

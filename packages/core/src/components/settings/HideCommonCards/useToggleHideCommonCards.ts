import { FetchResult, gql, useMutation } from '@apollo/client';

import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';

import {
  UpdateUserSettingsHideCommonCards,
  UpdateUserSettingsHideCommonCardsVariables,
} from './__generated__/useToggleHideCommonCards.graphql';

const UPDATE_USER_SETTINGS_HIDE_COMMONS_MUTATION = gql`
  mutation UpdateUserSettingsHideCommonCards($input: updateUserSettingsInput!) {
    updateUserSettings(input: $input) {
      userSettings {
        id
        hideCommonCards
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

const useToggleHideCommonCards = () => {
  const { showNotification } = useSnackNotificationContext();
  const { currentUser } = useCurrentUserContext();
  const [mutate] = useMutation<
    UpdateUserSettingsHideCommonCards,
    UpdateUserSettingsHideCommonCardsVariables
  >(UPDATE_USER_SETTINGS_HIDE_COMMONS_MUTATION);

  return async () => {
    const { data, errors } = (await mutate({
      variables: {
        input: {
          hideCommonCards: !currentUser?.userSettings?.hideCommonCards,
        },
      },
      optimisticResponse: {
        updateUserSettings: {
          __typename: 'updateUserSettingsPayload',
          userSettings: {
            __typename: 'UserSettings',
            id: currentUser!.userSettings.id,
            hideCommonCards: !currentUser?.userSettings?.hideCommonCards,
          },
          errors: [],
        },
      } as any,
    })) as FetchResult<UpdateUserSettingsHideCommonCards>;

    if (data) {
      return data.updateUserSettings!;
    }
    showNotification('errors', errors);
    return null;
  };
};

export default useToggleHideCommonCards;

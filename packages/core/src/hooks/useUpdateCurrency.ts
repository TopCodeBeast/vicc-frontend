import { gql, useMutation } from '@apollo/client';
import { ReactNode } from 'react';

import { useCurrentUserContext } from 'contexts/currentUser';

import {
  UpdateUserSettingsCurrencyMutation,
  UpdateUserSettingsCurrencyMutationVariables,
} from './__generated__/useUpdateCurrency.graphql';

const UPDATE_USER_SETTINGS_CURRENCY_MUTATION = gql`
  mutation UpdateUserSettingsCurrencyMutation(
    $input: updateUserSettingsInput!
  ) {
    updateUserSettings(input: $input) {
      userSettings {
        id
        currency
        fiatCurrency
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

const useUpdateCurrency = () => {
  const { currentUser } = useCurrentUserContext();
  const [mutateCurrency, { loading }] = useMutation<
    UpdateUserSettingsCurrencyMutation,
    UpdateUserSettingsCurrencyMutationVariables
  >(UPDATE_USER_SETTINGS_CURRENCY_MUTATION);

  const updateCurrency =
    (target: string) =>
    (
      option?: {
        label: ReactNode;
        value: string;
      } | null
    ) => {
      mutateCurrency({
        variables: {
          input: {
            [target]: option!.value,
          },
        },
        optimisticResponse: {
          updateUserSettings: {
            __typename: 'updateUserSettingsPayload',
            userSettings: {
              ...currentUser!.userSettings,
              [target]: option!.value,
            },
            errors: [],
          },
        },
      });
    };

  return {
    updateCurrency,
    loading,
  };
};

export default useUpdateCurrency;

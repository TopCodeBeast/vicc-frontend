import { TypedDocumentNode, gql } from '@apollo/client';

import { Currency } from '__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useMutation from '@core/hooks/graphql/useMutation';

import {
  UpdateUserSettingsRewardCurrencyMutation,
  UpdateUserSettingsRewardCurrencyMutationVariables,
} from './__generated__/useUpdateRewardCurrency.graphql';

const UPDATE_USER_SETTINGS_REWARD_CURRENCY_MUTATION = gql`
  mutation UpdateUserSettingsRewardCurrencyMutation(
    $input: updateUserSettingsInput!
  ) {
    updateUserSettings(input: $input) {
      userSettings {
        id
        rewardCurrency
      }
      errors {
        path
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  UpdateUserSettingsRewardCurrencyMutation,
  UpdateUserSettingsRewardCurrencyMutationVariables
>;

const useUpdateRewardCurrency = () => {
  const { currentUser } = useCurrentUserContext();
  const [mutateRewardCurrency, { loading }] = useMutation(
    UPDATE_USER_SETTINGS_REWARD_CURRENCY_MUTATION
  );

  const updateRewardCurrency = (rewardCurrency: Currency) => {
    mutateRewardCurrency({
      variables: {
        input: {
          rewardCurrency,
        },
      },
      optimisticResponse: {
        updateUserSettings: {
          __typename: 'updateUserSettingsPayload',
          userSettings: {
            ...currentUser!.userSettings,
            rewardCurrency,
          },
          errors: [],
        },
      },
    });
  };

  return {
    updateRewardCurrency,
    loading,
  };
};

export default useUpdateRewardCurrency;

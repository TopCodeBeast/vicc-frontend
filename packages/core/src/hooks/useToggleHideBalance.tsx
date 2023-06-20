import { gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useEventsContext } from '@sorare/core/src/contexts/events';
import useEvents from '@sorare/core/src/lib/events/useEvents';

import {
  UpdateUserSettingsHideBalanceMutation,
  UpdateUserSettingsHideBalanceMutationVariables,
} from './__generated__/useToggleHideBalance.graphql';

const UPDATE_USER_SETTINGS_HIDE_BALANCE_MUTATION = gql`
  mutation UpdateUserSettingsHideBalanceMutation(
    $input: updateUserSettingsInput!
  ) {
    updateUserSettings(input: $input) {
      userSettings {
        id
        hideBalance
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

const useToggleHideBalanceEvent = () => {
  const { identify } = useEventsContext();
  const track = useEvents();
  return useCallback(
    (hidden: boolean) => {
      identify('', {
        traits: {
          balance_revealed: !hidden,
        },
      });
      track('Toggle Hide Balance', { hidden });
    },
    [identify, track]
  );
};

export const useToggleHideBalance = () => {
  const { currentUser } = useCurrentUserContext();
  const trackToggleHideBalance = useToggleHideBalanceEvent();
  const [mutate, { loading }] = useMutation<
    UpdateUserSettingsHideBalanceMutation,
    UpdateUserSettingsHideBalanceMutationVariables
  >(UPDATE_USER_SETTINGS_HIDE_BALANCE_MUTATION, {
    optimisticResponse: {
      updateUserSettings: {
        __typename: 'updateUserSettingsPayload',
        userSettings: {
          __typename: 'UserSettings',
          id: currentUser!.userSettings.id,
          hideBalance: !currentUser?.userSettings?.hideBalance,
        },
        errors: [],
      },
    },
  });

  const toggleHideBalance = useCallback(() => {
    const hideBalance = !currentUser?.userSettings?.hideBalance;
    mutate({
      variables: {
        input: {
          hideBalance,
        },
      },
    });
    trackToggleHideBalance(hideBalance);
  }, [currentUser?.userSettings?.hideBalance, trackToggleHideBalance, mutate]);

  return {
    hideBalance: currentUser?.userSettings?.hideBalance,
    toggleHideBalance,
    loading,
  };
};

export default useToggleHideBalance;

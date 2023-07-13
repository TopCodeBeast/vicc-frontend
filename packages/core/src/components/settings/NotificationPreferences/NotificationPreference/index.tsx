import { gql } from '@apollo/client';
import { FormControlLabel } from '@material-ui/core';
import { ChangeEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import Switch from '@core/atoms/inputs/Switch';
import { Text16 } from '@core/atoms/typography';
import useMutation from '@core/hooks/graphql/useMutation';
import { useNotificationPreferences_userSettings } from '@core/hooks/useNotificationPreferences';

import { notificationSubtitles, notificationTitles } from '../messages';
import {
  DisplayableMarketingPreference,
  DisplayablePreference,
} from '../types';
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from './__generated__/index.graphql';

type Props = {
  preference: {
    name: DisplayablePreference | DisplayableMarketingPreference;
    value: Json | null;
    defaultValue: Json;
    values: Json[];
  };
  sport: Sport;
};

const UPDATE_USER_SETTINGS_MUTATION = gql`
  mutation UpdateUserSettingsMutation($input: updateUserSettingsInput!) {
    updateUserSettings(input: $input) {
      userSettings {
        id
        ...useNotificationPreferences_userSettings
      }
      errors {
        path
        message
        code
      }
    }
  }
  ${useNotificationPreferences_userSettings}
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  display: flex;
  justify-content: space-between;
  text-transform: capitalize;
  gap: var(--double-unit);
  margin: 0;
`;

const Label = styled.div`
  display: flex;
  flex-direction: column;
  text-transform: none;
  font-weight: normal;
`;

export const NotificationPreference = ({ preference, sport }: Props) => {
  const [mutate] = useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UPDATE_USER_SETTINGS_MUTATION);
  const { name, value, defaultValue } = preference;

  const currentValue = value ?? defaultValue;

  // This is for transition purpose from multiple values to boolean values only
  const actualValue =
    typeof currentValue === 'string'
      ? currentValue === 'both' || currentValue === 'email'
      : !!currentValue;

  const handleChange = (newValue: any) => {
    mutate({
      variables: {
        input: {
          notificationPreference: {
            name,
            value: newValue,
            sport,
          },
        },
      },
    });
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event.target.checked);
  };

  return (
    <StyledFormControlLabel
      control={<Switch checked={actualValue} onChange={handleCheckboxChange} />}
      label={
        <Label>
          <Text16 color="var(--c-neutral-1000)">
            <FormattedMessage {...notificationTitles[name]} />
          </Text16>
          <Text16 color="var(--c-neutral-600)">
            <FormattedMessage {...notificationSubtitles[name]} />
          </Text16>
        </Label>
      }
      labelPlacement="start"
    />
  );
};

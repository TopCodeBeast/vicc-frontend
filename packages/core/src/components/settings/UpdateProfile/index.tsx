import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import {
  GraphQLResult,
  GraphqlForm,
  SubmitButtonProps,
  TextField,
} from 'components/form/Form';
import UploadFile from 'components/form/UploadFile';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import useUpdateUserProfile from '@sorare/core/src/hooks/useUpdateUserProfile';
import { glossary, userAttributes } from '@sorare/core/src/lib/glossary';
import { formatGqlErrors } from '@sorare/core/src/lib/gql';

import SettingsSection from '../SettingsSection';

const messages = defineMessages({
  title: {
    id: 'Settings.updateProfile.title',
    defaultMessage: 'User Profile',
  },
  nicknameWarning: {
    id: 'Settings.updateProfile.nicknameWarning',
    defaultMessage:
      'Username can only be changed once during a three-month period',
  },
});

const Form = styled(GraphqlForm)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 0;
  gap: var(--double-unit) 0;
`;

const UpdateProfile = () => {
  const { currentUser, refetch } = useCurrentUserContext();
  const { formatMessage } = useIntl();
  const [picture, setPicture] = useState(null);
  const updateUserProfile = useUpdateUserProfile();
  const { showNotification } = useSnackNotificationContext();

  const submit = async (
    attributes: any,
    onResult: (result: GraphQLResult) => void
  ) => {
    const { nickname, clubName, status } = attributes;

    const result = await updateUserProfile({
      clubName,
      status,
      picture,
      nickname,
    });

    if (result?.errors?.length) {
      showNotification('errors', { errors: formatGqlErrors(result.errors) });
    }

    if (result) {
      onResult(result);
    }
  };

  if (!currentUser) return null;

  const { nickname, profile } = currentUser;
  const { status, clubName, pictureUrl } = profile;
  return (
    <Form
      onSubmit={(attributes, onResult) => {
        submit(attributes, onResult);
      }}
      onSuccess={() => {
        refetch();
      }}
      render={(
        Error: React.ComponentType,
        SubmitButton: React.ComponentType<SubmitButtonProps>
      ) => (
        <SettingsSection title={messages.title}>
          <UploadFile
            name="picture"
            currentFileUrl={pictureUrl}
            onChange={(pic: any) => setPicture(pic)}
            type="image/*"
            buttonLabel={
              <FormattedMessage
                id="UploadFile.cta"
                defaultMessage="Upload an image"
              />
            }
          />
          <TextField
            name="nickname"
            label={formatMessage(userAttributes.nickname)}
            defaultValue={nickname}
            helperText={formatMessage(messages.nicknameWarning)}
          />
          <TextField
            name="clubName"
            maxLength={100}
            label={formatMessage(userAttributes.clubName)}
            defaultValue={clubName}
          />
          <TextField
            name="status"
            maxLength={100}
            label={formatMessage(userAttributes.status)}
            defaultValue={status || undefined}
          />

          <div>
            <SubmitButton small medium={false} color="blue">
              <FormattedMessage {...glossary.submit} />
            </SubmitButton>
          </div>
        </SettingsSection>
      )}
    />
  );
};

export default UpdateProfile;

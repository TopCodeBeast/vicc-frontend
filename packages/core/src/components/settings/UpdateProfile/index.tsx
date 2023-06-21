import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import {
  GraphQLResult,
  GraphqlForm,
  SubmitButtonProps,
  TextField,
} from '@core/components/form/Form';
import UploadFile from '@core/components/form/UploadFile';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import useUpdateUserProfile from '@core/hooks/useUpdateUserProfile';
import { glossary, userAttributes } from '@core/lib/glossary';
import { formatGqlErrors } from '@core/lib/gql';

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

type Props = {
  withinDialog?: boolean;
  onSubmit?: () => void;
};
const UpdateProfile = ({ withinDialog, onSubmit }: Props) => {
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
  const Content = ({
    SubmitButton,
  }: {
    SubmitButton: React.ComponentType<SubmitButtonProps>;
  }) => (
    <>
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
    </>
  );
  return (
    <Form
      onSubmit={(attributes, onResult) => {
        submit(attributes, onResult);
      }}
      onSuccess={() => {
        refetch();
        onSubmit?.();
      }}
      render={(
        Error: React.ComponentType,
        SubmitButton: React.ComponentType<SubmitButtonProps>
      ) =>
        withinDialog ? (
          <SettingsSection title={messages.title}>
            <Content SubmitButton={SubmitButton} />
          </SettingsSection>
        ) : (
          <Content SubmitButton={SubmitButton} />
        )
      }
    />
  );
};

export default UpdateProfile;

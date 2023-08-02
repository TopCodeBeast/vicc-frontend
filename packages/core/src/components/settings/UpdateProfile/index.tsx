import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled, { css } from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import {
  GraphQLResult,
  GraphqlForm,
  SubmitButtonProps,
  SwitchField,
  TextField,
} from '@core/components/form/Form';
import UploadFile from '@core/components/form/UploadFile';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { useSportContext } from '@core/contexts/sport';
import useLifecycle, { LIFECYCLE, Lifecycle } from '@core/hooks/useLifecycle';
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
  hideOnlineStatusTitle: {
    id: 'Settings.updateProfile.hideOnlineStatusTitle.title',
    defaultMessage: 'Always appear offline',
  },
  hideOnlineStatusDescription: {
    id: 'Settings.updateProfile.hideOnlineStatusTitle.description',
    defaultMessage: 'Hide your online status from other managers.',
  },
});

const Form = styled(GraphqlForm)`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 0;
  gap: var(--double-unit) 0;
`;
const ButtonRow = styled.div<{ fullWidth: boolean }>`
  ${props =>
    props.fullWidth &&
    css`
      & > * {
        width: 100%;
      }
    `}
  margin-top: auto;
`;

type Props = {
  withinSettings?: boolean;
  onSubmit?: () => void;
};

const Content = ({
  SubmitButton,
  setPicture,
  withinSettings,
}: {
  SubmitButton: React.ComponentType<React.PropsWithChildren<SubmitButtonProps>>;
  setPicture: React.Dispatch<React.SetStateAction<null>>;
  withinSettings?: boolean;
}) => {
  const { currentUser } = useCurrentUserContext();
  const { formatMessage } = useIntl();
  const { sport } = useSportContext();

  if (!currentUser) return null;

  const lifecycle = currentUser.userSettings?.lifecycle as Lifecycle;

  const { nickname, profile } = currentUser;
  const { status, clubName, pictureUrl } = profile;

  return (
    <>
      <UploadFile
        name="picture"
        currentFileUrl={pictureUrl}
        onChange={(pic: { file: any }) => setPicture(pic.file)}
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
      {(sport || lifecycle?.lastVisitedSport) === Sport.FOOTBALL && (
        <TextField
          name="clubName"
          maxLength={100}
          label={formatMessage(userAttributes.clubName)}
          defaultValue={clubName}
        />
      )}
      <TextField
        name="status"
        maxLength={100}
        label={formatMessage(userAttributes.status)}
        defaultValue={status || undefined}
      />
      <SwitchField
        name="hideOnlineStatus"
        label={formatMessage(messages.hideOnlineStatusTitle)}
        helperText={formatMessage(messages.hideOnlineStatusDescription)}
        defaultValue={
          !!(currentUser.userSettings.lifecycle as Lifecycle)?.hideOnlineStatus
        }
      />
      <ButtonRow fullWidth={!withinSettings}>
        <SubmitButton small color="blue">
          <FormattedMessage {...glossary.submit} />
        </SubmitButton>
      </ButtonRow>
    </>
  );
};

const UpdateProfile = ({ withinSettings, onSubmit }: Props) => {
  const [picture, setPicture] = useState(null);
  const updateUserProfile = useUpdateUserProfile();
  const { showNotification } = useSnackNotificationContext();
  const { update: updateLifecycle } = useLifecycle();

  const submit = async (
    attributes: any,
    onResult: (result: GraphQLResult) => void
  ) => {
    const { nickname, clubName, status, hideOnlineStatus } = attributes;

    await updateLifecycle(
      LIFECYCLE.hideOnlineStatus,
      hideOnlineStatus === SwitchField.ON
    );

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

  return (
    <Form
      onSubmit={(attributes, onResult) => {
        submit(attributes, onResult);
      }}
      onSuccess={() => {
        onSubmit?.();
      }}
      render={(
        Error: React.ComponentType<React.PropsWithChildren<unknown>>,
        SubmitButton: React.ComponentType<
          React.PropsWithChildren<SubmitButtonProps>
        >
      ) =>
        withinSettings ? (
          <SettingsSection title={messages.title}>
            <Content
              SubmitButton={SubmitButton}
              setPicture={setPicture}
              withinSettings={withinSettings}
            />
          </SettingsSection>
        ) : (
          <Content
            SubmitButton={SubmitButton}
            setPicture={setPicture}
            withinSettings={withinSettings}
          />
        )
      }
    />
  );
};

export default UpdateProfile;

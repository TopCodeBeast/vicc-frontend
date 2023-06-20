import { faRightFromBracket } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title4, Title5 } from '@sorare/core/src/atoms/typography';
import { GraphQLResult, GraphqlForm } from 'components/form/Form';
import DisabledEmailWarning from 'components/user/DisabledEmailWarning';
import { useSnackNotificationContext } from 'contexts/snackNotification';
import { glossary } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

import useLogOutAllDevices from './useLogoutAllDevices';

const messages = defineMessages({
  title: {
    id: 'Settings.logOutAllDevices.title',
    defaultMessage: 'Log out from all devices',
  },
  description: {
    id: 'Settings.logOutAllDevices.description',
    defaultMessage:
      'You will be logged out from all other active sessions besides this one and will have to log back in.',
  },
  dialogSubtitle: {
    id: 'Settings.logOutAllDevices.dialogSubtitle',
    defaultMessage: 'Are you sure you want to log out?',
  },
});

const Container = styled(GraphqlForm)`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  margin-bottom: 0;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    align-items: stretch;
  }
`;
const DialogConfirmationMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
const Icon = styled(FontAwesomeIcon)`
  width: 40px;
  height: 40px;
`;

const LogOutAllDevices = () => {
  const { showNotification } = useSnackNotificationContext();
  const { logOutAllDevices } = useLogOutAllDevices();

  const onSubmit = async (
    attributes: any,
    doOnResult: (result: GraphQLResult) => void
  ) => {
    const { data } = await logOutAllDevices({
      variables: {
        input: {},
      },
    });
    if (data) {
      doOnResult(data.signOutFromAllDevices!);
    }
  };
  return (
    <>
      <DisabledEmailWarning />
      <Container
        onSubmit={(attributes, doOnResult) => {
          onSubmit(attributes, doOnResult);
        }}
        onSuccess={() => {
          showNotification('logOutAllDevices');
        }}
        askForConfirmation
        dialogTitle={
          <Title4>
            <FormattedMessage {...glossary.logOut} />
          </Title4>
        }
        dialogCta={<FormattedMessage {...glossary.logOut} />}
        confirmationMessage={
          <DialogConfirmationMessage>
            <Icon icon={faRightFromBracket} />
            <Title5>
              <FormattedMessage {...messages.dialogSubtitle} />
            </Title5>
          </DialogConfirmationMessage>
        }
        dialogCtaProps={{ stroke: true, color: 'red' }}
        render={(Error, SubmitButton) => (
          <>
            <Text16 bold>
              <FormattedMessage {...messages.title} />
            </Text16>
            <Text16 color="var(--c-neutral-600)">
              <FormattedMessage {...messages.description} />
            </Text16>
            <Error code />
            <div>
              <SubmitButton stroke medium={false} small color="red">
                <FormattedMessage {...glossary.logOut} />
              </SubmitButton>
            </div>
          </>
        )}
      />
    </>
  );
};
export default LogOutAllDevices;

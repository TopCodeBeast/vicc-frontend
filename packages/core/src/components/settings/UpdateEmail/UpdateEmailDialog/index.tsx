import { faEnvelopeOpenText } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import Dialog from '@core/atoms/layout/Dialog';
import { Text16, Title5 } from '@core/atoms/typography';
import Bold from '@core/atoms/typography/Bold';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { glossary } from '@core/lib/glossary';

const messages = defineMessages({
  title: {
    id: 'Settings.updateEmail.dialog.title',
    defaultMessage: 'Change email',
  },
  subtitle: {
    id: 'Settings.updateEmail.dialog.subtitle',
    defaultMessage: 'Verify your new email adress',
  },
  description: {
    id: 'Settings.updateEmail.dialog.description',
    defaultMessage:
      'We’ll need to verify your new email adress <b>{email}</b> in order to change it',
  },
});

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  text-align: center;
  margin-top: 0;
`;
const Icon = styled(FontAwesomeIcon)`
  font-size: 80px;
  color: var(--c-neutral-1000);
  display: inline;
`;

const UpdateEmailDialog = ({
  email,
  onClose,
}: {
  email: string;
  onClose: () => void;
}) => {
  const { up: isTablet } = useScreenSize('tablet');

  return (
    <Dialog
      title={
        <Title5>
          <FormattedMessage {...messages.title} />
        </Title5>
      }
      open
      headerCentered
      onClose={onClose}
      fullScreen={!isTablet}
    >
      <Content>
        <Icon icon={faEnvelopeOpenText} />
        <Title5>
          <FormattedMessage {...messages.subtitle} />
        </Title5>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            {...messages.description}
            values={{
              b: Bold,
              email,
            }}
          />
        </Text16>
        <Button onClick={onClose} color="darkGray" medium fullWidth>
          <FormattedMessage {...glossary.ok} />
        </Button>
      </Content>
    </Dialog>
  );
};

export default UpdateEmailDialog;

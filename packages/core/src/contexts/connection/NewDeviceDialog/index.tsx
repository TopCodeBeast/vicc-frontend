import { faEnvelopeOpenText } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Dialog from '@core/atoms/layout/Dialog';
import { Text16 } from '@core/atoms/typography';
import Bold from '@core/atoms/typography/Bold';
import { useIntlContext } from '@core/contexts/intl';

const messages = defineMessages({
  title: {
    id: 'NewDeviceDialog.title',
    defaultMessage: 'Authorize a New Device',
  },
  description: {
    id: 'NewDeviceDialog.description',
    defaultMessage:
      "It looks like you're signing in to Vicc from a computer or device we haven't seen before.",
  },
  link: {
    id: 'NewDeviceDialog.link',
    defaultMessage:
      'Please <b>click the confirmation link in the email or text</b> we just sent you. This process is only required once per device and protects the security of your account.',
  },
});

type Props = {
  onClose: () => void;
};

const Content = styled.div`
  text-align: center;
`;
const Icon = styled(FontAwesomeIcon)`
  font-size: 80px;
  color: var(--c-brand-600);
  display: inline;
  margin: var(--double-unit) 0;
`;

export const NewDeviceDialog = ({ onClose }: Props) => {
  const { formatMessage } = useIntlContext();

  return (
    <Dialog
      title={formatMessage(messages.title)}
      scroll="body"
      open
      onClose={onClose}
    >
      <Content>
        <Icon icon={faEnvelopeOpenText} />
        <Text16>
          <FormattedMessage {...messages.description} />
        </Text16>
        <br />
        <Text16>
          <FormattedMessage {...messages.link} values={{ b: Bold }} />
        </Text16>
      </Content>
    </Dialog>
  );
};

export default NewDeviceDialog;

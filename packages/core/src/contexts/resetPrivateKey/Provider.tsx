import { ReactNode, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import Dialog from '@core/atoms/layout/Dialog';

import Provider from '.';

const messages = defineMessages({
  title: {
    id: 'ResetPrivateKey.title',
    defaultMessage: 'Your wallet needs to be upgraded',
  },
});

interface Props {
  children: ReactNode;
}

const Message = styled.div`
  margin-bottom: 30px;
  font-size: 15px;
  max-width: 400px;
`;

const ResetPrivateKeyProvider = ({ children }: Props) => {
  const [resetPrivateKey, setResetPrivateKey] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <Provider value={{ resetPrivateKey, setResetPrivateKey }}>
      {children}
      {resetPrivateKey && (
        <Dialog
          open={resetPrivateKey}
          title={formatMessage(messages.title)}
          onClose={() => setResetPrivateKey(false)}
        >
          <Message>
            <FormattedMessage
              id="ResetPrivateKey.message"
              defaultMessage="To continue buying and trading Cards on our platform your wallet needs to be updgraded. During this upgrade an additional private key will be added to your wallet. You will receive an email with the upgrade / recovery instructions. For security reasons it can take up to a day to receive this email."
            />
          </Message>
        </Dialog>
      )}
    </Provider>
  );
};

export default ResetPrivateKeyProvider;

import { defineMessages } from 'react-intl';
import styled from 'styled-components';

import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import WalletPlaceholder from '@sorare/core/src/contexts/wallet/Placeholder';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';

type Props = {
  open: boolean;
  onBack: () => void;
};

const messages = defineMessages({
  title: {
    id: 'PasswordForgottenDialog.passwordForgotten',
    defaultMessage: 'Forgot password',
  },
});

const WalletFrame = styled.div`
  display: flex;
  min-height: 250px;
  & > :first-child {
    display: flex;
    width: 100%;
    min-height: 100%;
  }
`;

export const PasswordForgottenDialog = ({ open, onBack }: Props) => {
  const { formatMessage } = useIntlContext();
  const { up: isTablet } = useScreenSize('tablet');

  return (
    <Dialog
      open={open}
      title={formatMessage(messages.title)}
      onBack={onBack}
      noHeader
      noDivider
      fullScreen={isTablet}
    >
      <WalletFrame>
        <WalletPlaceholder />
      </WalletFrame>
    </Dialog>
  );
};

export default PasswordForgottenDialog;

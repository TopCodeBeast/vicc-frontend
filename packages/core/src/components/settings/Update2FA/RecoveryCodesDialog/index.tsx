import { FormattedMessage, defineMessage } from 'react-intl';

import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import { Title4 } from '@sorare/core/src/atoms/typography';

import RecoveryCodesDialogContent from './RecoveryCodesDialogContent';

const title = defineMessage({
  id: 'Settings.recoveryCodesDialog.title',
  defaultMessage: 'Recovery codes',
});

type Props = {
  onClose: () => void;
  codes: string[];
};

const RecoveryCodesDialog = ({ onClose, codes }: Props) => {
  return (
    <Dialog
      open
      onClose={onClose}
      headerCentered
      title={
        <Title4 color="var(--c-neutral-1000)">
          <FormattedMessage {...title} />
        </Title4>
      }
    >
      <RecoveryCodesDialogContent codes={codes} onClose={onClose} />
    </Dialog>
  );
};

RecoveryCodesDialog.fragments = {};

export default RecoveryCodesDialog;

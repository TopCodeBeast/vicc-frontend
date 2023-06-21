import { useContext } from 'react';
import { useIntl } from 'react-intl';

import { useOneTimeDialogContext } from '@sorare/core/src/contexts/oneTimeDialog';
import { OneTimeDialog } from '@sorare/core/src/contexts/oneTimeDialog/Provider';
import { LIFECYCLE } from '@sorare/core/src/hooks/useLifecycle';

import { CaptainDialog as CaptainDialogDumb } from '@football/components/composeTeam/CaptainDialog';
import Context from '@football/components/so5/ComposeTeam/Context';
import { captainDialogMessages } from '@football/lib/so5';

const CaptainDialog = () => {
  const { sawDialog } = useOneTimeDialogContext();

  const {
    initialLineupCards,
    lineupComplete,
    captain,
    onboarding,
    needCaptain,
    setBenchOpen,
  } = useContext(Context)!;
  const { formatMessage } = useIntl();

  const show =
    needCaptain &&
    !sawDialog(LIFECYCLE.sawCaptainTuto) &&
    !onboarding &&
    initialLineupCards.length <= 0 &&
    captain === null &&
    lineupComplete;

  return (
    <OneTimeDialog dialogId={LIFECYCLE.sawCaptainTuto} show={show}>
      {({ onClose, open }) => (
        <CaptainDialogDumb
          open={open}
          onClose={() => {
            setBenchOpen(false);
            onClose();
          }}
          message={formatMessage(captainDialogMessages.default)}
        />
      )}
    </OneTimeDialog>
  );
};

export default CaptainDialog;

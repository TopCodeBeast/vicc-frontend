import { faCheck } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';

import Context from '@football/components/so5/ComposeTeam/Context';
import ConfirmWarningDialog, {
  useHasWarnings,
} from '@football/components/so5/ComposeTeam/responsive/ConfirmWarningDialog';
import { useFootballEvents } from '@football/lib/events';

const CheckIcon = styled(FontAwesomeIcon).attrs({ icon: faCheck })`
  margin-left: var(--half-unit);
`;

export const ConfirmButton = () => {
  const {
    lineupComplete,
    captain,
    needCaptain,
    submitting,
    submit,
    so5Leaderboard,
  } = useContext(Context)!;
  const track = useFootballEvents();
  const [openConfirmWarningDialog, setOpenConfirmWarningDialog] =
    useState(false);

  const disabled = !lineupComplete || (captain === null && needCaptain);
  const hasWarnings = useHasWarnings();

  const onClick = () => {
    track('Click Confirm Lineup', {
      campaignSlug: so5Leaderboard.commonDraftCampaign?.slug,
      isLogged: true,
      hasWarnings,
    });
    if (hasWarnings) {
      setOpenConfirmWarningDialog(true);
      return;
    }
    submit();
  };

  if (!lineupComplete) return null;

  return (
    <div>
      <ConfirmWarningDialog
        open={openConfirmWarningDialog}
        onContinue={() => {
          submit();
          track('Click Confirm Lineup After Warning', {
            campaignSlug: so5Leaderboard.commonDraftCampaign?.slug,
          });
        }}
        onCancel={() => setOpenConfirmWarningDialog(false)}
      />
      <Button
        color="blue"
        disabled={submitting || disabled}
        onClick={onClick}
        medium
        fullWidth
      >
        <FormattedMessage
          id="So5DesktopComposeLineup.confirm"
          defaultMessage="Confirm {check}"
          values={{
            check: disabled ? <div /> : <CheckIcon />,
          }}
        />
      </Button>
    </div>
  );
};

export default ConfirmButton;

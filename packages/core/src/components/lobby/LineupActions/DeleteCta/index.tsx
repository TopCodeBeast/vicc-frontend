import { faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, useIntl } from 'react-intl';

import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import Tooltip from '@core/atoms/tooltip/Tooltip';
import { Text14 } from '@core/atoms/typography';
import ButtonWithConfirmDialog from '@core/components/form/ButtonWithConfirmDialog';
import { fantasy, glossary } from '@core/lib/glossary';

import { LineupActionCta } from '../LineupActionCta';

type Props = {
  showLoader: boolean;
  onDelete: () => void;
};

export const DeleteCta = ({ showLoader, onDelete }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Tooltip
      title={
        <Text14>
          <FormattedMessage
            id="Lobby.LineupActions.Tooltip.Delete"
            defaultMessage="Delete your lineup"
          />
        </Text14>
      }
      placement="top-end"
    >
      <ButtonWithConfirmDialog
        color="white"
        onConfirm={onDelete}
        message={formatMessage(fantasy.confirmDelete)}
        component={LineupActionCta}
        aria-label={formatMessage(glossary.delete)}
      >
        {showLoader ? (
          <LoadingIndicator smaller />
        ) : (
          <FontAwesomeIcon icon={faTrash} />
        )}
      </ButtonWithConfirmDialog>
    </Tooltip>
  );
};

export default DeleteCta;

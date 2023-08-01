import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessage, useIntl } from 'react-intl';

import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import Tooltip from '@core/atoms/tooltip/Tooltip';
import { Text14 } from '@core/atoms/typography';

import { LineupActionCta } from '../LineupActionCta';

type Props = {
  showLoader: boolean;
  onClick: () => void;
};

const message = defineMessage({
  id: 'Lobby.LineupActions.Tooltip.Confirm',
  defaultMessage: 'Confirm your lineup',
});

export const ConfirmCta = ({ showLoader, onClick }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Tooltip
      title={
        <Text14>
          <FormattedMessage {...message} />
        </Text14>
      }
      placement="top-end"
    >
      <LineupActionCta
        color="white"
        onClick={onClick}
        aria-label={formatMessage(message)}
      >
        {showLoader ? (
          <LoadingIndicator smaller />
        ) : (
          <FontAwesomeIcon icon={faCheck} />
        )}
      </LineupActionCta>
    </Tooltip>
  );
};

export default ConfirmCta;

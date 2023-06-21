import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import Tooltip from '@core/atoms/tooltip/Tooltip';
import { Text14 } from '@core/atoms/typography';

import { LineupActionCta } from '../LineupActionCta';

type Props = {
  onTrack?: () => void;
  editUrl: string;
};

const message = defineMessage({
  id: 'Lobby.LineupActions.Tooltip.Edit',
  defaultMessage: 'Edit your lineup',
});

export const EditCta = ({ onTrack, editUrl }: Props) => {
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
        component={Link}
        to={editUrl}
        onClick={onTrack}
        aria-label={formatMessage(message)}
      >
        <FontAwesomeIcon icon={faPen} />
      </LineupActionCta>
    </Tooltip>
  );
};

export default EditCta;

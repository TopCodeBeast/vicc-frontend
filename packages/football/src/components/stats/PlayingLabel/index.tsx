import { MessageDescriptor, useIntl } from 'react-intl';

import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { playerGameStatusLabels } from '@sorare/core/src/lib/glossary';

const PlayingLabel = ({
  label,
  tooltip,
}: {
  tooltip: MessageDescriptor;
  label: MessageDescriptor;
}) => {
  const { formatMessage } = useIntl();
  return (
    <Tooltip title={formatMessage(tooltip)}>
      <span>{formatMessage(label)}</span>
    </Tooltip>
  );
};

export const NoGameLabel = () => (
  <PlayingLabel
    label={playerGameStatusLabels.no_game_short}
    tooltip={playerGameStatusLabels.no_game}
  />
);

export const DidNotPlayLabel = () => {
  const { formatMessage } = useIntl();
  return (
    <span>{formatMessage(playerGameStatusLabels.did_not_play_short)}</span>
  );
};

export const NotCoveredLabel = () => {
  const { formatMessage } = useIntl();
  return <span>{formatMessage(playerGameStatusLabels.not_covered)}</span>;
};

export const UncertainCoverageLabel = () => {
  const { formatMessage } = useIntl();
  return (
    <span>{formatMessage(playerGameStatusLabels.uncertain_coverage)}</span>
  );
};

export const LowCoverageLabel = () => {
  const { formatMessage } = useIntl();
  return <span>{formatMessage(playerGameStatusLabels.low_coverage)}</span>;
};

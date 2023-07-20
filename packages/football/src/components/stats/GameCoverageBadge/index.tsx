import { FormattedMessage } from 'react-intl';

import { GameCoverageStatus } from '@sorare/core/src/__generated__/globalTypes';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Tag, StyleProps as TagProps } from '@sorare/core/src/atoms/ui/Tag';
import { playerGameStatusLabels } from '@sorare/core/src/lib/glossary';

import {
  LowCoverageLabel,
  NotCoveredLabel,
  UncertainCoverageLabel,
} from '@football/components/stats/PlayingLabel';

export const GameCoverageBadge = ({
  coverageStatus,
  ...rest
}: {
  coverageStatus: GameCoverageStatus;
} & TagProps) => {
  if (coverageStatus === GameCoverageStatus.FULL) return null;
  if (coverageStatus === GameCoverageStatus.UNCERTAIN)
    return (
      <Tooltip
        placement="bottom"
        enterTouchDelay={0}
        title={
          <FormattedMessage
            {...playerGameStatusLabels.uncertain_coverage_detail}
          />
        }
      >
        <Tag color="grey" {...rest}>
          <UncertainCoverageLabel />
        </Tag>
      </Tooltip>
    );
  if (coverageStatus === GameCoverageStatus.LOW)
    return (
      <Tooltip
        placement="bottom"
        enterTouchDelay={0}
        title={
          <FormattedMessage {...playerGameStatusLabels.low_coverage_detail} />
        }
      >
        <Tag color="grey" {...rest}>
          <LowCoverageLabel />
        </Tag>
      </Tooltip>
    );
  return (
    <Tag color="grey" {...rest}>
      <NotCoveredLabel />
    </Tag>
  );
};

export default GameCoverageBadge;

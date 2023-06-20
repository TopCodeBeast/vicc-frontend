import { faHourglassStart } from '@fortawesome/pro-solid-svg-icons';
import {
  FormattedMessage,
  FormattedNumber,
  MessageDescriptor,
  defineMessages,
  useIntl,
} from 'react-intl';
import styled from 'styled-components';

import { Clock } from '@sorare/core/src/atoms/icons/Clock';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Chip } from '@sorare/core/src/atoms/ui/Chip';
import { playerGameStatusLabels } from '@sorare/core/src/lib/glossary';
import { Color } from '@sorare/core/src/style/types';

import { DidNotPlayLabel, NoGameLabel } from '@sorare/football/src/components/stats/PlayingLabel';
import { PlayerScoreStatus } from 'lib/so5';

export type Props = {
  score?: number | null;
  size?: 'small' | 'smaller';
  status?: PlayerScoreStatus | null;
  showReviewing?: boolean;
  tooltipTitle?: MessageDescriptor;
  capped?: boolean;
};

const TooltipTitle = styled.div`
  text-align: center;
  font-weight: var(--t-bold);
`;

const messages = defineMessages({
  title: {
    id: 'PlayerScore.title',
    defaultMessage: 'Score',
  },
  [PlayerScoreStatus.REVIEWING]: {
    id: 'PlayerGame.UnderReview',
    defaultMessage: 'Score{br}Waiting for review',
    values: { br: <br /> },
  },
  [PlayerScoreStatus.DID_NOT_PLAY]: {
    id: 'PlayerScore.didNotPlay',
    defaultMessage: 'Did not play',
  },
  [PlayerScoreStatus.PENDING]: {
    id: 'PlayerScore.pending',
    defaultMessage: 'Match not yet started',
  },
});

export const thresholds = [
  [14.5, 'veryLow'],
  [29.5, 'low'],
  [44.5, 'mediumLow'],
  [59.5, 'medium'],
  [74.5, 'mediumHigh'],
];

export const THRESHOLD_COLORS: { [key: string]: Color } = {
  veryLow: 'var(--c-score-veryLow)',
  low: 'var(--c-score-low)',
  mediumLow: 'var(--c-score-mediumLow)',
  medium: 'var(--c-score-medium)',
  mediumHigh: 'var(--c-score-mediumHigh)',
  high: 'var(--c-score-high)',
};

export const findThreshold = (score: number) => {
  const threshold = thresholds.find(t => t[0] > score);

  return threshold ? threshold[1] : 'high';
};

export const useGetLabel = (
  score: number | null | undefined,
  status: PlayerScoreStatus | null | undefined
) => {
  const { formatMessage } = useIntl();
  const didNotPlay = status === PlayerScoreStatus.DID_NOT_PLAY;
  const pending = status === PlayerScoreStatus.PENDING;
  const noGame = status === PlayerScoreStatus.NO_GAME;

  if (pending) {
    return <Clock title={formatMessage(playerGameStatusLabels.pending)} />;
  }
  if (noGame) {
    return <NoGameLabel />;
  }
  if (didNotPlay) {
    return <DidNotPlayLabel />;
  }
  if (typeof score === 'number') {
    return <FormattedNumber value={score} maximumFractionDigits={0} />;
  }
  return null;
};

export const PlayerScore = (props: Props) => {
  const {
    score,
    size,
    showReviewing = false,
    status,
    tooltipTitle,
    capped,
  } = props;

  const threshold = typeof score === 'number' && findThreshold(score);
  const reviewing = showReviewing && status === PlayerScoreStatus.REVIEWING;
  const didNotPlay = status === PlayerScoreStatus.DID_NOT_PLAY;
  const pending = status === PlayerScoreStatus.PENDING;
  const noGame = status === PlayerScoreStatus.NO_GAME;

  const getCustomChipColors = () => {
    if (capped) {
      return {
        background: 'var(--c-brand-600)',
        color: 'var(--c-static-neutral-100)',
      };
    }
    if (threshold) {
      return {
        background: THRESHOLD_COLORS[threshold],
        color: 'var(--c-static-neutral-1000)',
      };
    }
    if (noGame) {
      return {
        background: 'var(--c-score-veryLow)',
        color: 'var(--c-static-neutral-1000)',
      };
    }
    if (pending) {
      return {
        background: 'var(--c-neutral-200)',
        color: 'var(--c-static-neutral-500)',
      };
    }
    return {
      background: 'var(--c-neutral-400)',
      color: 'var(--c-neutral-1000)',
    };
  };

  return (
    <Tooltip
      arrow
      placement="bottom"
      enterTouchDelay={0}
      title={
        <TooltipTitle>
          <FormattedMessage
            {...(tooltipTitle ||
              messages[reviewing || didNotPlay || pending ? status : 'title'])}
          />
        </TooltipTitle>
      }
    >
      <Chip
        custom={{
          ...getCustomChipColors(),
        }}
        size={size}
        label={useGetLabel(score, status)}
        iconLeft={Icon => {
          if (reviewing) {
            return <Icon icon={faHourglassStart} />;
          }
          return null;
        }}
      />
    </Tooltip>
  );
};

export default PlayerScore;

import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import { PlayerScoreMode } from '@sorare/core/src/lib/players';

import PlayerScore, {
  Props as PlayerScoreProps,
} from '@sorare/football/src/components/stats/PlayerScore';
import { PlayerScoreStatus } from 'lib/so5';

const messages = defineMessages<PlayerScoreMode>({
  AVERAGE_LAST_5_GAMES: {
    id: 'AverageScore.lastFiveAverageScore',
    defaultMessage: 'Average score over the last 5 games',
  },
  AVERAGE_LAST_15_GAMES: {
    id: 'AverageScore.lastFifteenSo5AverageScore',
    defaultMessage: 'Average score over the last 15 games',
  },
  LATEST_SCORE: {
    id: 'AverageScore.latestScore',
    defaultMessage: 'Lastest Score',
  },
});

type Props = {
  score?: number | null;
  percentageScore?: number | string;
  size?: PlayerScoreProps['size'];
  scoreMode?: PlayerScoreMode;
  withTooltip?: boolean;
  capped?: boolean;
};
const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Label = styled(Root)`
  padding: var(--half-unit);
  background: var(--c-neutral-200);
  border-radius: 8px;
`;
export const AverageScore = (props: Props) => {
  const {
    scoreMode,
    withTooltip,
    size,
    score,
    percentageScore = 0,
    capped,
  } = props;
  const status = score ? null : PlayerScoreStatus.DID_NOT_PLAY;

  const Wrapper = withTooltip ? Root : Label;

  return (
    <Wrapper>
      {scoreMode && !withTooltip && (
        <Text16>
          <FormattedMessage {...messages[scoreMode]} />
        </Text16>
      )}
      <PlayerScore
        size={size}
        status={status}
        score={score ? Math.round(score) : undefined}
        tooltipTitle={
          scoreMode && withTooltip && score ? messages[scoreMode] : undefined
        }
        capped={capped}
      />
      {percentageScore !== 0 && (
        <Caption color="var(--c-neutral-600)">{percentageScore}%</Caption>
      )}
    </Wrapper>
  );
};

export default AverageScore;

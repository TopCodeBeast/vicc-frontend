import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';

type Props = {
  player: {
    displayName: string;
  };
};

const messages = defineMessages({
  scoreFrom: {
    id: 'GamingArena.PlayerPerformance.scoreFromPrefix',
    defaultMessage: 'Score from',
  },
  representativeScoreDetails: {
    id: 'GamingArena.PlayerPerformance.representativeScoreDetails',
    defaultMessage:
      'Legends take the score of the best-scoring player in their team and position.',
  },
});

const Root = styled.div`
  display: flex;
  gap: var(--half-unit);
  color: var(--c-neutral-600);
  align-items: center;
`;
const StyledTooltip = styled.div`
  max-width: 170px;
`;

const ScoreFrom = ({ player }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Root>
      <Text16>
        <FormattedMessage {...messages.scoreFrom} />
      </Text16>
      <Text16 color="var(--c-neutral-1000)"> {player.displayName}</Text16>
      <Tooltip
        title={
          <StyledTooltip>
            <Caption color="var(--c-neutral-600)">
              {formatMessage(messages.representativeScoreDetails)}
            </Caption>
          </StyledTooltip>
        }
        placement="top"
      >
        <span role="img">
          <FontAwesomeIcon icon={faInfoCircle} />
        </span>
      </Tooltip>
    </Root>
  );
};

export default ScoreFrom;

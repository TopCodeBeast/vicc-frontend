import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Jersey } from '@sorare/core/src/atoms/icons/Jersey';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import { glossary } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';
import { stroke } from '@sorare/core/src/style/utils';

import { LiveDot } from '@sorare/football/src/components/so5/LiveDot';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radius.sm}px;
  width: calc(6 * var(--unit));
  height: calc(6 * var(--unit));
  background: var(--c-neutral-400);
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--c-neutral-100);
  display: flex;
  border-radius: ${theme.radius.sm}px;
  border: 3px solid var(--c-neutral-100);
  &.upcoming {
    color: var(--c-brand-300);
    border: unset;
    border-radius: unset;
    background: unset;
    ${stroke('2px', 'var(--c-neutral-100)')}
  }
`;

const GW = styled(Caption).attrs({ bold: true })`
  color: var(--c-neutral-600);
  margin-bottom: calc(-1 * var(--half-unit));
`;

export type Props = {
  gameWeek: number;
  type: 'past' | 'live' | 'upcoming';
};

const GameWeekLabel = ({ gameWeek, type }: Props) => {
  return (
    <Wrapper>
      <GW>
        <FormattedMessage {...glossary.gw} />
      </GW>
      <Text16 color="var(--c-neutral-1000)" bold>
        {gameWeek}
      </Text16>
      <IconWrapper className={type}>
        {type === 'past' && (
          <FontAwesomeIcon
            icon={faCheckCircle}
            color="var(--c-static-green-300)"
          />
        )}
        {type === 'live' && <LiveDot animate size="xl" />}
        {type === 'upcoming' && <Jersey />}
      </IconWrapper>
    </Wrapper>
  );
};

export default GameWeekLabel;

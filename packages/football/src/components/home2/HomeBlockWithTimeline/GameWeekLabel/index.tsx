import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Jersey } from '@sorare/core/src/atoms/icons/Jersey';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import { glossary } from '@sorare/core/src/lib/glossary';
import { stroke } from '@sorare/core/src/style/utils';

import { LiveDot } from '@football/components/so5/LiveDot';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--intermediate-unit);
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
  border-radius: var(--intermediate-unit);
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

const parseFixtureShortDisplayName = (fixtureShortDisplayName?: string) => {
  const words = fixtureShortDisplayName?.split(' ');

  if (words?.length === 2) return words; // Don't use the short display name if it's not in two words

  return [];
};

export type Props = {
  gameWeek: number;
  type: 'past' | 'live' | 'upcoming';
  fixtureShortDisplayName?: string;
};

const GameWeekLabel = ({ gameWeek, type, fixtureShortDisplayName }: Props) => {
  const words = parseFixtureShortDisplayName(fixtureShortDisplayName);

  return (
    <Wrapper>
      <GW>{words[0] || <FormattedMessage {...glossary.gw} />}</GW>
      <Text16 color="var(--c-neutral-1000)" bold>
        {words[1] || gameWeek}
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

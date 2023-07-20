import { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { AnimatedDiamond } from '@sorare/core/src/atoms/animations/AnimatedDiamond';
import { Progress } from '@sorare/core/src/atoms/loader/Progress';
import { Text14, Title6 } from '@sorare/core/src/atoms/typography';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: baseline;
`;

const Title = styled(Title6)`
  color: var(--c-neutral-1000);
  flex: 1;
`;

const RemainingPointsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: baseline;
  padding: 0 var(--unit) 0 var(--triple-unit);
  border-radius: var(--double-unit);
  background: var(--c-neutral-300);
`;

const DiamondWrapper = styled.div`
  position: absolute;
  left: calc(-1 * var(--half-unit));
`;

const ProgressStyled = styled(Progress)<{ $error: boolean }>`
  margin-top: var(--unit);
  height: var(--half-unit);
  &::-webkit-progress-bar {
    background: repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.3) 3px,
      rgba(255, 255, 255, 0.25) 3px,
      rgba(255, 255, 255, 0.25) 3.7px
    );
    ${props => props.$error && `background: var(--c-red-600);`};
  }
  &::-webkit-progress-value {
    background-color: var(--c-brand-600);
  }
`;

const AvgPerOpenPositionRow = styled.div`
  display: flex;
  align-items: baseline;
`;
const AvgPerOpenPositionLabel = styled(Text14)`
  color: var(--c-neutral-600);
  flex: 1;
`;

export type Props = {
  cap: number;
  used: number;
  nbEmptySlots: number;
};

export const CapBar = ({ cap, used, nbEmptySlots }: Props) => {
  const diamondRef = useRef<AnimatedDiamond>(null);
  const error = used > cap;

  useEffect(() => {
    if (error) {
      diamondRef.current?.shake();
    } else {
      diamondRef.current?.turn();
    }
  }, [error, used]);

  const averagePointsRemaining =
    nbEmptySlots === 0 || nbEmptySlots === undefined
      ? 0
      : Math.max(0, cap - used) / nbEmptySlots;

  return (
    <Wrapper>
      <TitleContainer>
        <Title>
          <FormattedMessage
            id="Football.CapBar.title"
            defaultMessage="Remaining points"
          />
        </Title>
        <RemainingPointsContainer>
          <Text14
            bold
            color={error ? 'var(--c-red-600)' : 'var(--c-neutral-1000)'}
          >
            {cap - used}
          </Text14>
          <Text14 color="var(--c-neutral-600)">/{cap}</Text14>
          <DiamondWrapper>
            <AnimatedDiamond size={24} ref={diamondRef} />
          </DiamondWrapper>
        </RemainingPointsContainer>
      </TitleContainer>
      <ProgressStyled min={0} max={cap} value={cap - used} $error={error} />
      <AvgPerOpenPositionRow>
        <AvgPerOpenPositionLabel>
          <FormattedMessage
            id="FootBall.CapBar.AvgPerOpenPosition"
            defaultMessage="Average per open position ({nbEmptySlots})"
            values={{
              nbEmptySlots,
            }}
          />
        </AvgPerOpenPositionLabel>
        <Text14 color="var(--c-neutral-600)" bold>
          {Math.floor(averagePointsRemaining)}
        </Text14>
      </AvgPerOpenPositionRow>
    </Wrapper>
  );
};

export default CapBar;

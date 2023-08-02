import classnames from 'classnames';
import { useEffect, useRef } from 'react';
import { animated } from '@react-spring/web';
import styled from 'styled-components';

import { AnimatedDiamond } from '@sorare/core/src/atoms/animations/AnimatedDiamond';
import { Text14 } from '@sorare/core/src/atoms/typography';

const Root = styled.div`
  position: relative;
  display: inline-flex;
  isolation: isolate;
  padding: 0 var(--unit) 0 var(--triple-unit);
  border-radius: var(--quadruple-unit);
  background-color: var(--c-neutral-300);
  &.negative {
    background-color: var(--c-red-600);
  }
`;
const RemainingPoints = styled(animated.span)`
  margin: 0;
  color: var(--c-neutral-1000);
  font: var(--t-14);
  font-style: italic;
  font-weight: var(--t-bold);
  &.animateDiamond {
    animation: slide 0.2s ease;
    @keyframes slide {
      0% {
        transform: translateX(0);
        opacity: 1;
      }
      50% {
        transform: translateX(-40%);
        opacity: 0;
      }
      80% {
        transform: translateX(30%);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }
  }
`;

const DiamondWrapper = styled.div`
  position: absolute;
  z-index: 2;
  left: calc(var(--half-unit) * -1);
  top: 50%;
  transform: translateY(-50%);
`;

type Props = {
  remainingPoints: number;
  budget: number;
};
export const Budget = ({ remainingPoints, budget }: Props) => {
  const animatedDiamondRef = useRef<AnimatedDiamond>(null);
  const isNegative = remainingPoints < 0;

  useEffect(() => {
    setTimeout(() => {
      if (isNegative) {
        animatedDiamondRef.current?.shake();
      } else {
        animatedDiamondRef.current?.turn();
      }
    });
  }, [isNegative]);

  return (
    <Root className={classnames({ negative: isNegative })}>
      <DiamondWrapper>
        <AnimatedDiamond ref={animatedDiamondRef} size={24} />
      </DiamondWrapper>
      <RemainingPoints>{remainingPoints}</RemainingPoints>
      <Text14 as="span">/{budget}</Text14>
    </Root>
  );
};

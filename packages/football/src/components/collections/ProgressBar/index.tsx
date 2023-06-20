import classnames from 'classnames';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDebounce } from 'react-use';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { fantasy } from '@sorare/core/src/lib/glossary';

import { Score } from '@sorare/football/src/components/collections/Score';
import completed from '@sorare/football/src/components/collections/assets/completed.svg';

const scores = [
  { value: 35, bonus: '+1%' },
  { value: 100, bonus: '+2%' },
  { value: 250, bonus: '+3%' },
  { value: 500, bonus: '+4%' },
  { value: 750, bonus: '+5%' },
];
const getProgress = (score: number) => {
  const scoresValue = scores.map(({ value }) => value);
  const lastIndex = scoresValue.length - 1;
  const closestStep = Math.max(
    0,
    score > scoresValue[lastIndex]
      ? lastIndex
      : scoresValue.findIndex(x => score <= x)
  );
  const delta = score - (scoresValue[closestStep - 1] || 0);
  const maxDelta =
    scoresValue[closestStep] - (scoresValue[closestStep - 1] || 0);
  const stepLength = 100 / scoresValue.length;

  return Math.min(
    stepLength * closestStep + (delta / maxDelta) * stepLength,
    100
  );
};

const DURATION = 1;
const DOT_SIZE = 13;
const Root = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5px;
  margin: var(--triple-unit) var(--double-unit) var(--triple-unit) 0;
  color: var(--c-static-neutral-600);
  &:before {
    position: absolute;
    z-index: 0;
    top: 0;
    right: ${DOT_SIZE / 2}px;
    bottom: 0;
    left: 0;
    background: currentcolor;
    border-radius: 2em;
    content: '';
  }
`;
const Bar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 2em;
  background: var(--c-green-600);
  width: calc(100% - ${DOT_SIZE / 2}px);
  height: 100%;
  transform-origin: left center;
  transform: scaleX(0);
  transition-timing-function: ease-in-out;
  transition-property: transform;
`;
const Completed = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: block;
  width: 100px;
  height: 100px;
  background: url(${completed});
  background-position: 0 0;
  transition: background-position 1s steps(28);
  transition-duration: 0;
  transition-delay: ${DURATION}s;
  &.active {
    transition-duration: 1s;
    background-position: -2800px 0;
  }
`;
const StepContainer = styled.div`
  position: relative;
`;
const Top = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  bottom: 100%;
  color: var(--c-static-neutral-100);
  &.left {
    transform: none;
    left: 0;
  }
`;
const Bottom = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  top: 100%;
  &.left {
    transform: none;
    left: 0;
  }
`;
const Step = styled.div`
  position: relative;
  width: ${DOT_SIZE}px;
  height: ${DOT_SIZE}px;
  border-radius: 50%;
  background-color: var(--c-static-neutral-600);
  transition: 0.1s ease background-color;
  &.completed {
    background-color: var(--c-green-600);
  }
  &.hide {
    opacity: 0;
  }
  &.hideLastStep {
    background-color: transparent;
  }
`;

type Props = {
  disableAnimation?: boolean;
  score?: number;
  showLabel?: boolean;
};
const ProgressBar = ({
  disableAnimation = false,
  score = scores[scores.length - 1].value,
  showLabel = false,
}: Props) => {
  const progress = getProgress(score);
  const [debouncedProgress, setDebouncedProgress] = useState(
    disableAnimation ? progress : 0
  );
  const completedSteps = scores.filter(
    (_, i) => ((i + 1) / scores.length) * 100 <= debouncedProgress
  );

  useDebounce(() => setDebouncedProgress(progress), 0, [progress]);

  return (
    <Root>
      <Bar
        style={{
          transform: `scaleX(${debouncedProgress}%)`,
          borderRadius: `${50 / debouncedProgress}% / 100%`,
          transitionDuration: disableAnimation ? 'none' : `${DURATION}s`,
        }}
      />
      <StepContainer>
        {showLabel && (
          <Top className="left">
            <Text16 bold color="var(--c-static-neutral-100)">
              <FormattedMessage
                id="collections.ProgressBar.score"
                defaultMessage="Score"
              />
            </Text16>
          </Top>
        )}
        <Step className={classnames('hide')} />
        {showLabel && (
          <Bottom className="left">
            <Text16
              color={
                score > 0 ? 'var(--c-green-600)' : 'var(--c-static-neutral-100)'
              }
              bold
            >
              <FormattedMessage {...fantasy.bonus} />
            </Text16>
          </Bottom>
        )}
      </StepContainer>
      {scores.map(({ value, bonus }, i) => {
        const isLastScore = i === scores.length - 1;
        const isCompleted = !!completedSteps[i];

        return (
          <StepContainer key={value}>
            {showLabel && (
              <Top>
                <Score score={value} suffix={isLastScore ? '+' : null} />
              </Top>
            )}
            <Step
              className={classnames({
                completed: isCompleted,
                hideLastStep: !disableAnimation && i + 1 === scores.length,
              })}
              style={{
                transitionDelay: disableAnimation
                  ? 'none'
                  : `${
                      (DURATION /
                        Math.ceil((scores.length * debouncedProgress) / 100)) *
                      (i + 1)
                    }s`,
                transitionDuration: disableAnimation ? 'none' : `.3s`,
              }}
            >
              {i >= scores.length - 1 && !disableAnimation && (
                <Completed
                  className={classnames({ active: debouncedProgress === 100 })}
                />
              )}
            </Step>
            {showLabel && (
              <Bottom>
                <Text16
                  color={
                    isCompleted
                      ? 'var(--c-green-600)'
                      : 'var(--c-static-neutral-100)'
                  }
                  bold
                >
                  {bonus}
                </Text16>
              </Bottom>
            )}
          </StepContainer>
        );
      })}
    </Root>
  );
};
export default ProgressBar;

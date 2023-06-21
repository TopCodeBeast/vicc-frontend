import { gql } from '@apollo/client';
import classnames from 'classnames';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDebounce } from 'react-use';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import Lightning from '@sorare/core/src/atoms/icons/Lightning';
import { text14, text16 } from '@sorare/core/src/atoms/typography';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { fantasy } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

import completed from '@football/components/collections/assets/completed.svg';

import { ClubIcon } from './ClubIcon';
import { ProgressBar_cardCollection } from './__generated__/index.graphql';

const progressScores = [
  { value: 0, bonus: '-' },
  { value: 35, bonus: '+1%' },
  { value: 100, bonus: '+2%' },
  { value: 250, bonus: '+3%' },
  { value: 500, bonus: '+4%' },
  { value: 750, bonus: '+5%' },
];

export const iconScores: Partial<Record<Rarity, { value: number }>> = {
  [Rarity.limited]: { value: 400 },
  [Rarity.rare]: { value: 300 },
  [Rarity.super_rare]: { value: 200 },
  [Rarity.unique]: { value: 80 },
};

const getProgress = (
  score: number,
  scores: { value: number; bonus?: string }[]
) => {
  const stepLength = 100 / (scores.length - 1);
  const scoreValues = scores.map(({ value }) => value);
  const lastIndex = scoreValues.length - 1;
  const closestNextStep =
    score > scoreValues[lastIndex]
      ? lastIndex
      : scoreValues.findIndex(x => score <= x);
  const closestPreviousStep = closestNextStep === 0 ? 0 : closestNextStep - 1;
  const delta = score - scoreValues[closestPreviousStep];
  const maxDelta =
    scoreValues[closestNextStep] - scoreValues[closestPreviousStep] || 1;

  return Math.min(stepLength * (closestPreviousStep + delta / maxDelta), 100);
};

const insertIconScoreIntoProgressScores = (iconScore: {
  value: number;
}): { value: number; bonus?: string }[] => {
  let index = 0;
  for (let i = 1; i < progressScores.length; i += 1) {
    if (iconScore.value > progressScores[i].value) {
      index = i + 1;
    }
  }

  return [
    ...progressScores.slice(0, index),
    iconScore,
    ...progressScores.slice(index),
  ];
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
  &.extraMargin {
    margin: calc(6 * var(--unit)) var(--double-unit) calc(6 * var(--unit)) 0;
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
  display: flex;
  gap: var(--half-unit);
  align-items: center;
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
const Text = styled.div`
  ${text14};
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    ${text16};
  }
`;
const BoldText = styled(Text)`
  font-weight: var(--t-bold);
`;
const LightningWrapper = styled.span`
  width: var(--intermediate-unit);
  display: flex;
  justify-content: center;
`;
const ScoreLabel = styled.div`
  position: absolute;
  left: 0;
  top: calc(-6 * var(--unit));
  color: var(--c-static-neutral-100);
`;
const BonusLabel = styled.div`
  position: absolute;
  left: 0;
  top: var(--triple-unit);
  color: var(--c-static-neutral-600);
`;

type Props = {
  disableAnimation?: boolean;
  score?: number;
  showLabel?: boolean;
  cardCollection?: ProgressBar_cardCollection;
};
const ProgressBar = ({
  disableAnimation = false,
  score = progressScores[progressScores.length - 1].value,
  showLabel = false,
  cardCollection,
}: Props) => {
  const {
    flags: { useCollectionClubBadge = false },
  } = useFeatureFlags();
  const { rarity, team } = cardCollection || {};
  const clubIconUrl = team?.pictureUrl;
  const iconScore = rarity && iconScores[rarity];
  const scores =
    iconScore && clubIconUrl && useCollectionClubBadge
      ? insertIconScoreIntoProgressScores(iconScore)
      : progressScores;

  const progress = getProgress(score, scores);
  const [debouncedProgress, setDebouncedProgress] = useState(
    disableAnimation ? progress : 0
  );
  const completedSteps =
    score === 0
      ? []
      : scores.filter(
          (_, i) => (i / (scores.length - 1)) * 100 <= debouncedProgress
        );

  useDebounce(() => setDebouncedProgress(progress), 0, [progress]);

  return (
    <Root className={classnames({ extraMargin: showLabel })}>
      <Bar
        style={{
          transform: `scaleX(${debouncedProgress}%)`,
          borderRadius: `${50 / debouncedProgress}% / 100%`,
          transitionDuration: disableAnimation ? 'none' : `${DURATION}s`,
        }}
      />
      {showLabel && (
        <>
          <ScoreLabel>
            <BoldText>
              <FormattedMessage {...fantasy.score} />
            </BoldText>
          </ScoreLabel>
          <BonusLabel>
            <BoldText>
              <FormattedMessage {...fantasy.bonus} />
            </BoldText>
          </BonusLabel>
        </>
      )}
      {scores.map(({ value, bonus }, i) => {
        const isLastScore = i === scores.length - 1;
        const isCompleted = !!completedSteps[i];

        return (
          <StepContainer key={value}>
            <Top className={classnames({ left: i === 0 })}>
              <BoldText>
                {value}
                {isLastScore && '+'}
              </BoldText>
              <LightningWrapper>
                <Lightning />
              </LightningWrapper>
            </Top>
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
            <Bottom className={classnames({ left: i === 0 })}>
              <Text
                as="div"
                color={
                  isCompleted
                    ? 'var(--c-green-600)'
                    : 'var(--c-static-neutral-100)'
                }
                bold
              >
                {bonus || (
                  <ClubIcon
                    clubIconUrl={clubIconUrl || ''}
                    isCompleted={isCompleted}
                    alt={team?.name || ''}
                  />
                )}
              </Text>
            </Bottom>
          </StepContainer>
        );
      })}
    </Root>
  );
};
ProgressBar.fragments = {
  cardCollection: gql`
    fragment ProgressBar_cardCollection on CardCollection {
      slug
      rarity
      team {
        ... on TeamInterface {
          slug
          name
          pictureUrl
        }
      }
    }
  `,
};

export default ProgressBar;

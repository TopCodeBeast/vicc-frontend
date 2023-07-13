import { ReactNode } from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';

import { Text14, Text16 } from '@core/atoms/typography';
import Container from '@core/components/onboarding/managerTask/Container';
import { LearnCompetitionsOnboardingStep } from '@core/contexts/managerTask';
import { glossary } from '@core/lib/glossary';

const learnCompetitionsTaskTitles =
  defineMessages<LearnCompetitionsOnboardingStep>({
    [LearnCompetitionsOnboardingStep.menu]: {
      id: 'LearnCompetitionsTaskTitles.menu',
      defaultMessage: 'Competition Schedule',
    },
    [LearnCompetitionsOnboardingStep.lobby]: {
      id: 'LearnCompetitionsTaskTitles.lobby',
      defaultMessage: 'Scarcity & Competitions',
    },
    [LearnCompetitionsOnboardingStep.lobby_pro]: {
      id: 'LearnCompetitionsTaskTitles.lobby_pro',
      defaultMessage: 'Advance to Semi-Pro',
    },
    [LearnCompetitionsOnboardingStep.rewards]: {
      id: 'LearnCompetitionsTaskTitles.rewards',
      defaultMessage: 'Win amazing rewards',
    },
    [LearnCompetitionsOnboardingStep.requirements]: {
      id: 'LearnCompetitionsTaskTitles.requirements',
      defaultMessage: 'Unlock Semi-Pro',
    },
  });

const learnCompetitionsTaskDescription =
  defineMessages<LearnCompetitionsOnboardingStep>({
    [LearnCompetitionsOnboardingStep.menu]: {
      id: 'LearnCompetitionsTaskDescription.menu',
      defaultMessage:
        'Compete in our bi-weekly Competition schedule called “Game Weeks”. Each Game Week (GW) spans a 3-4 day cycle. ',
    },
    [LearnCompetitionsOnboardingStep.lobby]: {
      id: 'LearnCompetitionsTaskDescription.lobby',
      defaultMessage:
        'Each Competition has specific entry requirements. Higher card scarcities unlock new Competitions with amazing prize pools.',
    },
    [LearnCompetitionsOnboardingStep.lobby_pro]: {
      id: 'LearnCompetitionsTaskDescription.lobby_pro',
      defaultMessage:
        'You already submitted your Amateur Draft team. When you are ready for your next challenge, you can join the Semi-Pro Competition.',
    },
    [LearnCompetitionsOnboardingStep.rewards]: {
      id: 'LearnCompetitionsTaskDescription.rewards',
      defaultMessage:
        'The upgraded rewards available in Semi-Pro help strengthen your squad as you build towards unlocking future competitions.',
    },
    [LearnCompetitionsOnboardingStep.requirements]: {
      id: 'LearnCompetitionsTaskDescription.requirements',
      defaultMessage:
        "Entry requirements for each Competition are shared in the 'Details' page.",
    },
  });

const learnCompetitionsTaskTip: Partial<
  Record<LearnCompetitionsOnboardingStep, MessageDescriptor>
> = defineMessages({
  [LearnCompetitionsOnboardingStep.menu]: {
    id: 'learnCompetitionsTaskTip.menu',
    defaultMessage:
      "Explore Competitions in an upcoming GW by selecting 'See All' or visiting the 'Play' menu.",
  },
  [LearnCompetitionsOnboardingStep.lobby_pro]: {
    id: 'learnCompetitionsTaskTip.lobby_pro',
    defaultMessage:
      'Your next level is {competitionName}. You can check the Competition details by clicking on Unlock.',
  },
});

const learnCompetitionsTaskCta = defineMessages({
  [LearnCompetitionsOnboardingStep.requirements]: {
    id: 'learnCompetitionsTaskCta.requirements',
    defaultMessage: 'Thanks for the training!',
  },
});

const LearnCompetitionsOnboardingTask = ({
  name,
  title = learnCompetitionsTaskTitles[name],
  tip,
  messageValues,
  onClick,
}: {
  title?: MessageDescriptor;
  name: LearnCompetitionsOnboardingStep;
  content?: ReactNode;
  tip?: ReactNode;
  messageValues?: Partial<Record<'competitionName', ReactNode>>;
  onClick: () => void;
}) => {
  const buttonLabel =
    name === LearnCompetitionsOnboardingStep.requirements
      ? learnCompetitionsTaskCta[name]
      : glossary.continue;
  const steps = Object.values(LearnCompetitionsOnboardingStep);

  return (
    <Container
      current={steps.findIndex(key => key === name) + 1}
      total={steps.length}
      onClick={onClick}
      labels={{ title, button: buttonLabel }}
    >
      <Text16 color="var(--c-neutral-600)">
        <FormattedMessage
          {...learnCompetitionsTaskDescription[name]}
          values={messageValues}
        />
      </Text16>
      {learnCompetitionsTaskTip[name] ? (
        <Text14 color="var(--c-yellow-800)">
          <span>🌟 </span>
          <FormattedMessage
            {...learnCompetitionsTaskTip[name]}
            values={messageValues}
          />
        </Text14>
      ) : (
        tip
      )}
    </Container>
  );
};

export default LearnCompetitionsOnboardingTask;

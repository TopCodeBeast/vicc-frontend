import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';

import { AnimatedDiamond } from '@sorare/core/src/atoms/animations/AnimatedDiamond';
import { withFragments } from '@sorare/core/src/lib/gql';

import { RuleHelperFnReturnType } from '@football/components/so5/Rules/types';

const messages = defineMessages({
  default: {
    id: 'Rules.sumOfAverageScores',
    defaultMessage:
      "Sum of player's average score in their last 15 games must remain below <b>{value}</b>.",
  },
  title: {
    id: 'Rules.sumOfAverageScores.title',
    defaultMessage: 'Eligibility',
  },
  label: {
    id: 'Rules.sumOfAverageScores.label',
    defaultMessage: '{value} points cap',
  },
  description: {
    id: 'Rules.sumOfAverageScores.description',
    defaultMessage:
      "Sum of player's average score in their last 15 games must remain below {value}",
  },
});

const getSumOfAverageScoresRule = withFragments(
  (rule: number | null, error: string): RuleHelperFnReturnType => {
    if (!rule) {
      return [];
    }
    return {
      id: 'sumOfAverageScores',
      defaultMessage: messages.default,
      error,
      values: {
        value: rule,
      },
      title: messages.title,
      icon: <AnimatedDiamond size={28} />,
      label: (
        <FormattedMessage
          {...messages.label}
          values={{
            value: rule,
          }}
        />
      ),
      description: (
        <FormattedMessage
          {...messages.description}
          values={{
            value: rule,
          }}
        />
      ),
    };
  },
  {
    rule: gql`
      fragment GetSumOfAverageScoresRule on Vicc5Leaderboard {
        slug
        displayedRules {
          id
          sumOfAverageScores
        }
      }
    `,
  }
);

export default getSumOfAverageScoresRule;

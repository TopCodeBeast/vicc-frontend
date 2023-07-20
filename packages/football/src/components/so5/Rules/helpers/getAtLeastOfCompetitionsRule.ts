import { gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import { GetAtLeastOfCompetitionsRule } from './__generated__/getAtLeastOfCompetitionsRule.graphql';

type GetAtLeastOfCompetitionsRule_displayedRules_atLeastOfCompetitions =
  NonNullable<
    NonNullable<
      GetAtLeastOfCompetitionsRule['displayedRules']
    >['atLeastOfCompetitions']
  >;

const defaultMessage = defineMessage({
  id: 'Rules.atLeastOfCompetitions',
  defaultMessage:
    'At least {min, plural, one {# player} other {# players}} playing in <b>{competitions}</b>',
});

const getAtLeastOfCompetitionsRule = withFragments(
  (
    rule: GetAtLeastOfCompetitionsRule_displayedRules_atLeastOfCompetitions | null,
    error: string
  ) => {
    if (!rule) {
      return [];
    }
    return {
      id: 'atLeastOfCompetitions',
      defaultMessage,
      error,
      values: {
        min: rule.min,
        competitions: rule.competitions
          .map(({ displayName }) => displayName)
          .join(', '),
      },
    };
  },
  {
    rule: gql`
      fragment GetAtLeastOfCompetitionsRule on Vicc5Leaderboard {
        slug
        displayedRules {
          id
          atLeastOfCompetitions {
            min
            competitions {
              slug
              displayName
            }
          }
        }
      }
    `,
  }
);

export default getAtLeastOfCompetitionsRule;

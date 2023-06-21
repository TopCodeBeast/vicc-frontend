import { gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import { GetAtLeastOfClubsRule } from './__generated__/getAtLeastOfClubsRule.graphql';

type GetAtLeastOfClubsRule_displayedRules_atLeastOfClubs = NonNullable<
  NonNullable<GetAtLeastOfClubsRule['displayedRules']>['atLeastOfClubs']
>;

const defaultMessage = defineMessage({
  id: 'Rules.atLeastOfClubs',
  defaultMessage:
    'At least {min, plural, one {# player} other {# players}} playing for <b>{clubs}</b>',
});

const getAtLeastOfClubsRule = withFragments(
  (
    rule: GetAtLeastOfClubsRule_displayedRules_atLeastOfClubs | null,
    error: string
  ) => {
    if (!rule) {
      return [];
    }
    return {
      id: 'atLeastOfClubs',
      defaultMessage,
      error,
      values: {
        min: rule.min,
        clubs: rule.clubs.map(({ name }) => name).join(', '),
      },
    };
  },
  {
    rule: gql`
      fragment GetAtLeastOfClubsRule on So5Leaderboard {
        slug
        displayedRules {
          id
          atLeastOfClubs {
            min
            clubs {
              slug
              name
            }
          }
        }
      }
    `,
  }
);

export default getAtLeastOfClubsRule;

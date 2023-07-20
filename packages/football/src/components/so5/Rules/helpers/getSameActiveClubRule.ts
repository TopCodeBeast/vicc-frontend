import { gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import { GetSameActiveClubRule } from './__generated__/getSameActiveClubRule.graphql';

type GetSameActiveClubRule_displayedRules_sameActiveClub = NonNullable<
  NonNullable<GetSameActiveClubRule['displayedRules']>['sameActiveClub']
>;

const defaultMessage = defineMessage({
  id: 'Rules.SameActiveClubRule',
  defaultMessage:
    '<b>{display, select, minAndMax {Minimum {min} and Maximum {max}} minOnly {Minimum {min}} other {Maximum {max}}}</b> players allowed from the same team',
});

const getSameActiveClubRule = withFragments(
  (
    rule: GetSameActiveClubRule_displayedRules_sameActiveClub | null,
    error: string
  ) => {
    const { min, max } = rule || {};
    if (!min && !max) return [];
    const displayMinAndMax = min && max ? 'minAndMax' : 'maxOnly';
    return {
      id: 'sameActiveClubs',
      defaultMessage,
      error,
      values: {
        display: min && !max ? 'minOnly' : displayMinAndMax,
        min,
        max,
      },
    };
  },
  {
    rule: gql`
      fragment GetSameActiveClubRule on Vicc5Leaderboard {
        slug
        displayedRules {
          id
          sameActiveClub {
            min
            max
          }
        }
      }
    `,
  }
);

export default getSameActiveClubRule;

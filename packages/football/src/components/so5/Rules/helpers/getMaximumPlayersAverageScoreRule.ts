import { gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { AveragePlayerScore } from '@sorare/core/src/__generated__/globalTypes';
import { withFragments } from '@sorare/core/src/lib/gql';

import { GetMaximumPlayersAverageScoreRule } from './__generated__/getMaximumPlayersAverageScoreRule.graphql';

type GetMaximumPlayersAverageScoreRule_displayedRules_maximumPlayersAverageScore =
  NonNullable<
    NonNullable<
      GetMaximumPlayersAverageScoreRule['displayedRules']
    >['maximumPlayersAverageScore']
  >;

const defaultMessage = defineMessage({
  id: 'Rules.maximumPlayersAverageScore',
  defaultMessage:
    '<b>Maximum {count, plural, one {# player} other {# players}}</b> with an average <b>{condition, select, between {between {min} and {max}} greaterThan {of {min} or above} other {of {max} or below}}</b> in the last <b>{games} games</b>',
});

type Rule =
  GetMaximumPlayersAverageScoreRule_displayedRules_maximumPlayersAverageScore | null;
const getMaximumPlayersAverageScoreRule = withFragments(
  (rule: Rule, error: string) => {
    if (!rule) {
      return [];
    }
    const { min, max, count, averageType } = rule!;
    const uniqueCondition = min ? 'greaterThan' : 'lessThan';
    const condition = min && max ? 'between' : uniqueCondition;
    return {
      id: 'maximumPlayersAverageScore',
      defaultMessage,
      error,
      values: {
        count,
        min,
        max,
        games:
          averageType === AveragePlayerScore.LAST_FIVE_SO5_AVERAGE_SCORE
            ? 5
            : 15,
        condition,
      },
    };
  },
  {
    rule: gql`
      fragment GetMaximumPlayersAverageScoreRule on Vicc5Leaderboard {
        slug
        displayedRules {
          id
          maximumPlayersAverageScore {
            averageType
            count
            min
            max
          }
        }
      }
    `,
  }
);

export default getMaximumPlayersAverageScoreRule;

import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { AveragePlayerScore } from '@sorare/core/src/__generated__/globalTypes';
import { withFragments } from '@sorare/core/src/lib/gql';

import { GetMinimumPlayersAverageScoreRule } from './__generated__/getMinimumPlayersAverageScoreRule.graphql';

type GetMinimumPlayersAverageScoreRule_displayedRules_minimumPlayersAverageScore =
  NonNullable<
    NonNullable<
      GetMinimumPlayersAverageScoreRule['displayedRules']
    >['minimumPlayersAverageScore']
  >;

const defaultMessage = defineMessage({
  id: 'Rules.minimumPlayersAverageScore',
  defaultMessage:
    '<b>Minimum {count, plural, one {# player} other {# players}}</b> with an average <b>{condition, select, between {between {min} and {max}} greaterThan {of {min} or above} other {of {max} or below}}</b> in the last <b>{games} games</b>',
});

type Rule =
  GetMinimumPlayersAverageScoreRule_displayedRules_minimumPlayersAverageScore | null;
const getAverageScoreRule = withFragments(
  (rule: Rule, error: string) => {
    if (!rule) {
      return [];
    }
    const { min, max, count, averageType } = rule!;
    const uniqueCondition = min ? 'greaterThan' : 'lessThan';
    const condition = min && max ? 'between' : uniqueCondition;
    return {
      id: 'minimumPlayersAverageScore',
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
      fragment GetMinimumPlayersAverageScoreRule on So5Leaderboard {
        slug
        displayedRules {
          id
          minimumPlayersAverageScore {
            averageType
            count
            min
            max
          }
        }
      }
    ` as TypedDocumentNode<GetMinimumPlayersAverageScoreRule>,
  }
);

export default getAverageScoreRule;

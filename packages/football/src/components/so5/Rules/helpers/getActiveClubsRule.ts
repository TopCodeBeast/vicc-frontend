import { gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import { GetActiveClubsRule } from './__generated__/getActiveClubsRule.graphql';

type GetActiveClubsRule_displayedRules_activeClubs = NonNullable<
  NonNullable<GetActiveClubsRule['displayedRules']>['activeClubs']
>[number];

const defaultMessage = defineMessage({
  id: 'Rules.activeClubs',
  defaultMessage: 'Allowed current player clubs: <b>{value}</b>',
});

const getActiveClubsRule = withFragments(
  (
    rule: GetActiveClubsRule_displayedRules_activeClubs[] | null,
    error: string
  ) => {
    if (!rule?.length) {
      return [];
    }
    return {
      id: 'activeClubs',
      defaultMessage,
      error,
      values: {
        value: rule.map(({ name }) => name).join(', '),
      },
    };
  },
  {
    rule: gql`
      fragment GetActiveClubsRule on Vicc5Leaderboard {
        slug
        displayedRules {
          id
          activeClubs {
            slug
            name
          }
        }
      }
    `,
  }
);

export default getActiveClubsRule;

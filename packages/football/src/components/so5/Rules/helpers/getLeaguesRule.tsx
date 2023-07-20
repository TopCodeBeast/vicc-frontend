import { gql } from '@apollo/client';
import { defineMessages } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import coverage from 'assets/lobby/coverage.png';

import { GetLeaguesRule } from './__generated__/getLeaguesRule.graphql';

type GetLeaguesRule_displayedRules_leagues = NonNullable<
  NonNullable<GetLeaguesRule['displayedRules']>['leagues']
>[number];

const messages = defineMessages({
  default: {
    id: 'Rules.leagues',
    defaultMessage: 'Allowed leagues: <b>{value}</b>',
  },
  title: {
    id: 'Rules.leagues.title',
    defaultMessage: 'Coverage',
  },
});

const getLeaguesRule = withFragments(
  (rule: GetLeaguesRule_displayedRules_leagues[] | null, error: string) => {
    if (!rule?.length) {
      return [];
    }
    return {
      id: 'leagues',
      defaultMessage: messages.default,
      error,
      values: {
        value: rule.map(({ displayName }) => displayName).join(', '),
      },
      title: messages.title,
      icon: <img src={coverage} alt="" width={28} height={28} />,
      label: rule.map(({ displayName }) => displayName).join(', '),
    };
  },
  {
    rule: gql`
      fragment GetLeaguesRule on Vicc5Leaderboard {
        slug
        displayedRules {
          id
          leagues {
            slug
            displayName
          }
        }
      }
    `,
  }
);

export default getLeaguesRule;

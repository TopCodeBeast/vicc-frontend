import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import { RuleHelperFnReturnType } from '@football/components/so5/Rules/types';

import { GetSeasonsRule } from './__generated__/getSeasonsRule.graphql';

type GetSeasonsRule_displayedRules_seasons = NonNullable<
  NonNullable<GetSeasonsRule['displayedRules']>['seasons']
>[number];

const defaultMessage = defineMessage({
  id: 'Rules.seasons',
  defaultMessage: 'Cards of season: <b>{value}</b>',
});

const getSeasonsRule = withFragments(
  (
    rule: GetSeasonsRule_displayedRules_seasons[] | null,
    error: string
  ): RuleHelperFnReturnType => {
    if (!rule?.length) {
      return [];
    }
    return {
      id: 'seasons',
      defaultMessage,
      error,
      values: {
        value: rule.map(({ name }) => name).join(', '),
      },
    };
  },
  {
    rule: gql`
      fragment GetSeasonsRule on So5Leaderboard {
        slug
        displayedRules {
          id
          seasons {
            startYear
            name
          }
        }
      }
    ` as TypedDocumentNode<GetSeasonsRule>,
  }
);

export default getSeasonsRule;

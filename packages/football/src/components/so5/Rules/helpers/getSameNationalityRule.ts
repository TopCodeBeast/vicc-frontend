import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import { GetSameNationalityRule } from './__generated__/getSameNationalityRule.graphql';

const defaultMessage = defineMessage({
  id: 'Rules.sameNationality',
  defaultMessage: 'Same nationality for all players',
});

const getSameNationalityRule = withFragments(
  (rule: boolean | null, error: string) => {
    if (!rule) {
      return [];
    }
    return {
      id: 'sameNationality',
      defaultMessage,
      error,
      values: {
        value: rule,
      },
    };
  },
  {
    rule: gql`
      fragment GetSameNationalityRule on So5Leaderboard {
        slug
        displayedRules {
          id
          sameNationality
        }
      }
    ` as TypedDocumentNode<GetSameNationalityRule>,
  }
);

export default getSameNationalityRule;

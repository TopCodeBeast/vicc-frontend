import { gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';
import { toDisplayName } from '@sorare/core/src/lib/territories';

import { GetNationalitiesRule } from './__generated__/getNationalitiesRule.graphql';

type GetNationalitiesRule_displayedRules_nationalities = NonNullable<
  NonNullable<GetNationalitiesRule['displayedRules']>['nationalities']
>[number];

export const countryList = (countries: { slug: string }[]) =>
  countries.map(n => toDisplayName(n.slug)).join(', ');

const defaultMessage = defineMessage({
  id: 'Rules.nationalities',
  defaultMessage: 'Players of nationality: <b>{value}</b>',
});

const getNationalitiesRule = withFragments(
  (
    rule: GetNationalitiesRule_displayedRules_nationalities[] | null,
    error: string
  ) => {
    if (!rule?.length) {
      return [];
    }
    return {
      id: 'nationalities',
      defaultMessage,
      error,
      values: { value: countryList(rule || []) },
    };
  },
  {
    rule: gql`
      fragment GetNationalitiesRule on So5Leaderboard {
        slug
        displayedRules {
          id
          nationalities {
            slug
          }
        }
      }
    `,
  }
);

export default getNationalitiesRule;

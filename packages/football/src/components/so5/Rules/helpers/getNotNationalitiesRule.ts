import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';
import { toDisplayName } from '@sorare/core/src/lib/territories';

import { GetNotNationalitiesRule } from './__generated__/getNotNationalitiesRule.graphql';

type GetNotNationalitiesRule_displayedRules_notNationalities = NonNullable<
  NonNullable<GetNotNationalitiesRule['displayedRules']>['notNationalities']
>[number];

export const countryList = (countries: { slug: string }[]) =>
  countries.map(n => toDisplayName(n.slug)).join(', ');

const defaultMessage = defineMessage({
  id: 'Rules.notNationalities',
  defaultMessage: 'Players with nationality other than: <b>{value}</b>',
});

const getNotNationalitiesRule = withFragments(
  (
    rule: GetNotNationalitiesRule_displayedRules_notNationalities[] | null,
    error: string
  ) => {
    if (!rule?.length) {
      return [];
    }
    return {
      id: 'notNationalities',
      defaultMessage,
      error,
      values: { value: countryList(rule || []) },
    };
  },
  {
    rule: gql`
      fragment GetNotNationalitiesRule on So5Leaderboard {
        slug
        displayedRules {
          id
          notNationalities {
            slug
          }
        }
      }
    ` as TypedDocumentNode<GetNotNationalitiesRule>,
  }
);

export default getNotNationalitiesRule;

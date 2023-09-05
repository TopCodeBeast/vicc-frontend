import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import { GetInternationalCompetitionsRule } from './__generated__/getInternationalCompetitionsRule.graphql';

type GetInternationalCompetitionsRule_displayedRules_internationalCompetitions =
  NonNullable<
    NonNullable<
      GetInternationalCompetitionsRule['displayedRules']
    >['internationalCompetitions']
  >[number];

const defaultMessage = defineMessage({
  id: 'Rules.internationalCompetitions',
  defaultMessage: 'Allowed competitions: <b>{value}</b>',
});

const getCompetitionsRule = withFragments(
  (
    rule:
      | GetInternationalCompetitionsRule_displayedRules_internationalCompetitions[]
      | null,
    error: string
  ) => {
    if (!rule?.length) {
      return [];
    }
    return {
      id: 'internationalCompetitions',
      defaultMessage,
      error,
      values: {
        value: rule.map(({ displayName }) => displayName).join(', '),
      },
    };
  },
  {
    rule: gql`
      fragment GetInternationalCompetitionsRule on Vicc5Leaderboard {
        slug
        displayedRules {
          id
          internationalCompetitions {
            slug
            displayName
          }
        }
      }
    ` as TypedDocumentNode<GetInternationalCompetitionsRule>,
  }
);

export default getCompetitionsRule;

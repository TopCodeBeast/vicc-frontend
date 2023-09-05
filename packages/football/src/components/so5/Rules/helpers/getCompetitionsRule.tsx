import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessages } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import coverage from '@football/assets/lobby/coverage.png';
import { FormatRule } from '@football/components/so5/Rules/types';

import { GetCompetitionsRule } from './__generated__/getCompetitionsRule.graphql';

type GetCompetitionsRule_displayedRules_competitions = NonNullable<
  NonNullable<GetCompetitionsRule['displayedRules']>['competitions']
>[number];

const messages = defineMessages({
  default: {
    id: 'Rules.competitions',
    defaultMessage: 'Allowed competitions: <b>{value}</b>',
  },
  title: {
    id: 'Rules.competitions.title',
    defaultMessage: 'Coverage',
  },
});

const getCompetitionsRule = withFragments(
  (
    rule: GetCompetitionsRule_displayedRules_competitions[] | null,
    error: string
  ): FormatRule | FormatRule[] => {
    if (!rule?.length) {
      return [];
    }
    return {
      id: 'competitions',
      defaultMessage: messages.default,
      error,
      values: {
        value: rule.map(({ displayName }) => displayName).join(', '),
      },
      title: messages.title,
      icon: <img src={coverage} alt="" width={28} height={28} />,
      label: rule.map(({ displayName }) => displayName).join(', '),
    } as any; //TODO
  },
  {
    rule: gql`
      fragment GetCompetitionsRule on Vicc5Leaderboard {
        slug
        displayedRules {
          id
          competitions {
            slug
            displayName
          }
        }
      }
    ` as TypedDocumentNode<GetCompetitionsRule>,
  }
);

export default getCompetitionsRule;

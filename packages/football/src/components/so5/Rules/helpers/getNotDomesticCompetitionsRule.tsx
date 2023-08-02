import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import restrictedLeagues from 'assets/lobby/restricted_leagues.png';
import { RuleHelperFnReturnType } from '@football/components/so5/Rules/types';

import { GetNotDomesticCompetitionsRule } from './__generated__/getNotDomesticCompetitionsRule.graphql';

type GetNotDomesticCompetitionsRule_displayedRules_notDomesticCompetitions =
  NonNullable<
    NonNullable<
      GetNotDomesticCompetitionsRule['displayedRules']
    >['notDomesticCompetitions']
  >[number];

const messages = defineMessages({
  default: {
    id: 'Rules.notDomesticCompetitions',
    defaultMessage: 'Player from competitions other than: <b>{value}</b>',
  },
  title: {
    id: 'Rules.notDomesticCompetitions.title',
    defaultMessage: 'Restricted Leagues',
  },
  description: {
    id: 'Rules.notDomesticCompetitions.description',
    defaultMessage:
      'Player Cards from these leagues are not eligible to join the competition',
  },
});

const getNotDomesticCompetitionsRule = withFragments(
  (
    rule:
      | GetNotDomesticCompetitionsRule_displayedRules_notDomesticCompetitions[]
      | null,
    error: string
  ): RuleHelperFnReturnType => {
    if (!rule?.length) {
      return [];
    }
    return {
      id: 'notDomesticCompetitions',
      defaultMessage: messages.default,
      error,
      values: {
        value: rule.map(({ displayName }) => displayName).join(', '),
      },
      title: messages.title,
      icon: (
        <img
          src={restrictedLeagues}
          alt="Restricted Leagues"
          width={28}
          height={28}
        />
      ),
      label: rule.map(({ displayName }) => displayName).join(', '),
      description: <FormattedMessage {...messages.description} />,
    };
  },
  {
    rule: gql`
      fragment GetNotDomesticCompetitionsRule on So5Leaderboard {
        slug
        displayedRules {
          id
          notDomesticCompetitions {
            slug
            displayName
          }
        }
      }
    ` as TypedDocumentNode<GetNotDomesticCompetitionsRule>,
  }
);

export default getNotDomesticCompetitionsRule;

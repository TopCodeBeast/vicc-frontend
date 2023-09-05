import { TypedDocumentNode, gql } from '@apollo/client';

import { BlockchainScarcity } from '@sorare/core/src/lib/cards';
import { withFragments } from '@sorare/core/src/lib/gql';

import { Errors } from '@football/components/so5/ComposeTeam/Context';
import { getErrorFrom } from '@football/components/so5/Rules/formatRules';
import { ELIGIBILITY_RULES } from '@football/lib/so5';

import { formatEligibilityRules_vicc5Leaderboard } from './__generated__/formatEligibilityRules.graphql';
import { GetCardsCountOfCurrentUserRule } from './helpers/__generated__/getCardsCountOfCurrentUserRule.graphql';
import getCardsCountOfCurrentUserRule from './helpers/getCardsCountOfCurrentUserRule';

type GetCardsCountOfCurrentUserRule_rules =
  GetCardsCountOfCurrentUserRule['displayedRules'];

type FormatEligibilityRules = {
  id: string;
  defaultMessage?: { id: string; defaultMessage: string };
  error: string;
  values?: Record<string, any>;
  scarcity: Nullable<BlockchainScarcity>;
};

export const formatEligibilityRules = withFragments(
  (rules: GetCardsCountOfCurrentUserRule_rules, errors: Errors) => {
    if (!rules) {
      return [];
    }
    return ELIGIBILITY_RULES.flatMap(
      (rule): FormatEligibilityRules | FormatEligibilityRules[] | [] => {
        const error = getErrorFrom(errors, rule);
        switch (rule) {
          case 'cardsCountOfCurrentUser':
            return getCardsCountOfCurrentUserRule(rules[rule], error);
          default:
            return [];
        }
      }
    );
  },
  {
    vicc5Leaderboard: gql`
      fragment formatEligibilityRules_vicc5Leaderboard on Vicc5Leaderboard {
        slug
        ...GetCardsCountOfCurrentUserRule
      }
      ${getCardsCountOfCurrentUserRule.fragments.rule}
    ` as TypedDocumentNode<formatEligibilityRules_vicc5Leaderboard>,
  }
);

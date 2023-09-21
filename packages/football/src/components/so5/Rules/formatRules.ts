import { TypedDocumentNode, gql } from '@apollo/client';
import { IntlShape } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import { Errors } from '@football/components/so5/ComposeTeam/Context';
import { HANDLED_RULES } from '@football/lib/so5';

import { formatRules_vicc5Leaderboard } from './__generated__/formatRules.graphql';
import { Rules_vicc5Leaderboard } from './__generated__/index.graphql';
import {
  getActiveClubsRule,
  getAgeRule,
  getAllowLegend,
  getAtLeastOfClubsRule,
  getAtLeastOfCompetitionsRule,
  getCaptainRule,
  getCardEditionsCountRule,
  getCompetitionsRule,
  getInternationalCompetitionsRule,
  getLeaguesRule,
  getMaximumPlayersAverageScoreRule,
  getMinimumPlayersAverageScoreRule,
  getNationalitiesRule,
  getNotDomesticCompetitionsRule,
  getNotNationalitiesRule,
  getRarityLimitsRule,
  getSameActiveClubRule,
  getSameNationalityRule,
  getSeasonsRule,
  getSerialNumberRule,
} from './helpers';
import getCardBonusRule from './helpers/getCardBonusRule';
import getSumOfAverageScoresRule from './helpers/getSumOfAverageScoresRule';
import { FormatRule } from './types';

export function getErrorFrom(errors: Errors, id: string) {
  if (!errors) {
    return '';
  }
  return (
    errors
      ?.filter(({ path }) => path?.[1].toLowerCase() === id.toLowerCase())
      .map(({ message }) => message)[0] || ''
  );
}

export const formatRules = withFragments(
  (vicc5Leaderboard: Rules_vicc5Leaderboard, errors: Errors, intl: IntlShape) => {
    const { displayedRules, engineConfiguration } = vicc5Leaderboard || {};
    if (!displayedRules) {
      return [];
    }
    return [
      ...HANDLED_RULES.flatMap((rule): FormatRule | FormatRule[] => {
        const error = getErrorFrom(errors, rule);
        switch (rule) {
          case 'seasons':
            return getSeasonsRule(displayedRules[rule], error);
          case 'leagues':
            return getLeaguesRule(displayedRules[rule], error);
          case 'competitions':
            return getCompetitionsRule(displayedRules[rule], error);
          case 'internationalCompetitions':
            return getInternationalCompetitionsRule(
              displayedRules[rule],
              error
            );
          case 'notDomesticCompetitions':
            return getNotDomesticCompetitionsRule(displayedRules[rule], error);
          case 'activeClubs':
            return getActiveClubsRule(displayedRules[rule], error);
          case 'sameNationality':
            return getSameNationalityRule(displayedRules[rule], error);
          case 'serialNumber':
            return getSerialNumberRule(displayedRules[rule], error);
          case 'nationalities':
            return getNationalitiesRule(displayedRules[rule], error);
          case 'notNationalities':
            return getNotNationalitiesRule(displayedRules[rule], error);
          case 'atLeastOfCompetitions':
            return getAtLeastOfCompetitionsRule(displayedRules[rule], error);
          case 'atLeastOfClubs':
            return getAtLeastOfClubsRule(displayedRules[rule], error);
          case 'age':
            return getAgeRule(displayedRules[rule], error, intl);
          case 'captainRarities':
            return getCaptainRule(
              displayedRules[rule],
              error,
              engineConfiguration
            );
          case 'sameActiveClub':
            return getSameActiveClubRule(displayedRules[rule], error);
          case 'minimumPlayersAverageScore':
            return getMinimumPlayersAverageScoreRule(
              displayedRules[rule],
              error
            );
          case 'maximumPlayersAverageScore':
            return getMaximumPlayersAverageScoreRule(
              displayedRules[rule],
              error
            );
          case 'rarityLimits':
            return getRarityLimitsRule(
              displayedRules[rule],
              error || getErrorFrom(errors, 'Scarcity'),
              engineConfiguration
            );
          case 'allowLegend':
            return getAllowLegend(!!displayedRules[rule], error);
          case 'cardEditionsCount': {
            return getCardEditionsCountRule(
              displayedRules.cardEditionsCount,
              error
            );
          }
          case 'sumOfAverageScores':
            return getSumOfAverageScoresRule(displayedRules[rule], error);
          default:
            return [];
        }
      }),
      ...getCardBonusRule(vicc5Leaderboard),
    ].filter(Boolean);
  },
  {
    vicc5Leaderboard: gql`
      fragment formatRules_vicc5Leaderboard on Vicc5Leaderboard {
        slug
        ...GetSeasonsRule
        ...GetLeaguesRule
        ...GetCompetitionsRule
        ...GetInternationalCompetitionsRule
        ...GetNotDomesticCompetitionsRule
        ...GetActiveClubsRule
        ...GetSameNationalityRule
        ...GetSerialNumberRule
        ...GetNationalitiesRule
        ...GetNotNationalitiesRule
        ...GetAtLeastOfCompetitionsRule
        ...GetAtLeastOfClubsRule
        ...GetAgeRule
        ...GetCaptainRule
        ...GetSameActiveClubRule
        ...GetMinimumPlayersAverageScoreRule
        ...GetMaximumPlayersAverageScoreRule
        ...GetRarityLimitsRule
        ...GetCardEditionsCountRule
        ...GetAllowLegendRule
        ...GetSumOfAverageScoresRule
        ...getCardBonusRule_vicc5Leaderboard
      }
      ${getSeasonsRule.fragments.rule}
      ${getLeaguesRule.fragments.rule}
      ${getCompetitionsRule.fragments.rule}
      ${getInternationalCompetitionsRule.fragments.rule}
      ${getNotDomesticCompetitionsRule.fragments.rule}
      ${getActiveClubsRule.fragments.rule}
      ${getSameNationalityRule.fragments.rule}
      ${getSerialNumberRule.fragments.rule}
      ${getNationalitiesRule.fragments.rule}
      ${getNotNationalitiesRule.fragments.rule}
      ${getAtLeastOfCompetitionsRule.fragments.rule}
      ${getAtLeastOfClubsRule.fragments.rule}
      ${getAgeRule.fragments.rule}
      ${getCaptainRule.fragments.rule}
      ${getSameActiveClubRule.fragments.rule}
      ${getMinimumPlayersAverageScoreRule.fragments.rule}
      ${getMaximumPlayersAverageScoreRule.fragments.rule}
      ${getRarityLimitsRule.fragments.rule}
      ${getCardEditionsCountRule.fragments.rule}
      ${getAllowLegend.fragments.rule}
      ${getSumOfAverageScoresRule.fragments.rule}
      ${getCardBonusRule.fragments.vicc5Leaderboard}
    ` as TypedDocumentNode<formatRules_vicc5Leaderboard>,
  }
);

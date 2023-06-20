import { defineMessages } from 'react-intl';

import { StatCategory } from '@sorare/core/src/__generated__/globalTypes';

const ALL_AROUND_STAT_CATEGORIES = [
  StatCategory.GENERAL,
  StatCategory.DEFENDING,
  StatCategory.POSSESSION,
  StatCategory.PASSING,
  StatCategory.ATTACKING,
  StatCategory.GOALKEEPING,
] as const;

export type AllAroundStatCategory = (typeof ALL_AROUND_STAT_CATEGORIES)[number];

export interface Stat {
  stat: string;
  category: StatCategory;
  statValue: number;
  totalScore: number;
}

export function splitScore(allAroundStats: Stat[]) {
  const stats = Object.fromEntries(
    ALL_AROUND_STAT_CATEGORIES.map((c): [AllAroundStatCategory, Stat[]] => [
      c,
      [],
    ])
  ) as { [key in AllAroundStatCategory]: Stat[] };

  allAroundStats.forEach(stat => {
    if (
      ALL_AROUND_STAT_CATEGORIES.includes(
        stat.category as AllAroundStatCategory
      )
    ) {
      stats[stat.category as AllAroundStatCategory].push(stat);
    }
  });

  const categoryScores = Object.entries(stats).reduce<{
    [key in AllAroundStatCategory]: number;
  }>((categories, [cat, catStats]) => {
    const score = catStats.reduce(
      (totalScore, catStat) => totalScore + catStat.totalScore,
      0
    );

    categories[cat as AllAroundStatCategory] = score;

    return categories;
  }, {} as any);

  return {
    categoryScores,
  };
}

export const categoryLabels = defineMessages({
  GENERAL: {
    id: 'DetailedScoreV4.general',
    defaultMessage: 'general',
  },
  DEFENDING: {
    id: 'DetailedScoreV4.defending',
    defaultMessage: 'defending',
  },
  POSSESSION: {
    id: 'DetailedScoreV4.possession',
    defaultMessage: 'possession',
  },
  PASSING: {
    id: 'DetailedScoreV4.passing',
    defaultMessage: 'passing',
  },
  ATTACKING: {
    id: 'DetailedScoreV4.attacking',
    defaultMessage: 'attacking',
  },
  GOALKEEPING: {
    id: 'DetailedScoreV4.goalkeeping',
    defaultMessage: 'goalkeeping',
  },
});

export const statLabels = defineMessages({
  goals: { id: 'So5Stat.goals', defaultMessage: 'goal' },
  goal_assist: { id: 'So5Stat.goal_assist', defaultMessage: 'goal assist' },
  mins_played: { id: 'So5Stat.mins_played', defaultMessage: 'mins played' },
  total_pass: { id: 'So5Stat.total_pass', defaultMessage: 'total pass' },
  accurate_pass: {
    id: 'So5Stat.accurate_pass',
    defaultMessage: 'accurate pass',
  },
  yellow_card: { id: 'So5Stat.yellow_card', defaultMessage: 'yellow card' },
  red_card: { id: 'So5Stat.red_card', defaultMessage: 'red card' },
  clean_sheet: { id: 'So5Stat.clean_sheet', defaultMessage: 'clean sheet' },
  ontarget_scoring_att: {
    id: 'So5Stat.ontarget_scoring_att',
    defaultMessage: 'shot on goal',
  },
  adjusted_ontarget_scoring_att: {
    id: 'So5Stat.adjusted_ontarget_scoring_att',
    defaultMessage: 'shot on goal',
  },
  blocked_scoring_att: {
    id: 'So5Stat.blocked_scoring_att',
    defaultMessage: 'blocked shot',
  },
  total_tackle: { id: 'So5Stat.total_tackle', defaultMessage: 'total tackle' },
  parries: { id: 'So5Stat.parries', defaultMessage: 'parry' },
  was_fouled: { id: 'So5Stat.was_fouled', defaultMessage: 'was fouled' },
  penalty_kick_missed: {
    id: 'So5Stat.penalty_kick_missed',
    defaultMessage: 'penalty kick missed',
  },
  fouls: { id: 'So5Stat.fouls', defaultMessage: 'foul' },
  penalty_save: {
    id: 'So5Stat.penalties_saved',
    defaultMessage: 'penalty saved',
  },
  own_goals: { id: 'So5Stat.own_goals', defaultMessage: 'own goal' },
  total_scoring_att: {
    id: 'So5Stat.total_scoring_att',
    defaultMessage: 'total scoring attempt',
  },
  lost_corners: { id: 'So5Stat.lost_corners', defaultMessage: 'lost corner' },
  goals_conceded: {
    id: 'So5Stat.goals_conceded',
    defaultMessage: 'goal conceded',
  },
  three_goals_conceded: {
    id: 'So5Stat.three_goals_conceded',
    defaultMessage: '3 goals conceded',
  },
  saves: { id: 'So5Stat.saves', defaultMessage: 'saves' },
  goal_kicks: { id: 'So5Stat.goal_kicks', defaultMessage: 'goal kick' },
  game_started: { id: 'So5Stat.game_started', defaultMessage: 'game started' },
  total_clearance: {
    id: 'So5Stat.total_clearance',
    defaultMessage: 'total clearance',
  },
  formation_place: {
    id: 'So5Stat.formation_place',
    defaultMessage: 'formation place',
  },
  single_goal_game: {
    id: 'So5Stat.single_goal_game',
    defaultMessage: 'single goal game',
  },
  error_lead_to_goal: {
    id: 'So5Stat.error_lead_to_goal',
    defaultMessage: 'error lead to goal',
  },
  error_lead_to_shot: {
    id: 'So5Stat.error_lead_to_shot',
    defaultMessage: 'error leading to shot',
  },
  clean_sheet_60: {
    id: 'So5Stat.clean_sheet_60',
    defaultMessage: 'clean sheet',
  },
  outfielder_block: {
    id: 'So5Stat.outfielder_block',
    defaultMessage: 'outfielder block',
  },
  blocked_cross: {
    id: 'So5Stat.blocked_cross',
    defaultMessage: 'blocked cross',
  },
  last_man_tackle: {
    id: 'So5Stat.last_man_tackle',
    defaultMessage: 'last man tackle',
  },
  interception_won: {
    id: 'So5Stat.interception_won',
    defaultMessage: 'interception won',
  },
  clearance_off_line: {
    id: 'So5Stat.clearance_off_line',
    defaultMessage: 'clearance off line',
  },
  effective_clearance: {
    id: 'So5Stat.effective_clearance',
    defaultMessage: 'effective clearance',
  },
  won_tackle: { id: 'So5Stat.won_tackle', defaultMessage: 'won tackle' },
  lost_tackle: { id: 'So5Stat.lost_tackle', defaultMessage: 'lost tackle' },
  touches: { id: 'So5Stat.touches', defaultMessage: 'touches' },
  poss_won: { id: 'So5Stat.poss_won', defaultMessage: 'possession won' },
  poss_lost_ctrl: {
    id: 'So5Stat.poss_lost_ctrl',
    defaultMessage: 'possession lost',
  },
  duel_won: { id: 'So5Stat.duel_won', defaultMessage: 'duel won' },
  duel_lost: { id: 'So5Stat.duel_lost', defaultMessage: 'duel lost' },
  net_duel: { id: 'So5Stat.net_duel', defaultMessage: 'net duel' },
  adjusted_goal_assist: {
    id: 'So5Stat.adjusted_goal_assist',
    defaultMessage: 'adjusted goal assist',
  },
  adjusted_total_att_assist: {
    id: 'So5Stat.adjusted_total_att_assist',
    defaultMessage: 'attempted assist',
  },
  adjusted_accurate_fwd_zone_pass: {
    id: 'So5Stat.adjusted_accurate_fwd_zone_pass',
    defaultMessage: 'accurate forward pass',
  },
  successful_final_third_passes: {
    id: 'So5Stat.successful_final_third_passes',
    defaultMessage: 'successful final third pass',
  },
  accurate_through_ball: {
    id: 'So5Stat.accurate_through_ball',
    defaultMessage: 'accurate through ball',
  },
  pen_area_entries: {
    id: 'So5Stat.pen_area_entries',
    defaultMessage: 'penalty area entry',
  },
  missed_pass: { id: 'So5Stat.missed_pass', defaultMessage: 'missed pass' },
  accurate_long_balls: {
    id: 'So5Stat.accurate_long_balls',
    defaultMessage: 'accurate long ball',
  },
  accurate_cross: {
    id: 'So5Stat.accurate_cross',
    defaultMessage: 'accurate cross',
  },
  assist_penalty_won: {
    id: 'So5Stat.assist_penalty_won',
    defaultMessage: 'penalty won',
  },
  adjusted_goals: {
    id: 'So5Stat.adjusted_goals',
    defaultMessage: 'adjusted goal',
  },
  post_scoring_att: {
    id: 'So5Stat.post_scoring_att',
    defaultMessage: 'post scoring attempt',
  },
  won_contest: { id: 'So5Stat.won_contest', defaultMessage: 'won contest' },
  lost_contest: { id: 'So5Stat.lost_contest', defaultMessage: 'lost contest' },
  big_chance_missed: {
    id: 'So5Stat.big_chance_missed',
    defaultMessage: 'big chance missed',
  },
  big_chance_created: {
    id: 'So5Stat.big_chance_created',
    defaultMessage: 'big chance created',
  },
  double_double: {
    id: 'So5Stat.double_double',
    defaultMessage: 'double double',
  },
  triple_double: {
    id: 'So5Stat.triple_double',
    defaultMessage: 'triple double',
  },
  triple_triple: {
    id: 'So5Stat.triple_triple',
    defaultMessage: 'triple triple',
  },
  possession_bonus: {
    id: 'So5Stat.possession_bonus',
    defaultMessage: 'possession bonus',
  },
  penalty_conceded: {
    id: 'So5Stat.penalty_conceded',
    defaultMessage: 'penalty conceded',
  },
  penalties_saved: {
    id: 'So5Stat.penalties_saved',
    defaultMessage: 'penalty saved',
  },
  saved_ibox: { id: 'So5Stat.saved_ibox', defaultMessage: 'save in the box' },
  saved_obox: {
    id: 'So5Stat.saved_obox',
    defaultMessage: 'save outside the box',
  },
  good_high_claim: {
    id: 'So5Stat.good_high_claim',
    defaultMessage: 'good high claim',
  },
  punches: { id: 'So5Stat.punches', defaultMessage: 'punches' },
  dive_save: { id: 'So5Stat.dive_save', defaultMessage: 'dive save' },
  dive_catch: { id: 'So5Stat.dive_catch', defaultMessage: 'dive catch' },
  cross_not_claimed: {
    id: 'So5Stat.cross_not_claimed',
    defaultMessage: 'cross not claimed',
  },
  gk_smother: { id: 'So5Stat.gk_smother', defaultMessage: 'gk smother' },
  keeper_pick_up: {
    id: 'So5Stat.keeper_pick_up',
    defaultMessage: 'keeper pick up',
  },
  accurate_keeper_sweeper: {
    id: 'So5Stat.accurate_keeper_sweeper',
    defaultMessage: 'accurate keeper sweeper',
  },
  accurate_goal_kicks: {
    id: 'So5Stat.accurate_goal_kicks',
    defaultMessage: 'accurate goal kick',
  },
  long_pass_own_to_opp_success: {
    id: 'So5Stat.long_pass_own_to_opp_success',
    defaultMessage: 'Long pass into opposition',
  },
  six_second_violation: {
    id: 'So5Stat.six_second_violation',
    defaultMessage: 'six second violation',
  },
});

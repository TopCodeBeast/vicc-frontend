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
  goals: { id: 'Vicc5Stat.goals', defaultMessage: 'goal' },
  goal_assist: { id: 'Vicc5Stat.goal_assist', defaultMessage: 'goal assist' },
  mins_played: { id: 'Vicc5Stat.mins_played', defaultMessage: 'mins played' },
  total_pass: { id: 'Vicc5Stat.total_pass', defaultMessage: 'total pass' },
  accurate_pass: {
    id: 'Vicc5Stat.accurate_pass',
    defaultMessage: 'accurate pass',
  },
  yellow_card: { id: 'Vicc5Stat.yellow_card', defaultMessage: 'yellow card' },
  red_card: { id: 'Vicc5Stat.red_card', defaultMessage: 'red card' },
  clean_sheet: { id: 'Vicc5Stat.clean_sheet', defaultMessage: 'clean sheet' },
  ontarget_scoring_att: {
    id: 'Vicc5Stat.ontarget_scoring_att',
    defaultMessage: 'shot on goal',
  },
  adjusted_ontarget_scoring_att: {
    id: 'Vicc5Stat.adjusted_ontarget_scoring_att',
    defaultMessage: 'shot on goal',
  },
  blocked_scoring_att: {
    id: 'Vicc5Stat.blocked_scoring_att',
    defaultMessage: 'blocked shot',
  },
  total_tackle: { id: 'Vicc5Stat.total_tackle', defaultMessage: 'total tackle' },
  parries: { id: 'Vicc5Stat.parries', defaultMessage: 'parry' },
  was_fouled: { id: 'Vicc5Stat.was_fouled', defaultMessage: 'was fouled' },
  penalty_kick_missed: {
    id: 'Vicc5Stat.penalty_kick_missed',
    defaultMessage: 'penalty kick missed',
  },
  fouls: { id: 'Vicc5Stat.fouls', defaultMessage: 'foul' },
  penalty_save: {
    id: 'Vicc5Stat.penalties_saved',
    defaultMessage: 'penalty saved',
  },
  own_goals: { id: 'Vicc5Stat.own_goals', defaultMessage: 'own goal' },
  total_scoring_att: {
    id: 'Vicc5Stat.total_scoring_att',
    defaultMessage: 'total scoring attempt',
  },
  lost_corners: { id: 'Vicc5Stat.lost_corners', defaultMessage: 'lost corner' },
  goals_conceded: {
    id: 'Vicc5Stat.goals_conceded',
    defaultMessage: 'goal conceded',
  },
  three_goals_conceded: {
    id: 'Vicc5Stat.three_goals_conceded',
    defaultMessage: '3 goals conceded',
  },
  saves: { id: 'Vicc5Stat.saves', defaultMessage: 'saves' },
  goal_kicks: { id: 'Vicc5Stat.goal_kicks', defaultMessage: 'goal kick' },
  game_started: { id: 'Vicc5Stat.game_started', defaultMessage: 'game started' },
  total_clearance: {
    id: 'Vicc5Stat.total_clearance',
    defaultMessage: 'total clearance',
  },
  formation_place: {
    id: 'Vicc5Stat.formation_place',
    defaultMessage: 'formation place',
  },
  single_goal_game: {
    id: 'Vicc5Stat.single_goal_game',
    defaultMessage: 'single goal game',
  },
  error_lead_to_goal: {
    id: 'Vicc5Stat.error_lead_to_goal',
    defaultMessage: 'error lead to goal',
  },
  error_lead_to_shot: {
    id: 'Vicc5Stat.error_lead_to_shot',
    defaultMessage: 'error leading to shot',
  },
  clean_sheet_60: {
    id: 'Vicc5Stat.clean_sheet_60',
    defaultMessage: 'clean sheet',
  },
  outfielder_block: {
    id: 'Vicc5Stat.outfielder_block',
    defaultMessage: 'outfielder block',
  },
  blocked_cross: {
    id: 'Vicc5Stat.blocked_cross',
    defaultMessage: 'blocked cross',
  },
  last_man_tackle: {
    id: 'Vicc5Stat.last_man_tackle',
    defaultMessage: 'last man tackle',
  },
  interception_won: {
    id: 'Vicc5Stat.interception_won',
    defaultMessage: 'interception won',
  },
  clearance_off_line: {
    id: 'Vicc5Stat.clearance_off_line',
    defaultMessage: 'clearance off line',
  },
  effective_clearance: {
    id: 'Vicc5Stat.effective_clearance',
    defaultMessage: 'effective clearance',
  },
  won_tackle: { id: 'Vicc5Stat.won_tackle', defaultMessage: 'won tackle' },
  lost_tackle: { id: 'Vicc5Stat.lost_tackle', defaultMessage: 'lost tackle' },
  touches: { id: 'Vicc5Stat.touches', defaultMessage: 'touches' },
  poss_won: { id: 'Vicc5Stat.poss_won', defaultMessage: 'possession won' },
  poss_lost_ctrl: {
    id: 'Vicc5Stat.poss_lost_ctrl',
    defaultMessage: 'possession lost',
  },
  duel_won: { id: 'Vicc5Stat.duel_won', defaultMessage: 'duel won' },
  duel_lost: { id: 'Vicc5Stat.duel_lost', defaultMessage: 'duel lost' },
  net_duel: { id: 'Vicc5Stat.net_duel', defaultMessage: 'net duel' },
  adjusted_goal_assist: {
    id: 'Vicc5Stat.adjusted_goal_assist',
    defaultMessage: 'adjusted goal assist',
  },
  adjusted_total_att_assist: {
    id: 'Vicc5Stat.adjusted_total_att_assist',
    defaultMessage: 'attempted assist',
  },
  adjusted_accurate_fwd_zone_pass: {
    id: 'Vicc5Stat.adjusted_accurate_fwd_zone_pass',
    defaultMessage: 'accurate forward pass',
  },
  successful_final_third_passes: {
    id: 'Vicc5Stat.successful_final_third_passes',
    defaultMessage: 'successful final third pass',
  },
  accurate_through_ball: {
    id: 'Vicc5Stat.accurate_through_ball',
    defaultMessage: 'accurate through ball',
  },
  pen_area_entries: {
    id: 'Vicc5Stat.pen_area_entries',
    defaultMessage: 'penalty area entry',
  },
  missed_pass: { id: 'Vicc5Stat.missed_pass', defaultMessage: 'missed pass' },
  accurate_long_balls: {
    id: 'Vicc5Stat.accurate_long_balls',
    defaultMessage: 'accurate long ball',
  },
  accurate_cross: {
    id: 'Vicc5Stat.accurate_cross',
    defaultMessage: 'accurate cross',
  },
  assist_penalty_won: {
    id: 'Vicc5Stat.assist_penalty_won',
    defaultMessage: 'penalty won',
  },
  adjusted_goals: {
    id: 'Vicc5Stat.adjusted_goals',
    defaultMessage: 'adjusted goal',
  },
  post_scoring_att: {
    id: 'Vicc5Stat.post_scoring_att',
    defaultMessage: 'post scoring attempt',
  },
  won_contest: { id: 'Vicc5Stat.won_contest', defaultMessage: 'won contest' },
  lost_contest: { id: 'Vicc5Stat.lost_contest', defaultMessage: 'lost contest' },
  big_chance_missed: {
    id: 'Vicc5Stat.big_chance_missed',
    defaultMessage: 'big chance missed',
  },
  big_chance_created: {
    id: 'Vicc5Stat.big_chance_created',
    defaultMessage: 'big chance created',
  },
  double_double: {
    id: 'Vicc5Stat.double_double',
    defaultMessage: 'double double',
  },
  triple_double: {
    id: 'Vicc5Stat.triple_double',
    defaultMessage: 'triple double',
  },
  triple_triple: {
    id: 'Vicc5Stat.triple_triple',
    defaultMessage: 'triple triple',
  },
  possession_bonus: {
    id: 'Vicc5Stat.possession_bonus',
    defaultMessage: 'possession bonus',
  },
  penalty_conceded: {
    id: 'Vicc5Stat.penalty_conceded',
    defaultMessage: 'penalty conceded',
  },
  penalties_saved: {
    id: 'Vicc5Stat.penalties_saved',
    defaultMessage: 'penalty saved',
  },
  saved_ibox: { id: 'Vicc5Stat.saved_ibox', defaultMessage: 'save in the box' },
  saved_obox: {
    id: 'Vicc5Stat.saved_obox',
    defaultMessage: 'save outside the box',
  },
  good_high_claim: {
    id: 'Vicc5Stat.good_high_claim',
    defaultMessage: 'good high claim',
  },
  punches: { id: 'Vicc5Stat.punches', defaultMessage: 'punches' },
  dive_save: { id: 'Vicc5Stat.dive_save', defaultMessage: 'dive save' },
  dive_catch: { id: 'Vicc5Stat.dive_catch', defaultMessage: 'dive catch' },
  cross_not_claimed: {
    id: 'Vicc5Stat.cross_not_claimed',
    defaultMessage: 'cross not claimed',
  },
  gk_smother: { id: 'Vicc5Stat.gk_smother', defaultMessage: 'gk smother' },
  keeper_pick_up: {
    id: 'Vicc5Stat.keeper_pick_up',
    defaultMessage: 'keeper pick up',
  },
  accurate_keeper_sweeper: {
    id: 'Vicc5Stat.accurate_keeper_sweeper',
    defaultMessage: 'accurate keeper sweeper',
  },
  accurate_goal_kicks: {
    id: 'Vicc5Stat.accurate_goal_kicks',
    defaultMessage: 'accurate goal kick',
  },
  long_pass_own_to_opp_success: {
    id: 'Vicc5Stat.long_pass_own_to_opp_success',
    defaultMessage: 'Long pass into opposition',
  },
  six_second_violation: {
    id: 'Vicc5Stat.six_second_violation',
    defaultMessage: 'six second violation',
  },
});

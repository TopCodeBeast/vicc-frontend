export const displayablePreferences = [
  'card_subscription',
  'player_subscription',
  'higher_bid',
  'card_sold',
  'card_not_sold',
  'card_bought',
  'card_withdrawal_started',
  'card_withdrawn',
  'offer_received',
  'offer_accepted',
  'offer_rejected',
  'offer_cancelled',
  'offer_countered',
  'vicc5_lineup_too_powerful',
  'vicc5_lineup_invalid',
  'appearance_destroyed',
  'new_results',
  'referrer_reward_ready_to_claim',
  'referee_reward_ready_to_claim',
] as const;

export type DisplayablePreference = (typeof displayablePreferences)[number];

export const displayableMarketingPreferences = [
  'news',
  'gameplay_tips',
  'reminders',
] as const;

export type DisplayableMarketingPreference =
  (typeof displayableMarketingPreferences)[number];

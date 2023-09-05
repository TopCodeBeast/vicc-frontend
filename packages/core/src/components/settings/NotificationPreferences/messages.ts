import { defineMessages } from 'react-intl';

import { DisplayableMarketingPreference, DisplayablePreference } from './types';

export const notificationTitles = defineMessages<
  DisplayablePreference | DisplayableMarketingPreference
>({
  card_subscription: {
    id: 'NotificationPreferenceTitle.cardSubscription',
    defaultMessage: 'Card subscription',
  },
  player_subscription: {
    id: 'NotificationPreferenceTitle.playerSubscription',
    defaultMessage: 'Player subscription',
  },
  higher_bid: {
    id: 'NotificationPreferenceTitle.higherBid',
    defaultMessage: 'Higher bid',
  },
  card_sold: {
    id: 'NotificationPreferenceTitle.cardSold',
    defaultMessage: 'Card sold',
  },
  card_not_sold: {
    id: 'NotificationPreferenceTitle.cardNotSold',
    defaultMessage: 'Card not sold',
  },
  card_withdrawal_started: {
    id: 'NotificationPreferenceTitle.cardWithdrawStarted',
    defaultMessage: 'Card withdrawal started',
  },
  card_withdrawn: {
    id: 'NotificationPreferenceTitle.cardWithdraw',
    defaultMessage: 'Card withdrawn',
  },
  card_bought: {
    id: 'NotificationPreferenceTitle.cardBought',
    defaultMessage: 'Card bought',
  },
  offer_received: {
    id: 'NotificationPreferenceTitle.offerReceived',
    defaultMessage: 'Offer received',
  },
  offer_accepted: {
    id: 'NotificationPreferenceTitle.offerAccepted',
    defaultMessage: 'Offer accepted',
  },
  offer_rejected: {
    id: 'NotificationPreferenceTitle.offerRejected',
    defaultMessage: 'Offer rejected',
  },
  offer_cancelled: {
    id: 'NotificationPreferenceTitle.offerCancelled',
    defaultMessage: 'Offer canceled',
  },
  offer_countered: {
    id: 'NotificationPreferenceTitle.offerCountered',
    defaultMessage: 'Counter offer received',
  },
  vicc5_lineup_too_powerful: {
    id: 'NotificationPreferenceTitle.vicc5LineupTooPowerful',
    defaultMessage: 'Vicc5 lineup too powerful',
  },
  vicc5_lineup_invalid: {
    id: 'NotificationPreferenceTitle.vicc5LineupInvalid',
    defaultMessage: 'Lineup invalid',
  },
  appearance_destroyed: {
    id: 'NotificationPreferenceTitle.appearanceDestroyed',
    defaultMessage: 'Appearance destroyed',
  },
  new_results: {
    id: 'NotificationPreferenceTitle.newResults',
    defaultMessage: 'New results',
  },
  referrer_reward_ready_to_claim: {
    id: 'NotificationPreferenceTitle.referrerRewardReadyToClaim',
    defaultMessage: 'Referrer reward ready to claim',
  },
  referee_reward_ready_to_claim: {
    id: 'NotificationPreferenceTitle.refereeRewardReadyToClaim',
    defaultMessage: 'Referee reward ready to claim',
  },
  gameplay_tips: {
    id: 'NotificationPreferenceTitle.gameplayTips',
    defaultMessage: 'Gameplay Tips',
  },
  reminders: {
    id: 'NotificationPreferenceTitle.reminders',
    defaultMessage: 'Reminders',
  },
  news: {
    id: 'NotificationPreferenceTitle.news',
    defaultMessage: 'News',
  },
});

export const notificationSubtitles = defineMessages<
  DisplayablePreference | DisplayableMarketingPreference
>({
  card_subscription: {
    id: 'NotificationPreference.cardSubscription',
    defaultMessage:
      "Received when a Card you're subscribed to is put on Auction.",
  },
  player_subscription: {
    id: 'NotificationPreference.playerSubscription',
    defaultMessage:
      "Received when a card of a player you're subscribed to is put on auction.",
  },
  higher_bid: {
    id: 'NotificationPreference.higherBid',
    defaultMessage: 'Received when a Manager sets a higher bid than your own.',
  },
  card_sold: {
    id: 'NotificationPreference.cardSold',
    defaultMessage: 'Received when you have successfully sold a Card.',
  },
  card_not_sold: {
    id: 'NotificationPreference.cardNotSold',
    defaultMessage:
      'Received when one of your sales expires without any buyer.',
  },
  card_withdrawal_started: {
    id: 'NotificationPreference.cardWithdrawStarted',
    defaultMessage: 'Received when you initiate a card withdrawal.',
  },
  card_withdrawn: {
    id: 'NotificationPreference.cardWithdraw',
    defaultMessage:
      'Received when a card withdrawal is successfully completed.',
  },
  card_bought: {
    id: 'NotificationPreference.cardBought',
    defaultMessage: 'Received when you have successfully bought a card.',
  },
  offer_received: {
    id: 'NotificationPreference.offerReceived',
    defaultMessage: 'Received when a Manager has sent an offer to you.',
  },
  offer_countered: {
    id: 'NotificationPreference.offerCountered',
    defaultMessage: 'Received when someone has made a counter offer to you.',
  },
  offer_accepted: {
    id: 'NotificationPreference.offerAccepted',
    defaultMessage: 'Received when one of your offers has been accepted.',
  },
  offer_rejected: {
    id: 'NotificationPreference.offerRejected',
    defaultMessage:
      'Received when a Manager you made an offer to rejects your offer.',
  },
  offer_cancelled: {
    id: 'NotificationPreference.offerCancelled',
    defaultMessage: 'Received when one of your offers has been canceled.',
  },
  vicc5_lineup_too_powerful: {
    id: 'NotificationPreference.vicc5LineupTooPowerful',
    defaultMessage:
      'Received when one of your lineup exceeds the leaderboard power cap.',
  },
  vicc5_lineup_invalid: {
    id: 'NotificationPreference.vicc5LineupInvalid',
    defaultMessage:
      'Received when one of your submitted lineup becomes invalid.',
  },
  appearance_destroyed: {
    id: 'NotificationPreference.appearanceDestroyed',
    defaultMessage: 'Received when your card is removed from a lineup.',
  },
  new_results: {
    id: 'NotificationPreference.newResults',
    defaultMessage:
      'Received when the results of a Tournament have been published.',
  },
  gameplay_tips: {
    id: 'NotificationPreference.gameplayTips',
    defaultMessage:
      'Received when onboarding into Football, NBA or MLB to better understand Vicc Fantasy Game.',
  },
  referrer_reward_ready_to_claim: {
    id: 'NotificationPreference.referrerRewardReadyToClaim',
    defaultMessage: 'Received when you have a referrer reward ready to claim.',
  },
  referee_reward_ready_to_claim: {
    id: 'NotificationPreference.refereeRewardReadyToClaim',
    defaultMessage: 'Received when you have a referee reward ready to claim.',
  },
  reminders: {
    id: 'NotificationPreference.reminders',
    defaultMessage:
      'Received when you forgot to compose a team or claim rewards.',
  },
  news: {
    id: 'NotificationPreference.news',
    defaultMessage:
      'Received when Vicc has announcements to share or monthly updates like our newsletter, The Snapshot.',
  },
});

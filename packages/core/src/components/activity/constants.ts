import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  higherBid: {
    id: 'Notifications.higherBid',
    defaultMessage: 'Outbids',
  },
  cardAttached: {
    id: 'Notifications.cardAttached',
    defaultMessage: 'New Card in Collection',
  },
  cardBought: {
    id: 'Notifications.cardBought',
    defaultMessage: 'Cards bought',
  },
  cardWithdrawals: {
    id: 'Notifications.cardWithdrawals',
    defaultMessage: 'Card withdrawals',
  },
  offerAccepted: {
    id: 'Notifications.offerAccepted',
    defaultMessage: 'Offers accepted',
  },
  offerRejected: {
    id: 'Notifications.offerRejected',
    defaultMessage: 'Offers rejected',
  },
  offerCancelled: {
    id: 'Notifications.offerCancelled',
    defaultMessage: 'Offers canceled',
  },
  offerReceived: {
    id: 'Notifications.offerReceived',
    defaultMessage: 'Offers received',
  },
  offerCountered: {
    id: 'Notifications.offerCountered',
    defaultMessage: 'Counter offer received',
  },
  cardSold: {
    id: 'Notifications.cardSold',
    defaultMessage: 'Cards sold',
  },
  cardNotSold: {
    id: 'Notifications.cardsNotSold',
    defaultMessage: 'Cards not sold',
  },
  challengeCompleted: {
    id: 'Notifications.challengeCompleted',
    defaultMessage: 'Challenge completed',
  },
  referralRewards: {
    id: 'Notifications.referralRewards',
    defaultMessage: 'Referral rewards',
  },
  so5LineupCancelled: {
    id: 'Notifications.so5LineupCancelled',
    defaultMessage: 'Lineup canceled',
  },
});

const notificationCategories = [
  'card_attached',
  'card_bought',
  'card_not_sold',
  'card_sold',
  'card_withdrawal_started',
  'card_withdrawn',
  'higher_bid',
  'offer_accepted',
  'offer_received',
  'offer_rejected',
  'offer_cancelled',
  'offer_countered',
  'completed',
  'referee_reward_ready_to_claim',
  'referrer_reward_ready_to_claim',
  'so5_lineup_cancelled',
  'appearance_destroyed',
] as const;

type NotificationCategory = (typeof notificationCategories)[number];

export const notificationCategoryTypes: {
  [category in NotificationCategory]: string;
} = {
  card_attached: 'CardCollectionNotification',
  card_bought: 'AuctionNotification',
  card_not_sold: 'SaleNotification',
  card_sold: 'SaleNotification',
  card_withdrawal_started: 'CardNotification',
  card_withdrawn: 'CardNotification',
  higher_bid: 'AuctionNotification',
  offer_accepted: 'OfferNotification',
  offer_received: 'OfferNotification',
  offer_rejected: 'OfferNotification',
  offer_cancelled: 'OfferNotification',
  offer_countered: 'OfferNotification',
  completed: 'ChallengeNotification',
  referee_reward_ready_to_claim: 'ReferralRewardNotification',
  referrer_reward_ready_to_claim: 'ReferralRewardNotification',
  so5_lineup_cancelled: 'So5LineupNotification',
  appearance_destroyed: 'So5LineupNotification',
};

export const notificationGroups: {
  [group in keyof typeof messages]: NotificationCategory[];
} = {
  cardBought: ['card_bought'],
  higherBid: ['higher_bid'],
  cardSold: ['card_sold'],
  cardNotSold: ['card_not_sold'],
  offerAccepted: ['offer_accepted'],
  offerReceived: ['offer_received'],
  offerRejected: ['offer_rejected'],
  offerCancelled: ['offer_cancelled'],
  offerCountered: ['offer_countered'],
  cardAttached: ['card_attached'],
  cardWithdrawals: ['card_withdrawal_started', 'card_withdrawn'],
  challengeCompleted: ['completed'],
  referralRewards: [
    'referee_reward_ready_to_claim',
    'referrer_reward_ready_to_claim',
  ],
  so5LineupCancelled: ['so5_lineup_cancelled', 'appearance_destroyed'],
};

export type NotificationGroup = keyof typeof notificationGroups;

export const allGroups = Object.keys(notificationGroups) as NotificationGroup[];

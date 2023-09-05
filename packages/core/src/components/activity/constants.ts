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
  shieldRewarded: {
    id: 'Notifications.shieldRewarded',
    defaultMessage: 'Club badge unlocked',
  },
  shieldDeprived: {
    id: 'Notifications.shieldDeprived',
    defaultMessage: 'Club badge lost',
  },
  cardBought: {
    id: 'Notifications.cardBought',
    defaultMessage: 'Cards bought',
  },
  cardWithdrawals: {
    id: 'Notifications.cardWithdrawals',
    defaultMessage: 'Card withdrawals',
  },
  externalDeposit: {
    id: 'Notifications.externalDeposit',
    defaultMessage: 'External deposit',
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
  referralRewards: {
    id: 'Notifications.referralRewards',
    defaultMessage: 'Referral rewards',
  },
  vicc5LineupCancelled: {
    id: 'Notifications.vicc5LineupCancelled',
    defaultMessage: 'Lineup canceled',
  },
  kycRequests: {
    id: 'Notifications.kycRequests',
    defaultMessage: 'KYC requests',
  },
});

const notificationCategories = [
  'card_attached',
  'shield_rewarded',
  'shield_deprived',
  'card_bought',
  'card_not_sold',
  'card_sold',
  'card_withdrawal_started',
  'card_withdrawn',
  'eth_deposit_pending',
  'eth_deposit_finalized',
  'higher_bid',
  'offer_accepted',
  'offer_received',
  'offer_rejected',
  'offer_cancelled',
  'offer_countered',
  'referee_reward_ready_to_claim',
  'referrer_reward_ready_to_claim',
  'vicc5_lineup_cancelled',
  'appearance_destroyed',
  'kyc_request_validated',
  'kyc_request_refused',
] as const;

type NotificationCategory = (typeof notificationCategories)[number];

export const notificationCategoryTypes: {
  [category in NotificationCategory]: string;
} = {
  card_attached: 'CardCollectionNotification',
  shield_rewarded: 'CardCollectionNotification',
  shield_deprived: 'CardCollectionNotification',
  card_bought: 'AuctionNotification',
  card_not_sold: 'SaleNotification',
  card_sold: 'SaleNotification',
  card_withdrawal_started: 'CardNotification',
  card_withdrawn: 'CardNotification',
  eth_deposit_pending: 'ExternalDepositNotification',
  eth_deposit_finalized: 'ExternalDepositNotification',
  higher_bid: 'AuctionNotification',
  offer_accepted: 'OfferNotification',
  offer_received: 'OfferNotification',
  offer_rejected: 'OfferNotification',
  offer_cancelled: 'OfferNotification',
  offer_countered: 'OfferNotification',
  referee_reward_ready_to_claim: 'ReferralRewardNotification',
  referrer_reward_ready_to_claim: 'ReferralRewardNotification',
  vicc5_lineup_cancelled: 'Vicc5LineupNotification',
  appearance_destroyed: 'Vicc5LineupNotification',
  kyc_request_validated: 'KycRequestNotification',
  kyc_request_refused: 'KycRequestNotification',
};

export const notificationGroups: {
  [group in keyof typeof messages]: NotificationCategory[];
} = {
  cardBought: ['card_bought'],
  higherBid: ['higher_bid'],
  cardSold: ['card_sold'],
  cardNotSold: ['card_not_sold'],
  externalDeposit: ['eth_deposit_pending', 'eth_deposit_finalized'],
  offerAccepted: ['offer_accepted'],
  offerReceived: ['offer_received'],
  offerRejected: ['offer_rejected'],
  offerCancelled: ['offer_cancelled'],
  offerCountered: ['offer_countered'],
  cardAttached: ['card_attached'],
  shieldRewarded: ['shield_rewarded'],
  shieldDeprived: ['shield_deprived'],
  cardWithdrawals: ['card_withdrawal_started', 'card_withdrawn'],
  referralRewards: [
    'referee_reward_ready_to_claim',
    'referrer_reward_ready_to_claim',
  ],
  vicc5LineupCancelled: ['vicc5_lineup_cancelled', 'appearance_destroyed'],
  kycRequests: ['kyc_request_refused', 'kyc_request_validated'],
};

export type NotificationGroup = keyof typeof notificationGroups;

export const allGroups = Object.keys(notificationGroups) as NotificationGroup[];

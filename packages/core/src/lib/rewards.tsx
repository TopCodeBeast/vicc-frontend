import { gql } from '@apollo/client';

import {
  CustomRewardExperience,
  PaymentCurrency,
  Rarity,
} from '@core/__generated__/globalTypes';

import {
  hasEligibleRewards_so5RewardConfig,
  hasRewards_rewardsOverview,
  hasUnclaimedRewards_so5Fixture,
} from './__generated__/rewards.graphql';
import { withFragments } from './gql';

export const hasUnclaimedRewards = withFragments(
  (so5Fixture: hasUnclaimedRewards_so5Fixture) => {
    return so5Fixture.mySo5Rewards.some(r => r.aasmState !== 'claimed');
  },
  {
    so5Fixture: gql`
      fragment hasUnclaimedRewards_so5Fixture on So5Fixture {
        slug
        mySo5Rewards {
          slug
          aasmState
        }
      }
    `,
  }
);

export const getUnclaimedRewards = (so5Fixture: {
  mySo5Rewards: { aasmState: string }[];
}) => {
  return so5Fixture.mySo5Rewards.filter(r => r.aasmState === 'ready');
};

export const hasRewards = withFragments(
  (rewards: hasRewards_rewardsOverview | undefined) => {
    const hasPrizePool = !!rewards?.prizePool;
    const hasCardsRewards =
      rewards?.cards && !!Object.keys(rewards.cards).length;
    const hasExperiences = !!(rewards?.experiences as Experiences)?.type
      ?.length;
    return hasPrizePool || hasCardsRewards || hasExperiences;
  },
  {
    rewards: gql`
      fragment hasRewards_rewardsOverview on RewardsOverview {
        cards
        experiences
        prizePool
        prizePoolCurrency
      }
    `,
  }
);

export const hasEligibleRewards = withFragments(
  (rewards: hasEligibleRewards_so5RewardConfig | undefined) => {
    if (!rewards) {
      return false;
    }
    const hasMonetaryRewards =
      !!rewards?.ethAmount || !!rewards.usdAmount || !!rewards.coinAmount;
    const hasCardsRewards =
      rewards?.cards && !!Object.keys(rewards.cards).length;
    const hasExperiences = !!(rewards?.experiences as Experiences)?.type
      ?.length;
    return hasMonetaryRewards || hasCardsRewards || hasExperiences;
  },
  {
    rewardConfig: gql`
      fragment hasEligibleRewards_so5RewardConfig on So5RewardConfig {
        cards {
          quality
          rarity
        }
        experiences {
          type
        }
        ethAmount
        usdAmount
        coinAmount
      }
    `,
  }
);

export type Experiences = { type?: CustomRewardExperience[] };

export type TotalRewards = {
  prizePool: number;
  prizePoolCurrency: PaymentCurrency;
  cards: Json;
  experiences?: Json | null;
};

type CardsPerRarity = {
  [key in Rarity]?: number;
};

export interface CardsInRewards extends CardsPerRarity {
  rarities?: Rarity[];
}

export type CardReward = {
  rarity: Rarity;
  nb: string | number | null;
};

export const getCardRewards = (cards: CardsInRewards): CardReward[] => {
  if (!cards) {
    return [];
  }
  const result: CardReward[] = [];

  const raritiesFromKeys = Object.keys(cards).filter(
    k => k !== 'rarities'
  ) as Rarity[];

  const cardRarities = raritiesFromKeys.length
    ? raritiesFromKeys
    : (cards.rarities as Rarity[]);

  if (!cardRarities) {
    return result;
  }

  cardRarities.forEach(rarity => {
    result.push({ rarity, nb: cards[rarity] || null });
  });

  return result;
};

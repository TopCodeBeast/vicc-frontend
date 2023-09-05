import { TypedDocumentNode, gql } from '@apollo/client';

import {
  CustomRewardExperience,
  PaymentCurrency,
  Rarity,
} from '__generated__/globalTypes';

import {
  hasEligibleRewards_vicc5RewardConfig,
  hasRewards_rewardsOverview,
  hasUnclaimedRewards_vicc5Fixture,
} from './__generated__/rewards.graphql';
import { withFragments } from './gql';

export const hasUnclaimedRewards = withFragments(
  (vicc5Fixture: hasUnclaimedRewards_vicc5Fixture) => {
    return vicc5Fixture.myVicc5Rewards.some(r => r.aasmState !== 'claimed');
  },
  {
    vicc5Fixture: gql`
      fragment hasUnclaimedRewards_vicc5Fixture on Vicc5Fixture {
        slug
        myVicc5Rewards {
          slug
          aasmState
        }
      }
    ` as TypedDocumentNode<hasUnclaimedRewards_vicc5Fixture>,
  }
);

export const getUnclaimedRewards = (vicc5Fixture: {
  myVicc5Rewards: { aasmState: string }[];
}) => {
  return vicc5Fixture.myVicc5Rewards.filter(r => r.aasmState === 'ready');
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
    ` as TypedDocumentNode<hasRewards_rewardsOverview>,
  }
);

export const hasEligibleRewards = withFragments(
  (rewards: hasEligibleRewards_vicc5RewardConfig | undefined) => {
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
      fragment hasEligibleRewards_vicc5RewardConfig on Vicc5RewardConfig {
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
    ` as TypedDocumentNode<hasEligibleRewards_vicc5RewardConfig>,
  }
);

export type Experiences = { type?: CustomRewardExperience[] };

export type TotalRewards = {
  prizePool: number;
  prizePoolCurrency: PaymentCurrency;
  cards: Json;
  experiences?: Json | null;
  coins?: number;
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

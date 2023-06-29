import { gql } from '@apollo/client';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import {
  CardQuality,
  CustomRewardExperience,
  Rarity,
} from '@sorare/core/src/__generated__/globalTypes';
import Coin from '@sorare/core/src/atoms/icons/Coin';
import { Fiat } from '@sorare/core/src/atoms/icons/Fiat';

import CardRewardsByTier, { CardsByTier } from './CardRewardsByTier';
import ExperienceIcon from './ExperienceIcon';
import { Rewards_so5RewardConfig } from './__generated__/index.graphql';

type GroupedRewards = {
  coinAmount: number;
  usdAmount: number;
  cards: {
    [key in Rarity]: CardsByTier;
  };
  experiences: {
    [key in CustomRewardExperience]: number;
  };
};

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--unit);
  overflow: auto;
`;
const Amount = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  font-size: var(--t-12);
`;

const defaultDataObj = (): GroupedRewards => {
  const tiers: any = {};
  const cards: any = {};
  const experiences: any = {};
  Object.keys(CardQuality).forEach(quality => {
    tiers[quality as CardQuality] = 0;
  });
  Object.keys(Rarity).forEach(rarity => {
    cards[rarity as Rarity] = { ...tiers };
  });
  Object.keys(CustomRewardExperience).forEach(experience => {
    experiences[experience as CustomRewardExperience] = 0;
  });
  return {
    cards,
    experiences,
    usdAmount: 0,
    coinAmount: 0,
  };
};
const atLeastOneCardReward = (cards: CardsByTier): boolean =>
  Object.keys(CardQuality).reduce(
    (sum, tier) => sum + cards[tier as CardQuality],
    0
  ) > 0;

type Props = {
  rewards: Rewards_so5RewardConfig[];
};
const Rewards = ({ rewards }: Props) => {
  const { formatNumber } = useIntl();
  const groupedRewards = rewards.reduce((obj, reward) => {
    if (reward.score !== null) {
      if (reward?.usdAmount && reward.usdAmount > obj.usdAmount) {
        obj.usdAmount = reward.usdAmount;
      }
      if (reward?.coinAmount && reward.coinAmount > obj.coinAmount) {
        obj.coinAmount = reward.coinAmount;
      }
    } else {
      obj.coinAmount += reward.coinAmount || 0;
      obj.usdAmount += reward.usdAmount || 0;
      reward.cards?.forEach(card => {
        if (card.quality) {
          obj.cards[card.rarity][card.quality] +=
            (reward.ranks || 1) * card.quantity;
        }
      });
      reward.experiences?.forEach(experience => {
        obj.experiences[experience.type] += 1;
      });
    }

    return obj;
  }, defaultDataObj());

  const { cards, experiences, usdAmount, coinAmount } = groupedRewards;

  return (
    <Root>
      {usdAmount > 0 && (
        <Amount>
          <Fiat /> {formatNumber(usdAmount)}
        </Amount>
      )}
      {coinAmount > 0 && (
        <Amount>
          <Coin /> {formatNumber(coinAmount)}
        </Amount>
      )}
      {Object.keys(Rarity)
        .filter(rarity => atLeastOneCardReward(cards[rarity as Rarity]))
        .reverse()
        .map(rarity => (
          <CardRewardsByTier
            key={rarity}
            rarity={rarity as Rarity}
            tiers={cards[rarity as Rarity]}
          />
        ))}
      {Object.keys(CustomRewardExperience).map(
        experience =>
          experiences[experience as CustomRewardExperience] > 0 && (
            <Amount key={experience}>
              <ExperienceIcon
                type={experience as CustomRewardExperience}
                amount={experiences[experience as CustomRewardExperience]}
              />
            </Amount>
          )
      )}
    </Root>
  );
};

Rewards.fragments = {
  so5RewardConfig: gql`
    fragment Rewards_so5RewardConfig on So5RewardConfig {
      score
      ethAmount
      coinAmount
      usdAmount
      ranks
      cards {
        quality
        quantity
        rarity
      }
      experiences {
        type
      }
    }
  `,
};

export default Rewards;

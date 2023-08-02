import { TypedDocumentNode, gql } from '@apollo/client';
import { Fragment } from 'react';
import { defineMessages } from 'react-intl';

import { PaymentCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { Fiat } from '@sorare/core/src/atoms/icons/Fiat';
import ExperienceIcon from '@sorare/core/src/components/rewards/ExperienceIcon';
import { HeadlineReward as DumbHeadlineReward } from '@sorare/core/src/components/rewards/HeadlineReward';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { uniqueBy } from '@sorare/core/src/lib/arrays';

import {
  HeadlineRewards_so5Leaderboard,
  HeadlineRewards_so5RewardConfig,
} from './__generated__/index.graphql';

type Props = {
  leaderboard: HeadlineRewards_so5Leaderboard;
};

const rewardFragment = gql`
  fragment HeadlineRewards_so5RewardConfig on So5RewardConfig {
    score
    usdAmount
    ethAmount
    experiences {
      description
      type
    }
  }
` as TypedDocumentNode<HeadlineRewards_so5RewardConfig>;

const messages = defineMessages({
  threshold: {
    id: 'HeadlineRewards.threshold',
    defaultMessage: 'Score {score} points to win {prize}',
  },
});

const isThreshold = (
  reward: HeadlineRewards_so5RewardConfig,
  prizePoolKey: 'ethAmount' | 'usdAmount'
) => reward.score && reward.score > 0 && !!reward[prizePoolKey];

export const HeadlineRewards = ({ leaderboard }: Props) => {
  const { formatMessage, formatNumber } = useIntlContext();

  const prizePoolKey =
    leaderboard.totalRewards.prizePoolCurrency === PaymentCurrency.ETH
      ? 'ethAmount'
      : 'usdAmount';

  const formattedThreshold = (
    score: number,
    amount: number,
    currency: PaymentCurrency
  ) =>
    formatMessage(messages.threshold, {
      score,
      prize: formatNumber(amount, {
        style: 'currency',
        currency,
      }),
    });

  const extractHighlightedRewards = (
    reward: HeadlineRewards_so5RewardConfig
  ) => {
    const highlightableRewards = [];
    (reward.experiences || []).forEach(
      experience =>
        experience.description &&
        highlightableRewards.push({
          icon: <ExperienceIcon type={experience.type} sm />,
          description: experience.description,
        })
    );
    if (isThreshold(reward, prizePoolKey)) {
      highlightableRewards.push({
        icon: <Fiat />,
        description: formattedThreshold(
          reward.score!,
          reward[prizePoolKey]!,
          leaderboard.totalRewards.prizePoolCurrency
        ),
      });
    }
    return highlightableRewards;
  };

  const highlightedRewards = [
    leaderboard.rewardsConfig.ranking,
    leaderboard.rewardsConfig.conditional,
  ]
    .flatMap(rewards =>
      (rewards || []).flatMap(reward => extractHighlightedRewards(reward))
    )
    .filter(Boolean);

  if (!highlightedRewards.length) {
    return null;
  }
  return (
    <DumbHeadlineReward
      label={uniqueBy(r => r.description, highlightedRewards).map(reward => (
        <Fragment key={reward.description}>
          {reward.icon}
          {reward.description}
        </Fragment>
      ))}
    />
  );
};

HeadlineRewards.fragments = {
  so5Leaderboard: gql`
    fragment HeadlineRewards_so5Leaderboard on So5Leaderboard {
      slug
      totalRewards {
        prizePoolCurrency
      }
      rewardsConfig {
        ranking {
          ...HeadlineRewards_so5RewardConfig
        }
        conditional {
          ...HeadlineRewards_so5RewardConfig
        }
      }
    }
    ${rewardFragment}
  ` as TypedDocumentNode<HeadlineRewards_so5Leaderboard>,
};

export default HeadlineRewards;

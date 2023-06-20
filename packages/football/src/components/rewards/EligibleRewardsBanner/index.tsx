import { gql } from '@apollo/client';
import { faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isFuture } from 'date-fns';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import CardBack from '@sorare/core/src/components/card/Back/Football';
import { Fan } from '@sorare/core/src/components/rewards/Banner/Fan';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';
import { hasEligibleRewards } from '@sorare/core/src/lib/rewards';

import { DumbBanner } from '@sorare/football/src/components/rewards/DumbBanner';

import { EligibleRewardsBanner_rewardConfig } from './__generated__/index.graphql';

const DescriptionRow = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
  height: var(--triple-unit);
`;

const getCardBacks = (
  rewardConfigs: Nullable<EligibleRewardsBanner_rewardConfig[]>
) => {
  return (
    rewardConfigs?.reduce((acc, cur) => {
      const rewards = [];
      if (cur.coinAmount) {
        rewards.push(
          <CardBack
            key="coin"
            path={`${FRONTEND_ASSET_HOST}/cards/back/coin.png`}
          />
        );
      }
      if (cur.ethAmount || cur.usdAmount) {
        rewards.push(
          <CardBack
            key="money"
            path={`${FRONTEND_ASSET_HOST}/cards/back/ethereum.svg`}
          />
        );
      }
      cur.cards?.forEach(card => {
        rewards.push(
          <CardBack
            key={`${card.quality}-${card.rarity}`}
            path={`${FRONTEND_ASSET_HOST}/cards/back/${card.rarity}.svg`}
          />
        );
      });
      return [...acc, ...rewards];
    }, [] as JSX.Element[]) || []
  );
};

type Props = {
  rewardConfigs: Nullable<EligibleRewardsBanner_rewardConfig[]>;
  rewardsDeliveryDate: Nullable<string>;
};

export const EligibleRewardsBanner = ({
  rewardConfigs,
  rewardsDeliveryDate,
}: Props) => {
  const getTimeLeftLabel = () => {
    if (!rewardsDeliveryDate) {
      return null;
    }
    if (!isFuture(new Date(rewardsDeliveryDate))) {
      return (
        <FormattedMessage
          id="UpcomingFixture.rewardsImminent"
          defaultMessage="Rewards imminent!"
        />
      );
    }
    return <TimeLeft time={new Date(rewardsDeliveryDate)} />;
  };

  if (!rewardConfigs?.some(config => hasEligibleRewards(config))) {
    return null;
  }
  return (
    <DumbBanner
      icon={<Fan elements={getCardBacks(rewardConfigs)} />}
      title={
        <FormattedMessage
          id="EligibleRewardsBanner.title"
          defaultMessage="Projected Rewards"
        />
      }
      description={
        <DescriptionRow>
          <FontAwesomeIcon icon={faClock} size="sm" />
          {getTimeLeftLabel()}
        </DescriptionRow>
      }
      disabled
    />
  );
};

EligibleRewardsBanner.fragments = {
  rewardConfig: gql`
    fragment EligibleRewardsBanner_rewardConfig on So5RewardConfig {
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
      ...hasEligibleRewards_so5RewardConfig
    }
    ${hasEligibleRewards.fragments.rewardConfig}
  `,
};

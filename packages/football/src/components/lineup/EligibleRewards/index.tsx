import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedNumber, useIntl } from 'react-intl';
import styled from 'styled-components';

import Coin from '@sorare/core/src/atoms/icons/Coin';
import { Eth } from '@sorare/core/src/atoms/icons/Eth';
import { Fiat } from '@sorare/core/src/atoms/icons/Fiat';
import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import ExperienceIcon from '@sorare/core/src/components/rewards/ExperienceIcon';
import { qualityNames } from '@sorare/core/src/lib/players';

import { EligibleRewards_rewardConfig } from './__generated__/index.graphql';

const Root = styled.div`
  display: inline-flex;
  gap: var(--unit);
  color: inherit;
  &:hover,
  &:focus {
    color: inherit;
  }
`;

const RewardsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

const Cards = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

type Props = {
  rewards?: EligibleRewards_rewardConfig;
};
export const EligibleRewards = ({ rewards }: Props) => {
  const { formatNumber } = useIntl();
  if (!rewards) {
    return null;
  }
  return (
    <Root>
      {!!rewards.experiences?.length && (
        <RewardsContainer>
          {rewards.experiences.map((customReward, index) => (
            <ExperienceIcon
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              type={customReward.type}
              sm
            />
          ))}
        </RewardsContainer>
      )}
      {!!rewards?.ethAmount && (
        <RewardsContainer>
          <Eth />
          {formatNumber(rewards.ethAmount, {
            style: 'currency',
            currency: 'ETH',
            currencyDisplay: 'narrowSymbol',
            trailingZeroDisplay: 'stripIfInteger',
            minimumFractionDigits: 0,
          })}
        </RewardsContainer>
      )}
      {!!rewards?.usdAmount && (
        <RewardsContainer>
          <Fiat />
          {formatNumber(rewards.usdAmount, {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'narrowSymbol',
            trailingZeroDisplay: 'stripIfInteger',
            minimumFractionDigits: 0,
          })}
        </RewardsContainer>
      )}
      {(rewards?.cards?.length || 0) > 0 && (
        <RewardsContainer>
          {rewards?.cards?.map((cardReward, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Cards key={index}>
                <ScarcityIcon scarcity={cardReward.rarity} />
                {cardReward.quality && qualityNames[cardReward.quality]}
              </Cards>
            );
          })}
        </RewardsContainer>
      )}
      {!!rewards?.coinAmount && (
        <RewardsContainer>
          <Coin />
          <FormattedNumber value={rewards.coinAmount} />
        </RewardsContainer>
      )}
    </Root>
  );
};

EligibleRewards.fragments = {
  rewardConfig: gql`
    fragment EligibleRewards_rewardConfig on Vicc5RewardConfig {
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
  ` as TypedDocumentNode<EligibleRewards_rewardConfig>,
};

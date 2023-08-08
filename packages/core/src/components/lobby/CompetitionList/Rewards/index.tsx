import { useIntl } from 'react-intl';
import styled from 'styled-components';

import {
  CustomRewardExperience,
  PaymentCurrency,
} from '__generated__/globalTypes';
import Coin from '@core/atoms/icons/Coin';
import { Eth } from '@core/atoms/icons/Eth';
import ScarcityIcon from '@core/atoms/icons/ScarcityIcon';
import ExperienceIcon from '@core/components/rewards/ExperienceIcon';
import { CardsInRewards, TotalRewards, getCardRewards } from '@core/lib/rewards';

const Root = styled.div`
  display: inline-flex;
  gap: var(--unit);
`;
const RewardsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  &:not(:first-of-type)::before {
    height: 15px;
    width: 1px;
    background: var(--c-neutral-600);
    content: '';
    border-radius: 2em;
  }
`;
const Cards = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

const ManyCards = styled.div`
  display: flex;
  align-items: center;

  > * + * {
    margin-left: calc(-1 * var(--half-unit));
  }
`;

const RewardCurrency = styled.div`
  &,
  > * + * {
    margin-left: var(--half-unit);
  }
`;

const RewardCoins = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

type Experiences = { type?: CustomRewardExperience[] };
type Props = {
  rewards: TotalRewards;
};
export const Rewards = ({ rewards }: Props) => {
  const { formatNumber } = useIntl();
  const cardRewards = getCardRewards(rewards?.cards as CardsInRewards);
  const customRewards = (rewards?.experiences as Experiences)?.type || [];
  const coinRewards = rewards.coins;

  return (
    <Root>
      {!!rewards.prizePool && (
        <RewardsContainer>
          {rewards.prizePoolCurrency === PaymentCurrency.ETH && <Eth />}
          <RewardCurrency>
            {formatNumber(rewards.prizePool, {
              style: 'currency',
              currency: rewards.prizePoolCurrency,
              currencyDisplay: 'narrowSymbol',
              trailingZeroDisplay: 'stripIfInteger',
              minimumFractionDigits: 0,
            })}
          </RewardCurrency>
        </RewardsContainer>
      )}

      {cardRewards.length > 0 && (
        <RewardsContainer>
          {cardRewards.length < 4 ? (
            cardRewards?.map(cardReward => {
              return (
                <Cards key={cardReward.rarity}>
                  <ScarcityIcon scarcity={cardReward.rarity} />
                  {typeof cardReward.nb === 'number'
                    ? formatNumber(cardReward.nb, {
                        compactDisplay: 'short',
                        notation: 'compact',
                      })
                    : cardReward.nb}
                </Cards>
              );
            })
          ) : (
            <>
              <ManyCards>
                {cardRewards?.map(cardReward => (
                  <ScarcityIcon
                    scarcity={cardReward.rarity}
                    key={cardReward.rarity}
                  />
                ))}
              </ManyCards>
              {cardRewards.reduce(
                (acc, reward) =>
                  typeof reward.nb === 'number' ? acc + reward.nb : acc,
                0
              )}
            </>
          )}
        </RewardsContainer>
      )}

      {Boolean(coinRewards) && (
        <RewardsContainer>
          <RewardCoins>
            <Coin /> {formatNumber(coinRewards!, { notation: 'compact' })}
          </RewardCoins>
        </RewardsContainer>
      )}

      {customRewards.length > 0 && (
        <RewardsContainer>
          {customRewards?.map(customReward => (
            <ExperienceIcon key={customReward} type={customReward} sm />
          ))}
        </RewardsContainer>
      )}
    </Root>
  );
};

import { gql } from '@apollo/client';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { PaymentCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { Eth } from '@sorare/core/src/atoms/icons/Eth';
import { Fiat } from '@sorare/core/src/atoms/icons/Fiat';
import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import ExperienceIcon from '@sorare/core/src/components/rewards/ExperienceIcon';
import { CardsInRewards, getCardRewards } from '@sorare/core/src/lib/rewards';

import { Rewards_rewardsOverview } from './__generated__/index.graphql';

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
  white-space: nowrap;
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

type Props = {
  rewards: Rewards_rewardsOverview;
  hideExperienceDescription?: boolean;
};

export const Rewards = ({
  rewards,
  hideExperienceDescription = false,
}: Props) => {
  const { formatNumber } = useIntl();
  const { experiencesDetails, cards } = rewards;
  const cardRewards = getCardRewards(cards as CardsInRewards);

  return (
    <Root>
      {!!experiencesDetails.length &&
        experiencesDetails.map((exp, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <RewardsContainer key={index}>
            <ExperienceIcon type={exp.type} sm />
            {!hideExperienceDescription && exp.description}
          </RewardsContainer>
        ))}
      {!!rewards?.prizePool && (
        <RewardsContainer>
          {rewards?.prizePoolCurrency === PaymentCurrency.ETH ? (
            <Eth />
          ) : (
            <Fiat />
          )}
          {formatNumber(rewards.prizePool, {
            style: 'currency',
            currency: rewards.prizePoolCurrency,
            currencyDisplay: 'narrowSymbol',
            trailingZeroDisplay: 'stripIfInteger',
            minimumFractionDigits: 0,
          })}
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
    </Root>
  );
};

Rewards.fragments = {
  reward: gql`
    fragment Rewards_rewardsOverview on RewardsOverview {
      cards
      prizePool
      prizePoolCurrency
      experiencesDetails {
        type
        description
      }
    }
  `,
};

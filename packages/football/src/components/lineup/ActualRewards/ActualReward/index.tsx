import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedNumber } from 'react-intl';
import { generatePath, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import {
  CardQuality,
  Currency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import Coin from '@sorare/core/src/atoms/icons/Coin';
import { Eth } from '@sorare/core/src/atoms/icons/Eth';
import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { FOOTBALL_CARD_SHOW } from '@sorare/core/src/constants/routes';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';
import { qualityNames } from '@sorare/core/src/lib/players';
import { ScarcityType } from '@sorare/core/src/lib/scarcity';

import { ActualReward_so5Reward } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const rewardWrapperStyle = css`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;
const RewardWrapper = styled.div`
  ${rewardWrapperStyle}
`;
const CardRewardWrapper = styled.div`
  ${rewardWrapperStyle}
  padding: var(--half-unit);
  border-radius: var(--half-unit);
  &:hover,
  &:focus {
    background: var(--c-neutral-100);
  }
`;

type Props = {
  reward: ActualReward_so5Reward;
};

export const ActualReward = ({ reward }: Props) => {
  const { rewardCards, aasmState, amount, coinAmount } = reward;
  const isClaimed = aasmState === 'claimed';
  const navigate = useNavigate();
  const location = useBgLocation(true);
  const { main } = useAmountWithConversion({
    monetaryAmount: amount || {
      wei: '0',
      referenceCurrency: SupportedCurrency.WEI,
    },
    primaryCurrency: Currency.ETH,
  });
  return (
    <Wrapper>
      {amount && (
        <RewardWrapper as="div">
          <Eth />
          {main}
        </RewardWrapper>
      )}
      {!!coinAmount && (
        <RewardWrapper>
          <Coin />
          <FormattedNumber value={coinAmount} />
        </RewardWrapper>
      )}
      {rewardCards.filter(Boolean).map(({ quality, card }) =>
        isClaimed ? (
          <CardRewardWrapper
            key={card?.assetId}
            onClick={e => {
              e.preventDefault();
              navigate(generatePath(FOOTBALL_CARD_SHOW, { slug: card?.slug }), {
                state: { backgroundState: location },
              });
            }}
          >
            <ScarcityIcon scarcity={card?.rarity as ScarcityType} />
            {card?.player.displayName}
          </CardRewardWrapper>
        ) : (
          <RewardWrapper key={card?.assetId}>
            <ScarcityIcon scarcity={card?.rarity as ScarcityType} />
            {quality && qualityNames[quality as CardQuality]}
          </RewardWrapper>
        )
      )}
    </Wrapper>
  );
};

ActualReward.fragments = {
  so5Reward: gql`
    fragment ActualReward_so5Reward on So5Reward {
      slug
      amount {
        ...MonetaryAmountFragment_monetaryAmount
      }
      coinAmount
      aasmState
      rewardCards {
        id
        quality
        card {
          assetId
          slug
          rarity
          player {
            slug
            displayName
          }
        }
      }
    }
    ${monetaryAmountFragment}
  ` as TypedDocumentNode<ActualReward_so5Reward>,
};

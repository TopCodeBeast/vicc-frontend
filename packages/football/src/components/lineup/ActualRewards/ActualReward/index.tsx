import { gql } from '@apollo/client';
import { FormattedNumber } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled, { css } from 'styled-components';

import {
  CardQuality,
  Currency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import Coin from '@sorare/core/src/atoms/icons/Coin';
import { Eth } from '@sorare/core/src/atoms/icons/Eth';
import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { LinkOther } from '@sorare/core/src/atoms/navigation/Box';
import { FOOTBALL_CARD_SHOW } from '@sorare/core/src/constants/routes';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import { qualityNames } from '@sorare/core/src/lib/players';
import { ScarcityType } from '@sorare/core/src/lib/scarcity';
import { Link } from '@sorare/core/src/routing/Link';
import { theme } from '@sorare/core/src/style/theme';

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
const CardRewardWrapper = styled(LinkOther)`
  ${rewardWrapperStyle}
  padding: var(--half-unit);
  border-radius: ${theme.radius.xxs}px;
  &:hover,
  &:focus {
    background: var(--c-neutral-100);
  }
`;

type Props = {
  reward: ActualReward_so5Reward;
};

export const ActualReward = ({ reward }: Props) => {
  const { rewardCards, aasmState, weiAmount, coinAmount } = reward;
  const isClaimed = aasmState === 'claimed';
  const { main } = useAmountWithConversion({
    monetaryAmount: {
      referenceCurrency: SupportedCurrency.WEI,
      [SupportedCurrency.WEI.toLowerCase()]: weiAmount,
    },
    primaryCurrency: Currency.ETH,
  });
  return (
    <Wrapper>
      {weiAmount && weiAmount !== '0' && (
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
            as={Link}
            to={generatePath(FOOTBALL_CARD_SHOW, { slug: card?.slug })}
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
      weiAmount
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
  `,
};

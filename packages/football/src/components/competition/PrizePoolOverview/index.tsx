import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import {
  PaymentCurrency,
  Rarity,
} from '@sorare/core/src/__generated__/globalTypes';
import Coin from '@sorare/core/src/atoms/icons/Coin';
import { Eth } from '@sorare/core/src/atoms/icons/Eth';
import { Fiat } from '@sorare/core/src/atoms/icons/Fiat';
import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { LinkBox, LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { Text16, Title3, Title5 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_COMPETITION_DETAILS_REWARDS } from '@sorare/core/src/constants/routes';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import { scarcityNames } from '@sorare/core/src/lib/cards';
import { glossary } from '@sorare/core/src/lib/glossary';
import { asObject } from '@sorare/core/src/lib/json';
import { getCardRewards } from '@sorare/core/src/lib/rewards';

import textureImage from '@football/assets/lobby/texture.png';
import trophyImage from '@football/assets/lobby/trophy.png';
import { lineupMessages } from '@football/lib/lineup/messages';

import {
  PrizePoolOverview_leaderboardRewardsConfig,
  PrizePoolOverview_rewardsOverview,
} from './__generated__/index.graphql';

const RARITY_STYLES = {
  common: {
    border: 'linear-gradient(0deg, #c6c6c6 0%, #f0f0f0 100%)',
    background: 'linear-gradient(90deg, #bfbfbf 0%, #ffffff 100%)',
  },
  limited: {
    border: 'linear-gradient(45deg, #787300 0%, #faff00 100%)',
    background: 'linear-gradient(90deg, #7e6300 0%, #ffe817 100%)',
  },
  rare: {
    border: 'linear-gradient(45deg, #ff6b00 0%, #ff645a 100%)',
    background: 'linear-gradient(90deg, #a40000 0%, #ff0000 100%)',
  },
  super_rare: {
    border: 'linear-gradient(45deg, #000aff 0%, #73d5ff 100%)',
    background: 'linear-gradient(90deg, #000a62 0%, #0038ff 100%)',
  },
  unique: {
    border: 'linear-gradient(45deg, #585858 0%, #ffe382 100%)',
    background: 'linear-gradient(90deg, #3a3a3a 0%, #717171 100%)',
  },
} as const;

const Wrapper = styled(LinkBox)`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const PrizePoolWrapper = styled.div<{ rarity: Rarity | undefined }>`
  display: flex;
  flex-direction: column;
  isolation: isolate;
  border-radius: var(--double-unit);
  overflow: hidden;
  position: relative;
  background: ${({ rarity }) => {
    return rarity && rarity !== 'custom_series'
      ? RARITY_STYLES[rarity].border
      : 'transparent';
  }};
  color: var(--c-static-neutral-100);
  &:before {
    border-radius: var(--double-unit);
    content: '';
    inset: 1px;
    position: absolute;
    background: #080808 url(${textureImage}) right/contain no-repeat;
  }
  &:after {
    content: '';
    inset: 1px;
    position: absolute;
    background: ${({ rarity }) => {
      return rarity && rarity !== 'custom_series'
        ? RARITY_STYLES[rarity].background
        : 'transparent';
    }};
    opacity: 0.43;
  }
`;
const PrizePoolInnerWrapper = styled.div`
  flex: 1;
  padding: var(--quadruple-unit) var(--double-unit);
  border-radius: var(--double-unit);
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const RewardRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  z-index: 2;
  & > *:first-child {
    width: 24px;
    text-align: right;
  }
`;
const TrophyImg = styled.img`
  top: 0;
  right: 0;
  height: 100%;
  position: absolute;
  z-index: 1;
`;
const InnerLink = styled(LinkOverlay)`
  position: absolute;
  inset: 0;
  z-index: 2;
`;

type Props = {
  totalRewards?: PrizePoolOverview_rewardsOverview;
  rewardsConfig?: PrizePoolOverview_leaderboardRewardsConfig;
  displaySemiProIncentive?: boolean;
  vicc5LeaderboardSlug?: string;
};
const PrizePoolOverview = ({
  totalRewards,
  rewardsConfig,
  displaySemiProIncentive,
  vicc5LeaderboardSlug,
}: Props) => {
  const { formatNumber } = useIntl();

  const bgLocation = useBgLocation();

  if (!totalRewards || !rewardsConfig) {
    return null;
  }

  const cardRewards = getCardRewards(asObject(totalRewards.cards));

  const hasCoinRewards = rewardsConfig.conditional?.some(c => !!c?.coinAmount);
  const lowestScoreForCoinRewards = Math.min(
    ...(rewardsConfig.conditional
      ?.filter(c => !!c?.coinAmount && typeof c.score === 'number')
      .map(c => c.score as number) || [])
  );

  if (!hasCoinRewards && !cardRewards.length && !totalRewards.prizePool) {
    return null;
  }
  return (
    <Wrapper>
      <div>
        <Title5 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="Lobby.CompetitionDetails.prizePool"
            defaultMessage="Prize pool"
          />
        </Title5>
        {displaySemiProIncentive && (
          <Text16 color="var(--c-static-green-300)" bold>
            <FormattedMessage {...lineupMessages.prizePoolIncentive} />
          </Text16>
        )}
      </div>
      <PrizePoolWrapper
        rarity={cardRewards.length > 0 ? cardRewards[0].rarity : undefined}
      >
        <PrizePoolInnerWrapper>
          <TrophyImg src={trophyImage} />
          {cardRewards.map((cardReward, index) => {
            const message = (
              <FormattedMessage
                id="Lobby.CompetitionDetails.numberOfCards"
                defaultMessage="{nb, plural, =0 {{scarcity} Cards} one {# {scarcity} Card} other {# {scarcity} Cards}}"
                values={{
                  nb: cardReward.nb || 0,
                  scarcity:
                    scarcityNames[cardReward.rarity] || cardReward.rarity,
                }}
              />
            );
            const isFirstReward = index === 0;
            return (
              <RewardRow key={cardReward.rarity}>
                <span>
                  <ScarcityIcon
                    scarcity={cardReward.rarity}
                    size={isFirstReward ? 'lg' : 'sm'}
                  />
                </span>
                {isFirstReward ? (
                  <Title3>{message}</Title3>
                ) : (
                  <Text16 bold>{message}</Text16>
                )}
              </RewardRow>
            );
          })}
          {!!totalRewards.prizePool && (
            <RewardRow>
              <span>
                {totalRewards.prizePoolCurrency === PaymentCurrency.ETH ? (
                  <Eth />
                ) : (
                  <Fiat />
                )}
              </span>
              <Text16 bold>
                {formatNumber(totalRewards.prizePool, {
                  style: 'currency',
                  currency: totalRewards.prizePoolCurrency,
                  currencyDisplay: 'narrowSymbol',
                  trailingZeroDisplay: 'stripIfInteger',
                  minimumFractionDigits: 0,
                })}
              </Text16>
            </RewardRow>
          )}
          {hasCoinRewards && (
            <RewardRow>
              <span>
                <Coin />
              </span>
              <Text16 bold>
                {lowestScoreForCoinRewards === 0 ? (
                  <FormattedMessage
                    id="Lobby.CompetitionDetails.coinRewardsForEveryone"
                    defaultMessage="Coin rewards for every participant"
                  />
                ) : (
                  <FormattedMessage {...glossary.coins} />
                )}
              </Text16>
            </RewardRow>
          )}
          {vicc5LeaderboardSlug && (
            <InnerLink
              as={Link}
              to={generatePath(FOOTBALL_COMPETITION_DETAILS_REWARDS, {
                competition: vicc5LeaderboardSlug,
              })}
              state={{
                backgroundState: bgLocation,
              }}
            />
          )}
        </PrizePoolInnerWrapper>
      </PrizePoolWrapper>
    </Wrapper>
  );
};

PrizePoolOverview.fragments = {
  leaderboardRewardsConfig: gql`
    fragment PrizePoolOverview_leaderboardRewardsConfig on LeaderboardRewardsConfig {
      conditional {
        score
        coinAmount
      }
    }
  ` as TypedDocumentNode<PrizePoolOverview_leaderboardRewardsConfig>,
  rewardsOverview: gql`
    fragment PrizePoolOverview_rewardsOverview on RewardsOverview {
      cards
      prizePool
      prizePoolCurrency
    }
  ` as TypedDocumentNode<PrizePoolOverview_rewardsOverview>,
};

export default PrizePoolOverview;

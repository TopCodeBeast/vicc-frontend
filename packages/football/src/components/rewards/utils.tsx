import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text14, Title2, Title3 } from '@sorare/core/src/atoms/typography';
import CardBack from '@sorare/core/src/components/card/Back/Football';
import CardFront from '@sorare/core/src/components/card/Front';
import Coins from '@sorare/core/src/components/rewards/Coins';
import { Eth } from '@sorare/core/src/components/rewards/Eth';
import { Reward } from '@sorare/core/src/components/rewards/types';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { FOOTBALL_CLUB_SHOP } from '@sorare/core/src/constants/routes';
import { scarcityNames } from '@sorare/core/src/lib/cards';
import { withFragments } from '@sorare/core/src/lib/gql';

import { RewardHeader } from '@football/components/rewards/Header';

import { formatReward_so5Reward } from './__generated__/utils.graphql';

const CoinRewardHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: var(--triple-unit);
  gap: var(--triple-unit);
  align-items: center;
  justify-content: center;
  height: 100%;
`;
const ClickableButtonLink = styled(Button)`
  /* Override the rewards banner dialog header value (pointer-events: none) */
  pointer-events: all;
`;

type UniqueReward = {
  ids: string[];
  so5Ranking: formatReward_so5Reward['so5Ranking'] | null;
  so5UserGroupMembership:
    | formatReward_so5Reward['so5UserGroupMembership']
    | null;
  rewardCard?: formatReward_so5Reward['rewardCards'][number];
  weiAmount?: string;
  coinAmount?: number;
  claimed: boolean;
  so5Fixture: formatReward_so5Reward['so5Fixture'] | null;
};

const format = ({
  ids,
  rewardCard,
  weiAmount,
  coinAmount,
  so5Ranking,
  claimed,
  so5UserGroupMembership,
  so5Fixture,
}: UniqueReward) => {
  const { gameWeek } = so5Fixture || {};
  const { score, ranking } = so5Ranking || so5UserGroupMembership || {};
  const { card, backPictureUrl } = rewardCard || {};
  const { rarity, player } = card || {};
  const title =
    so5Ranking?.so5Lineup?.so5Leaderboard?.displayName ||
    so5UserGroupMembership?.so5UserGroup?.displayName ||
    '';

  const isCoinReward = (coinAmount || 0) > 0;
  const isEthReward = (Number(weiAmount) || 0) > 0;

  let rewardProperties = {
    backgroundText: (rarity && scarcityNames[rarity]) || '',
    backPath: backPictureUrl!,
    header: (
      <RewardHeader
        title={title}
        rank={ranking || 0}
        points={score || 0}
        gameWeek={gameWeek!}
      />
    ),
  };
  if (isCoinReward) {
    rewardProperties = {
      ...rewardProperties,
      backgroundText: 'Coins',
      backPath: `${FRONTEND_ASSET_HOST}/cards/back/coin.png`,
      header: (
        <CoinRewardHeader>
          <Title2 color="var(--c-static-neutral-100)">
            <FormattedMessage
              id="rewards.Header.Coins"
              defaultMessage="Coins"
            />
          </Title2>
          <Text14>
            <FormattedMessage
              id="rewards.Header.Coins.Subtitle"
              defaultMessage="Spend coins on a variety of rewards"
            />
          </Text14>
          <ClickableButtonLink
            component={Link}
            to={FOOTBALL_CLUB_SHOP}
            color="dark"
            small
          >
            <FormattedMessage
              id="rewards.Header.Coins.Cta"
              defaultMessage="Go to Club Shop"
            />
          </ClickableButtonLink>
        </CoinRewardHeader>
      ),
    };
  }
  if (isEthReward) {
    rewardProperties = {
      ...rewardProperties,
      backgroundText: 'Ether',
      backPath: `${FRONTEND_ASSET_HOST}/cards/back/ethereum.svg`,
    };
  }

  return {
    ids,
    key:
      rewardCard?.id || (coinAmount ? coinAmount.toString() : null) || ids[0],
    backgroundText: rewardProperties.backgroundText,
    header: rewardProperties.header,
    back: (
      <CardBack
        path={rewardProperties.backPath}
        radius={rarity === 'custom_series' ? '30px' : '10px'}
      />
    ),
    front: (isClaimed?: boolean) => (
      <>
        {card?.pictureUrl && <CardFront src={card.pictureUrl} />}
        {weiAmount && <Eth amount={weiAmount} />}
        {coinAmount && <Coins video={isClaimed} amount={coinAmount} />}
      </>
    ),
    teasers:
      weiAmount || !rewardCard
        ? []
        : [
            player?.country.flagUrl && (
              <img key={0} src={player?.country.flagUrl} alt="" />
            ),
            <Title3 key={1}>{player?.position.slice(0, 3)}</Title3>,
            player?.activeClub?.pictureUrl && (
              <img key={2} src={player?.activeClub?.pictureUrl} alt="" />
            ),
          ].filter(Boolean),
    claimed,
  };
};

export const formatReward = withFragments(
  (array: formatReward_so5Reward[]): Reward[] => {
    const coinReward: UniqueReward = {
      ids: [],
      so5Ranking: null,
      so5UserGroupMembership: null,
      coinAmount: 0,
      claimed: true,
      so5Fixture: null,
    };
    const rewards: UniqueReward[] = [];

    array.forEach(
      ({
        id,
        so5Ranking,
        so5UserGroupMembership,
        rewardCards,
        weiAmount,
        coinAmount,
        aasmState,
        so5Fixture,
      }: formatReward_so5Reward) => {
        const currentReward = {
          ids: [id],
          so5Ranking,
          so5UserGroupMembership,
          so5Fixture,
          claimed: aasmState === 'claimed',
        };
        if (coinAmount > 0 && coinReward.coinAmount !== undefined) {
          coinReward.coinAmount += coinAmount;
          if (aasmState !== 'claimed') {
            coinReward.claimed = false;
            coinReward.ids.push(id);
          }
        }
        if (+weiAmount > 0) {
          rewards.push({
            ...currentReward,
            weiAmount,
          });
        }
        rewardCards.forEach(card => {
          rewards.push({
            ...currentReward,
            rewardCard: card,
          });
        });
        return rewards;
      }
    );
    if (coinReward.coinAmount) {
      rewards.push(coinReward);
    }

    return rewards.map(format).sort((a, b) => a.key.localeCompare(b.key)) as any; //TODO***
  },
  {
    so5Reward: gql`
      fragment formatReward_so5Reward on Vicc5Reward {
        slug
        id
        coinAmount
        weiAmount: amount
        aasmState
        so5Ranking: vicc5Ranking {
          id
          so5Lineup: vicc5Lineup {
            id
            so5Leaderboard: vicc5Leaderboard {
              slug
              displayName
            }
          }
          ranking
          score
        }
        so5UserGroupMembership: vicc5UserGroupMembership {
          id
          ranking
          score
          so5UserGroup: vicc5UserGroup {
            slug
            id
            displayName
          }
        }
        rewardCards {
          id
          card {
            id
            slug
            assetId
            rarity
            player {
              slug
              position: positionTyped
              age
              country {
                slug
                flagUrl(size: 32)
              }
              activeClub {
                slug
                pictureUrl
              }
            }
            pictureUrl: pictureUrl(derivative: "tinified")
          }
          backPictureUrl
        }
        so5Fixture: vicc5Fixture {
          slug
          gameWeek
        }
      }
    `,
  }
);

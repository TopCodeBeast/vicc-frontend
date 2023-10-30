import { TypedDocumentNode, gql } from '@apollo/client';
import Big from 'bignumber.js';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import {
  Currency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text14, Title2, Title3 } from '@sorare/core/src/atoms/typography';
import CardBack from '@sorare/core/src/components/card/Back/Football';
import CardFront from '@sorare/core/src/components/card/Front';
import { BackCoinReward } from '@sorare/core/src/components/rewards/CoinReward/Back';
import { FrontCoinReward } from '@sorare/core/src/components/rewards/CoinReward/Front';
import { BackMonetaryReward } from '@sorare/core/src/components/rewards/MonetaryReward/BackMonetaryReward';
import { FrontMonetaryReward } from '@sorare/core/src/components/rewards/MonetaryReward/FrontMonetaryReward';
import { Reward } from '@sorare/core/src/components/rewards/types';
import { FOOTBALL_CLUB_SHOP } from '@sorare/core/src/constants/routes';
import { withFragments } from '@sorare/core/src/lib/gql';
import {
  MonetaryAmountCurrency,
  monetaryAmountFragment,
} from '@sorare/core/src/lib/monetaryAmount';

import { RewardHeader } from '@football/components/rewards/Header';

import {
  formatCardRewards_vicc5Reward,
  formatCoinRewards_vicc5Reward,
  formatMonetaryRewards_vicc5Reward,
  formatReward_vicc5Reward,
} from './__generated__/utils.graphql';

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

const formatCoinRewards = withFragments(
  (coinRewards: formatCoinRewards_vicc5Reward[]): Reward | null => {
    if (!coinRewards.length) return null;

    const totalCoinAmount = coinRewards.reduce(
      (acc, reward) => acc + reward.coinAmount,
      0
    );

    return {
      ids: coinRewards.map(reward => reward.id),
      key: totalCoinAmount.toString(),
      backgroundText: 'Coins',
      back: <BackCoinReward />,
      front: (isClaimed?: boolean) => (
        <FrontCoinReward video={isClaimed} amount={totalCoinAmount} />
      ),
      teasers: [],
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
      claimed: coinRewards.every(reward => reward.aasmState === 'claimed'),
    };
  },
  {
    vicc5Reward: gql`
      fragment formatCoinRewards_vicc5Reward on Vicc5Reward {
        id
        slug
        aasmState
        coinAmount
      }
    ` as TypedDocumentNode<formatCoinRewards_vicc5Reward>,
  }
);

const formatMonetaryRewards = withFragments(
  (
    monetaryRewards: formatMonetaryRewards_vicc5Reward[],
    { onClaimFiatRewards }: { onClaimFiatRewards?: () => void } = {}
  ): Reward[] => {
    if (!monetaryRewards.length) return [];

    return monetaryRewards
      .map(reward => {
        const {
          id,
          aasmState,
          amount,
          vicc5Fixture,
          vicc5Ranking,
          vicc5UserGroupMembership,
        } = reward;

        if (
          !amount ||
          new Big(
            amount[
              amount.referenceCurrency.toLowerCase() as MonetaryAmountCurrency
            ] || 0
          ).eq(0)
        )
          return null;

        const { gameWeek } = vicc5Fixture || {};
        const { score, ranking } = vicc5Ranking || vicc5UserGroupMembership || {};
        const title =
          vicc5Ranking?.vicc5Lineup?.vicc5Leaderboard?.displayName ||
          vicc5UserGroupMembership?.vicc5UserGroup?.displayName ||
          '';

        const currency =
          amount?.referenceCurrency === SupportedCurrency.WEI
            ? Currency.ETH
            : Currency.FIAT;

        return {
          ids: [id],
          key: id,
          backgroundText: 'Cash',
          back: <BackMonetaryReward currency={currency} />,
          front: <FrontMonetaryReward monetaryAmount={amount} />,
          teasers: [],
          header: (
            <RewardHeader
              title={title}
              rank={ranking || 0}
              points={score || 0}
              gameWeek={gameWeek!}
            />
          ),
          claimed: aasmState === 'claimed',
          ...(currency === Currency.FIAT && onClaimFiatRewards
            ? { onClick: () => onClaimFiatRewards() }
            : {}),
        };
      })
      .filter(Boolean);
  },
  {
    vicc5Reward: gql`
      fragment formatMonetaryRewards_vicc5Reward on Vicc5Reward {
        id
        slug
        aasmState
        amount {
          ...MonetaryAmountFragment_monetaryAmount
        }
        vicc5Ranking {
          id
          vicc5Lineup {
            id
            vicc5Leaderboard {
              slug
              displayName
            }
          }
          ranking
          score
        }
        vicc5UserGroupMembership {
          id
          ranking
          score
          vicc5UserGroup {
            slug
            id
            displayName
          }
        }
        vicc5Fixture {
          slug
          gameWeek
        }
      }
      ${monetaryAmountFragment}
    ` as TypedDocumentNode<formatMonetaryRewards_vicc5Reward>,
  }
);

const formatCardRewards = withFragments(
  (cardRewards: formatCardRewards_vicc5Reward[]): Reward[] => {
    if (!cardRewards.length) return [];

    return cardRewards
      .map(reward => {
        const {
          id,
          aasmState,
          vicc5Fixture,
          vicc5Ranking,
          vicc5UserGroupMembership,
          rewardCards,
        } = reward;

        const { gameWeek } = vicc5Fixture || {};
        const { score, ranking } = vicc5Ranking || vicc5UserGroupMembership || {};
        const title =
          vicc5Ranking?.vicc5Lineup?.vicc5Leaderboard?.displayName ||
          vicc5UserGroupMembership?.vicc5UserGroup?.displayName ||
          '';

        return rewardCards
          .map(({ id: rewardCardId, card, backPictureUrl }) => {
            if (!card) return null;

            const { pictureUrl, player } = card;

            return {
              ids: [id],
              key: rewardCardId,
              backgroundText: 'Ether',
              back: (
                <>
                  {backPictureUrl && (
                    <CardBack path={backPictureUrl} radius="10px" />
                  )}
                </>
              ),
              front: <>{pictureUrl && <CardFront src={pictureUrl} />}</>,
              teasers: [
                player?.country.flagUrl && (
                  <img key={0} src={player?.country.flagUrl} alt="" />
                ),
                <Title3 key={1}>{player?.position.slice(0, 3)}</Title3>,
                player?.activeClub?.pictureUrl && (
                  <img key={2} src={player?.activeClub?.pictureUrl} alt="" />
                ),
              ].filter(Boolean),
              header: (
                <RewardHeader
                  title={title}
                  rank={ranking || 0}
                  points={score || 0}
                  gameWeek={gameWeek!}
                />
              ),
              claimed: aasmState === 'claimed',
            };
          })
          .filter(Boolean);
      })
      .flat();
  },
  {
    vicc5Reward: gql`
      fragment formatCardRewards_vicc5Reward on Vicc5Reward {
        id
        slug
        aasmState
        vicc5Ranking {
          id
          vicc5Lineup {
            id
            vicc5Leaderboard {
              slug
              displayName
            }
          }
          ranking
          score
        }
        vicc5UserGroupMembership {
          id
          ranking
          score
          vicc5UserGroup {
            slug
            id
            displayName
          }
        }
        vicc5Fixture {
          slug
          gameWeek
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
              position
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
      }
    ` as TypedDocumentNode<formatCardRewards_vicc5Reward>,
  }
);

export const formatReward = withFragments(
  (
    rewards: formatReward_vicc5Reward[],
    { onClaimFiatRewards }: { onClaimFiatRewards?: () => void } = {}
  ): Reward[] => {
    const coinReward = formatCoinRewards(
      rewards.filter(reward => reward.coinAmount > 0)
    );
    const monetaryRewards = formatMonetaryRewards(
      rewards.filter(reward => reward.amount),
      { onClaimFiatRewards }
    );
    const cardRewards = formatCardRewards(
      rewards.filter(reward => !!reward.rewardCards.length)
    );

    return [
      ...(coinReward ? [coinReward] : []),
      ...monetaryRewards,
      ...cardRewards,
    ];
  },
  {
    vicc5Reward: gql`
      fragment formatReward_vicc5Reward on Vicc5Reward {
        slug
        id
        coinAmount
        amount {
          referenceCurrency
        }
        rewardCards {
          id
        }
        ...formatCoinRewards_vicc5Reward
        ...formatMonetaryRewards_vicc5Reward
        ...formatCardRewards_vicc5Reward
      }
      ${formatCoinRewards.fragments.vicc5Reward}
      ${formatMonetaryRewards.fragments.vicc5Reward}
      ${formatCardRewards.fragments.vicc5Reward}
    ` as TypedDocumentNode<formatReward_vicc5Reward>,
  }
);

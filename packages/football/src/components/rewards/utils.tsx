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
  formatCardRewards_so5Reward,
  formatCoinRewards_so5Reward,
  formatMonetaryRewards_so5Reward,
  formatReward_so5Reward,
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
  (coinRewards: formatCoinRewards_so5Reward[]): Reward | null => {
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
    so5Reward: gql`
      fragment formatCoinRewards_so5Reward on So5Reward {
        id
        slug
        aasmState
        coinAmount
      }
    ` as TypedDocumentNode<formatCoinRewards_so5Reward>,
  }
);

const formatMonetaryRewards = withFragments(
  (
    monetaryRewards: formatMonetaryRewards_so5Reward[],
    { onClaimFiatRewards }: { onClaimFiatRewards?: () => void } = {}
  ): Reward[] => {
    if (!monetaryRewards.length) return [];

    return monetaryRewards
      .map(reward => {
        const {
          id,
          aasmState,
          amount,
          so5Fixture,
          so5Ranking,
          so5UserGroupMembership,
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

        const { gameWeek } = so5Fixture || {};
        const { score, ranking } = so5Ranking || so5UserGroupMembership || {};
        const title =
          so5Ranking?.so5Lineup?.so5Leaderboard?.displayName ||
          so5UserGroupMembership?.so5UserGroup?.displayName ||
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
    so5Reward: gql`
      fragment formatMonetaryRewards_so5Reward on So5Reward {
        id
        slug
        aasmState
        amount {
          ...MonetaryAmountFragment_monetaryAmount
        }
        so5Ranking {
          id
          so5Lineup {
            id
            so5Leaderboard {
              slug
              displayName
            }
          }
          ranking
          score
        }
        so5UserGroupMembership {
          id
          ranking
          score
          so5UserGroup {
            slug
            id
            displayName
          }
        }
        so5Fixture {
          slug
          gameWeek
        }
      }
      ${monetaryAmountFragment}
    ` as TypedDocumentNode<formatMonetaryRewards_so5Reward>,
  }
);

const formatCardRewards = withFragments(
  (cardRewards: formatCardRewards_so5Reward[]): Reward[] => {
    if (!cardRewards.length) return [];

    return cardRewards
      .map(reward => {
        const {
          id,
          aasmState,
          so5Fixture,
          so5Ranking,
          so5UserGroupMembership,
          rewardCards,
        } = reward;

        const { gameWeek } = so5Fixture || {};
        const { score, ranking } = so5Ranking || so5UserGroupMembership || {};
        const title =
          so5Ranking?.so5Lineup?.so5Leaderboard?.displayName ||
          so5UserGroupMembership?.so5UserGroup?.displayName ||
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
    so5Reward: gql`
      fragment formatCardRewards_so5Reward on So5Reward {
        id
        slug
        aasmState
        so5Ranking {
          id
          so5Lineup {
            id
            so5Leaderboard {
              slug
              displayName
            }
          }
          ranking
          score
        }
        so5UserGroupMembership {
          id
          ranking
          score
          so5UserGroup {
            slug
            id
            displayName
          }
        }
        so5Fixture {
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
      }
    ` as TypedDocumentNode<formatCardRewards_so5Reward>,
  }
);

export const formatReward = withFragments(
  (
    rewards: formatReward_so5Reward[],
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
    so5Reward: gql`
      fragment formatReward_so5Reward on So5Reward {
        slug
        id
        coinAmount
        amount {
          referenceCurrency
        }
        rewardCards {
          id
        }
        ...formatCoinRewards_so5Reward
        ...formatMonetaryRewards_so5Reward
        ...formatCardRewards_so5Reward
      }
      ${formatCoinRewards.fragments.so5Reward}
      ${formatMonetaryRewards.fragments.so5Reward}
      ${formatCardRewards.fragments.so5Reward}
    ` as TypedDocumentNode<formatReward_so5Reward>,
  }
);

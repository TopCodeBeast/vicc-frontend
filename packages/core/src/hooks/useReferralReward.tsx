import { gql } from '@apollo/client';
import { useMemo } from 'react';

import { ShippingState, Sport } from '@core/__generated__/globalTypes';
import { RewardState } from '@core/__generated__/usSportsGlobalTypes';
import { Title3 } from '@core/atoms/typography';
import { CardBack as CardBackFootball } from '@core/components/card/Back/Football';
import { USSportCardBack } from '@core/components/cards/Back';
import { FRONTEND_ASSET_HOST } from '@core/constants/assets';
import { isA } from 'gql';
import idFromObject from '@core/gql/idFromObject';
import { getPositionInitials as getMLBPositionInitials } from '@core/lib/baseball';
import { getPositionInitials as getNBAPositionInitials } from '@core/lib/nba';
import {
  BaseballReferralRewardsQuery,
  BaseballReferralRewardsQueryVariables,
  NBAReferralRewardsQuery,
} from '@core/lib/usSportsGraphql/__generated__/queries.graphql';
import {
  BASEBALL_REFERRAL_REWARDS_QUERY,
  NBA_REFERRAL_REWARDS_QUERY,
} from '@core/lib/usSportsGraphql/queries';

import { useReferralReward_referralReward } from './__generated__/useReferralReward.graphql';
import { useBaseballQuery } from './graphql/baseball';
import { useClaimReferralReward } from './referral/useClaimReferralReward';

const referralRewardsQueryBySport = {
  [Sport.BASEBALL]: BASEBALL_REFERRAL_REWARDS_QUERY,
  [Sport.NBA]: NBA_REFERRAL_REWARDS_QUERY,
  [Sport.FOOTBALL]: undefined,
};

type BaseballReferralRewardsQuery_usSportReferralRewards = NonNullable<
  BaseballReferralRewardsQuery['usSportReferralRewards']
>[number];

export const useReferralReward = (
  reward: useReferralReward_referralReward | null
) => {
  const claim = useClaimReferralReward(reward);

  const query =
    referralRewardsQueryBySport[reward?.token.sport || Sport.FOOTBALL] ||
    BASEBALL_REFERRAL_REWARDS_QUERY;

  const { data, loading } = useBaseballQuery<
    BaseballReferralRewardsQuery | NBAReferralRewardsQuery,
    BaseballReferralRewardsQueryVariables
  >(query, {
    variables: {
      referralIDs: [idFromObject(reward?.id)],
    },
    skip: !reward || !query || reward.token.sport === Sport.FOOTBALL,
  });

  const claimed = useMemo(() => {
    if (!reward || loading) return false;
    if (reward.token.sport === Sport.FOOTBALL)
      return reward.shippingState === ShippingState.CLAIMED;
    if (data?.usSportReferralRewards?.[0].state === RewardState.CLAIMED)
      return true;
    return false;
  }, [data?.usSportReferralRewards, loading, reward]);

  const baseballReferralReward = data?.usSportReferralRewards?.[0];

  const cardBack = useMemo(() => {
    if (!reward) return null;

    if (reward.token.sport === Sport.FOOTBALL) {
      const {
        card,
        token: {
          metadata: { rarity },
        },
      } = reward;
      const isCustomSeriesReward = rarity === 'custom_series';

      return (
        <CardBackFootball
          path={
            card?.backPictureUrl ||
            `${FRONTEND_ASSET_HOST}/cards/back/${rarity}.svg`
          }
          radius={isCustomSeriesReward ? '30px' : '10px'}
        />
      );
    }

    if (!baseballReferralReward) return null;

    return (
      <USSportCardBack
        sport={reward.token.sport}
        scarcity={baseballReferralReward.card.rarity}
      />
    );
  }, [baseballReferralReward, reward]);

  const teasers = useMemo(() => {
    if (!reward) return [];

    if (reward.token.sport === Sport.FOOTBALL) {
      const { card } = reward;

      return [
        <img key={0} src={card?.player?.activeClub?.pictureUrl || ''} alt="" />,
        <Title3 key={1}>{card?.player.age}</Title3>,
        <Title3 key={2}>{card?.player.position.slice(0, 3)}</Title3>,
      ];
    }

    if (!baseballReferralReward) return [];

    const initials = isA<BaseballReferralRewardsQuery_usSportReferralRewards>(
      'BaseballReferralReward',
      baseballReferralReward
    )
      ? getMLBPositionInitials(baseballReferralReward.card.player.positions[0])
      : getNBAPositionInitials(baseballReferralReward.card.player.positions[0]);

    return [
      <img
        key={0}
        src={baseballReferralReward.card.team?.svgUrl || ''}
        alt=""
      />,
      <Title3 key={1}>{initials}</Title3>,
    ];
  }, [baseballReferralReward, reward]);

  return {
    claim,
    claimed,
    usSportsReferralRewards: data?.usSportReferralRewards,
    cardBack,
    teasers,
  };
};

useReferralReward.fragments = {
  referralReward: gql`
    fragment useReferralReward_referralReward on ReferralReward {
      id
      shippingState
      token {
        assetId
        slug
        sport
        metadata {
          ... on TokenBaseballMetadata {
            id
          }
          ... on TokenFootballMetadata {
            id
          }
          ... on TokenCardMetadataInterface {
            rarity
          }
        }
      }
      card {
        slug
        assetId
        backPictureUrl
        player {
          slug
          position: positionTyped
          age
          activeClub {
            slug
            pictureUrl
          }
        }
      }
      ...useClaimReferralReward_referralReward
    }
    ${useClaimReferralReward.fragments.referralReward}
  `,
};

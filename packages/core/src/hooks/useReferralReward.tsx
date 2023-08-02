import { TypedDocumentNode, gql } from '@apollo/client';
import type { ResultOf, VariablesOf } from '@graphql-typed-document-node/core';
import { useMemo } from 'react';
import styled from 'styled-components';

import { RewardState, ShippingState, Sport } from '__generated__/globalTypes';
import discountCardBack from '@core/assets/rewards/discount-card-back.png';
import { Title3 } from '@core/atoms/typography';
import { CardBack as CardBackFootball } from '@core/components/card/Back/Football';
import { USSportCardBack } from '@core/components/cards/Back';
import { FRONTEND_ASSET_HOST } from '@core/constants/assets';
import { isType } from 'gql';
import idFromObject from '@core/gql/idFromObject';
import { getPositionInitials as getMLBPositionInitials } from '@core/lib/baseball';
import { monetaryAmountFragment } from '@core/lib/monetaryAmount';
import { getPositionInitials as getNBAPositionInitials } from '@core/lib/nba';
import { Equals } from '@core/lib/typescript';

import { useReferralReward_referralReward } from './__generated__/useReferralReward.graphql';
import { useBaseballQuery } from './graphql/baseball';

const referralRewardsQueryBySport = {
  [Sport.FOOTBALL]: undefined,
};

const DiscountCardBack = styled.img`
  width: var(--card-width);
  max-width: 100%;
`;

const isConversionCreditReward = (
  reward: useReferralReward_referralReward | null
) => {
  return !!reward?.conversionCredit;
};

const isFootballCardReward = (
  reward: useReferralReward_referralReward | null
): reward is useReferralReward_referralReward & {
  token: NonNullable<
    useReferralReward_referralReward['token'] & { sport: Sport.FOOTBALL }
  >;
} => {
  return reward?.token?.sport === Sport.FOOTBALL;
};

const isUsSportCardReward = (
  reward: useReferralReward_referralReward | null
): reward is useReferralReward_referralReward & {
  token: NonNullable<
    useReferralReward_referralReward['token'] & {
      sport: Sport.NBA | Sport.BASEBALL;
    }
  >;
} => {
  return (
    reward?.token?.sport === Sport.NBA ||
    reward?.token?.sport === Sport.BASEBALL
  );
};

export const useReferralReward = (
  reward: useReferralReward_referralReward | null
) => {
  return {} as any;
};

useReferralReward.fragments = {
  referralReward: gql`
    fragment useReferralReward_referralReward on ReferralReward {
      id
      shippingState
      conversionCredit {
        id
        maxDiscount {
          ...MonetaryAmountFragment_monetaryAmount
        }
        percentageDiscount
      }
      token {
        assetId
        slug
        sport
        metadata {
          ... on TokenCardMetadataInterface {
            id
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
    }
    ${monetaryAmountFragment}
  ` as TypedDocumentNode<useReferralReward_referralReward>,
};

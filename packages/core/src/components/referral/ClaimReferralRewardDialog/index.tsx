import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Preloader } from '@core/atoms/loader/Preloader';
import CardFront from '@core/components/card/Front';
import { ClaimRewardsDialog } from '@core/components/rewards/ClaimRewardsDialog';
import { Discount } from '@core/components/rewards/Discount';
import { Reward } from '@core/components/rewards/types';
import { useReferralReward } from '@core/hooks/useReferralReward';
import { glossary } from '@core/lib/glossary';
import { monetaryAmountFragment } from '@core/lib/monetaryAmount';

import { ClaimReferralRewardDialog_referralReward } from './__generated__/index.graphql';

type Props = {
  open: boolean;
  onClose: () => void;
  referralReward: ClaimReferralRewardDialog_referralReward | null;
};

const HeaderWrapper = styled.p`
  padding-top: var(--triple-unit);
  color: var(--c-static-neutral-100);
  text-transform: uppercase;
  font-size: 32px;
  font-family: Druk Wide, sans-serif;
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <FormattedMessage
        id="ClaimReferralReward.title"
        defaultMessage="Referral Reward"
      />
    </HeaderWrapper>
  );
};

const formatReward = (
  referralReward: ClaimReferralRewardDialog_referralReward,
  teasers: ReactElement[],
  cardBack: ReactElement,
  claimed: boolean
): Reward => {
  const { token, conversionCredit } = referralReward || {};

  return {
    ids: [referralReward?.id],
    key: referralReward?.id,
    backgroundText: conversionCredit ? (
      <FormattedMessage {...glossary.discount} />
    ) : (
      token?.metadata.rarity || ''
    ),
    header: <Header />,
    back: cardBack,
    front: isClaimed => {
      return conversionCredit ? (
        <Discount
          readyToShow={!!isClaimed}
          percentage={conversionCredit.percentageDiscount}
          maxDiscount={conversionCredit.maxDiscount}
        />
      ) : (
        <CardFront src={token?.pictureUrl || ''} />
      );
    },
    teasers,
    claimed,
  };
};

export const ClaimReferralRewardDialog = ({
  open,
  onClose,
  referralReward,
}: Props) => {
  const { claim, claimed, teasers, cardBack } =
    useReferralReward(referralReward);

  const formattedReward =
    referralReward && teasers && cardBack
      ? formatReward(referralReward, teasers, cardBack, claimed)
      : undefined;

  if (!formattedReward) {
    return null;
  }

  return (
    <>
      <Preloader imageUrls={[referralReward?.token?.pictureUrl || '']} />
      <ClaimRewardsDialog
        open={open}
        toggleShowClaimReward={onClose}
        onClaim={() => claim()}
        rewards={[formattedReward]}
      />
    </>
  );
};

ClaimReferralRewardDialog.fragments = {
  referralReward: gql`
    fragment ClaimReferralRewardDialog_referralReward on ReferralReward {
      id
      token {
        assetId
        slug
        pictureUrl(derivative: "tinified")
      }
      conversionCredit {
        id
        maxDiscount {
          ...MonetaryAmountFragment_monetaryAmount
        }
        percentageDiscount
      }
      ...useReferralReward_referralReward
    }
    ${monetaryAmountFragment}
    ${useReferralReward.fragments.referralReward}
  ` as TypedDocumentNode<ClaimReferralRewardDialog_referralReward>,
};

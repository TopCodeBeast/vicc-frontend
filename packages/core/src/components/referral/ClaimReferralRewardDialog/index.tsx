import { gql } from '@apollo/client';
import { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Preloader } from '@sorare/core/src/atoms/loader/Preloader';
import { Title1 } from '@sorare/core/src/atoms/typography';
import CardFront from 'components/card/Front';
import { ClaimRewardsDialog } from 'components/rewards/ClaimRewardsDialog';
import { Reward } from 'components/rewards/types';
import { useReferralReward } from '@sorare/core/src/hooks/useReferralReward';

import { ClaimReferralRewardDialog_referralReward } from './__generated__/index.graphql';

type Props = {
  open: boolean;
  onClose: () => void;
  referralReward: ClaimReferralRewardDialog_referralReward | null;
};

const HeaderWrapper = styled(Title1)`
  padding-top: var(--triple-unit);
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
  const { token } = referralReward || {};
  return {
    ids: [referralReward?.id],
    key: referralReward?.id,
    backgroundText: token.metadata.rarity || '',
    header: <Header />,
    back: cardBack,
    front: <CardFront src={token.pictureUrl || ''} />,
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
      <Preloader imageUrls={[referralReward?.token.pictureUrl || '']} />
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
      ...useReferralReward_referralReward
    }
    ${useReferralReward.fragments.referralReward}
  `,
};

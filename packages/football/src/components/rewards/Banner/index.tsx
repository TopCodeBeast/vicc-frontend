import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { FiatWalletAccountState } from '@sorare/core/src/__generated__/globalTypes';
import { Preloader } from '@sorare/core/src/atoms/loader/Preloader';
import { CreateFiatWalletWithInterstitialModal } from '@sorare/core/src/components/fiatWallet/CreateFiatWalletWithInterstitialModal';
import { InterstitialContextModalMode } from '@sorare/core/src/components/fiatWallet/InterstitialContextModal';
import { Fan } from '@sorare/core/src/components/rewards/Banner/Fan';
import { ClaimRewardsDialog } from '@sorare/core/src/components/rewards/ClaimRewardsDialog';
import { ShouldVerifyUserBeforeClaiming } from '@sorare/core/src/components/rewards/ShouldVerifyUserBeforeClaiming';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useToggle from '@sorare/core/src/hooks/useToggle';

import { DumbBanner } from '@football/components/rewards/DumbBanner';
import { formatReward } from '@football/components/rewards/utils';
import useClaimRewards from '@football/hooks/so5/useClaimRewards';

import { RewardsBanner_vicc5Reward } from './__generated__/index.graphql';

type Props = { rewards: RewardsBanner_vicc5Reward[] };
export const RewardsBanner = ({ rewards }: Props) => {
  const { fiatWalletAccountable } = useCurrentUserContext();
  const [initialRewards, setInitialRewards] = useState<
    RewardsBanner_vicc5Reward[] | null
  >(null);
  const [claimRewards, { loading }] = useClaimRewards();

  const [showClaimReward, toggleShowClaimReward] = useToggle(false);
  const [showCreateFiatWallet, setShowCreateFiatWallet] = useState(false);

  const kycCompleted =
    fiatWalletAccountable?.state === FiatWalletAccountState.VALIDATED_OWNER;
  const onClaimFiatRewards = kycCompleted
    ? undefined
    : () => setShowCreateFiatWallet(true);

  if (initialRewards === null && rewards.length > 0) {
    setInitialRewards(rewards);
  }

  const everyInitialRewardsClaimed = initialRewards?.every(
    ({ aasmState }) => aasmState === 'claimed'
  );
  if (!initialRewards || everyInitialRewardsClaimed) {
    return null;
  }

  const onClaim = (ids: string[]) => {
    if (!loading) {
      claimRewards(ids);
    }
  };

  /* Update the aasmState of the initial rewards.
    Two possibilities:
      1. The new rewards array do not contain the claimed rewards, only unclaimed. In this case we manually set the 'aasmState' to 'claimed'
      2. The new rewards array contain all the initial rewards with their 'aasmState' updated
  */
  const updatedRewards = initialRewards.map(initialReward => {
    const updatedReward = rewards.find(r => initialReward.id === r.id);
    return {
      ...initialReward,
      aasmState: updatedReward?.aasmState || 'claimed',
    };
  });

  const formattedRewards = formatReward(updatedRewards, { onClaimFiatRewards });
  const unclaimedRewards = formattedRewards.filter(r => !r.claimed);
  const hasRewardsToClaim = unclaimedRewards.length > 0;

  const cards = initialRewards
    .flatMap(({ rewardCards }) => rewardCards.map(({ card }) => card))
    .filter(Boolean);
  const hasBlockchainRewards = cards.some(card => card!.rarity !== 'common');
  const gameWeek = initialRewards[0]?.vicc5Fixture.gameWeek;
  const rewardsList = formatReward(initialRewards, { onClaimFiatRewards });

  return (
    <>
      <Preloader
        imageUrls={cards.map(card => card!.pictureUrl || '')}
        videoUrls={[`${FRONTEND_ASSET_HOST}/animations/coin_reveal.mp4`]}
      />
      <ShouldVerifyUserBeforeClaiming
        hasBlockchainRewards={hasBlockchainRewards}
        trackProperties={{
          gameweek: gameWeek,
        }}
      >
        {({ disabledClaim }) => (
          <>
            <DumbBanner
              disabled={!hasRewardsToClaim}
              hideClaimButton={!hasRewardsToClaim}
              icon={<Fan elements={rewardsList.map(({ back }) => back)} />}
              title={
                <FormattedMessage
                  id="RewardsBanner.title"
                  defaultMessage="{nb, plural, one {1 reward} other {# rewards}}"
                  values={{
                    nb: rewardsList.length,
                  }}
                />
              }
              description={
                hasRewardsToClaim ? (
                  <FormattedMessage
                    id="RewardsBanner.description"
                    defaultMessage="Redeem {nb, plural, one {Reward} other {Rewards}}"
                    values={{
                      nb: rewardsList.length,
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id="RewardsBanner.claimedDescription"
                    defaultMessage="{nb, plural, one {Reward claimed} other {Rewards claimed}}"
                    values={{
                      nb: rewardsList.length,
                    }}
                  />
                )
              }
              onClick={() => !disabledClaim && toggleShowClaimReward()}
            />
            <ClaimRewardsDialog
              open={!disabledClaim && showClaimReward}
              toggleShowClaimReward={toggleShowClaimReward}
              rewards={rewardsList}
              onClaim={onClaim}
            />
            {showCreateFiatWallet && (
              <CreateFiatWalletWithInterstitialModal
                mode={InterstitialContextModalMode.REWARD}
                onDecline={() => setShowCreateFiatWallet(false)}
                statusTarget={FiatWalletAccountState.VALIDATED_OWNER}
                onDismissActivationSuccess={() =>
                  setShowCreateFiatWallet(false)
                }
                onClose={() => setShowCreateFiatWallet(false)}
                canDismissAfterActivation={false}
              />
            )}
          </>
        )}
      </ShouldVerifyUserBeforeClaiming>
    </>
  );
};

RewardsBanner.fragments = {
  vicc5Reward: gql`
    fragment RewardsBanner_vicc5Reward on Vicc5Reward {
      slug
      coinAmount
      rewardCards {
        id
        card {
          slug
          assetId
          pictureUrl: pictureUrl(derivative: "tinified")
        }
      }
      vicc5Fixture {
        slug
        endDate
      }
      ...formatReward_vicc5Reward
    }
    ${formatReward.fragments.vicc5Reward}
  ` as TypedDocumentNode<RewardsBanner_vicc5Reward>,
};

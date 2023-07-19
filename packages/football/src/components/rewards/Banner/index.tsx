import { gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Preloader } from '@sorare/core/src/atoms/loader/Preloader';
import { Fan } from '@sorare/core/src/components/rewards/Banner/Fan';
import { ClaimRewardsDialog } from '@sorare/core/src/components/rewards/ClaimRewardsDialog';
import { ShouldVerifyUserBeforeClaiming } from '@sorare/core/src/components/rewards/ShouldVerifyUserBeforeClaiming';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import useToggle from '@sorare/core/src/hooks/useToggle';

import { DumbBanner } from '@football/components/rewards/DumbBanner';
import { formatReward } from '@football/components/rewards/utils';
import useClaimRewards from '@football/hooks/so5/useClaimRewards';

import { RewardsBanner_so5Reward } from './__generated__/index.graphql';

type Props = { rewards: RewardsBanner_so5Reward[] };
export const RewardsBanner = ({ rewards }: Props) => {
  const [initialRewards, setInitialRewards] = useState<
    RewardsBanner_so5Reward[] | null
  >(null);
  const [claimRewards, { loading }] = useClaimRewards();

  const [showClaimReward, toggleShowClaimReward] = useToggle(false);

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

  const formattedRewards = formatReward(updatedRewards);
  const unclaimedRewards = formattedRewards.filter(r => !r.claimed);
  const hasRewardsToClaim = unclaimedRewards.length > 0;

  const cards = initialRewards
    .flatMap(({ rewardCards }) => rewardCards.map(({ card }) => card))
    .filter(Boolean);
  const hasBlockchainRewards = cards.some(card => card!.rarity !== 'common');
  const gameWeek = initialRewards[0]?.so5Fixture.gameWeek;
  const rewardsList = formatReward(initialRewards);

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
          </>
        )}
      </ShouldVerifyUserBeforeClaiming>
    </>
  );
};

RewardsBanner.fragments = {
  so5Reward: gql`
    fragment RewardsBanner_so5Reward on Vicc5Reward {
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
      so5Fixture: vicc5Fixture {
        slug
        endDate
      }
      ...formatReward_so5Reward
    }
    ${formatReward.fragments.so5Reward}
  `,
};

import { faGift as fasGift } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Menu } from '@material-ui/core';
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { CurrentUserQuery_currentUser } from '@sorare/core/src/contexts/currentUser/types';
import { groupBy } from '@sorare/core/src/lib/arrays';
import MenuIconButton from '@sorare/core/src/routing/MultiSportAppBar/MenuIconButton';

import UnclaimedActionRewards from './UnclaimedActionRewards';
import UnclaimedReferralRewards from './UnclaimedReferralRewards';
import UnclaimedVicc5Rewards from './UnclaimedSo5Rewards';

const buzz = keyframes`
  1% {
    transform: translateX(3px) rotate(2deg);
  }
  2% {
    transform: translateX(-3px) rotate(-2deg);
  }
  3% {
    transform: translateX(3px) rotate(2deg);
  }
  4% {
    transform: translateX(-3px) rotate(-2deg);
  }
  5% {
    transform: translateX(2px) rotate(1deg);
  }
  6% {
    transform: translateX(-2px) rotate(-1deg);
  }
  7% {
    transform: translateX(2px) rotate(1deg);
  }
  8% {
    transform: translateX(-2px) rotate(-1deg);
  }
  9% {
    transform: translateX(1px) rotate(0);
  }
  10% {
    transform: translateX(0) rotate(0);
  }
`;

const Root = styled(Badge)``;
const Icon = styled(FontAwesomeIcon)`
  font-size: 16px;
  animation: 2s ${buzz} infinite;
`;
const StyledMenu = styled.div`
  min-width: 288px;
`;

type UnclaimedVicc5Rewards_reward =
  CurrentUserQuery_currentUser['unclaimedVicc5Rewards'][number];

const mergeCoinRewards = (rewards: UnclaimedVicc5Rewards_reward[]) => {
  if (!rewards.length) {
    return [];
  }

  let totalCoinAmount = 0;
  const otherRewards: UnclaimedVicc5Rewards_reward[] = [];
  rewards.forEach(r => {
    if (r.coinAmount > 0) {
      totalCoinAmount += r.coinAmount;
    } else {
      otherRewards.push(r);
    }
  });

  const syntheticReward = { ...rewards[0], coinAmount: totalCoinAmount };

  return totalCoinAmount > 0
    ? [...otherRewards, syntheticReward]
    : otherRewards;
};

export const UnclaimedRewards = () => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const { currentUser } = useCurrentUserContext();

  if (!currentUser) {
    return null;
  }

  const {
    unclaimedVicc5Rewards,
    unclaimedReferralRewardsCount,
    unclaimedActionRewards,
  } = currentUser;

  const hasUnclaimedVicc5Rewards = unclaimedVicc5Rewards.length > 0;
  const hasUnclaimedReferralRewards = unclaimedReferralRewardsCount > 0;
  const hasUnclaimedActionRewards = unclaimedActionRewards.length > 0;
  const hasRewards =
    hasUnclaimedVicc5Rewards ||
    hasUnclaimedReferralRewards ||
    hasUnclaimedActionRewards;

  if (!hasRewards) {
    return null;
  }

  const rewardsByFixture = groupBy(r => r.vicc5Fixture.slug, unclaimedVicc5Rewards);

  const rewardsByFixtureWithMergedCoins = Object.values(rewardsByFixture).map(
    rewards => mergeCoinRewards(rewards)
  );

  const unclaimedVicc5RewardsLength = rewardsByFixtureWithMergedCoins.reduce(
    (sum, rewards) => {
      return sum + rewards.length;
    },
    0
  );

  const badgeCount =
    unclaimedVicc5RewardsLength +
    unclaimedReferralRewardsCount +
    unclaimedActionRewards.length;

  const unclaimedVicc5RewardsToRender = rewardsByFixtureWithMergedCoins.map(
    rewards => {
      const vicc5FixtureSlug = rewards[0].vicc5Fixture.slug;
      return (
        <UnclaimedVicc5Rewards
          key={vicc5FixtureSlug}
          vicc5FixtureSlug={vicc5FixtureSlug}
          rewards={rewards}
        />
      );
    }
  );

  const openMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) =>
    setMenuAnchor(event.currentTarget);

  const onClose = () => setMenuAnchor(null);

  return (
    <>
      <Root badgeContent={badgeCount} overlap="circular">
        <MenuIconButton
          aria-owns={menuAnchor ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={openMenu}
          active={Boolean(menuAnchor)}
        >
          <Icon icon={fasGift} />
        </MenuIconButton>
      </Root>
      <Menu
        id="notification-menu"
        anchorEl={menuAnchor}
        getContentAnchorEl={null}
        open={Boolean(menuAnchor)}
        onClose={onClose}
        className="light-theme"
      >
        <StyledMenu>
          {unclaimedVicc5RewardsToRender}
          {hasUnclaimedReferralRewards && (
            <UnclaimedReferralRewards count={unclaimedReferralRewardsCount} />
          )}
          {hasUnclaimedActionRewards && <UnclaimedActionRewards />}
        </StyledMenu>
      </Menu>
    </>
  );
};

export default UnclaimedRewards;

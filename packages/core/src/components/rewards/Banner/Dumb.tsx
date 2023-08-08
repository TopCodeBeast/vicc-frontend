import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Title3 } from '@core/atoms/typography';
import { Reward } from '@core/components/rewards/types';
import useToggle from '@core/hooks/useToggle';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { ClaimRewardsDialog } from '../ClaimRewardsDialog';
import { Fan } from './Fan';
import background from './assets/rewards_banner_background.svg';

const Banner = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: var(--c-static-neutral-1000);
  background-image: url(${background});
  background-size: cover;
  color: var(--c-static-neutral-100);
  padding: calc(3 * var(--unit));
  border-radius: var(--triple-unit);
  margin: ${({ noMargin }: { noMargin?: boolean }) =>
    noMargin ? 0 : `calc(3 * var(--unit)) 0`};
  gap: calc(3 * var(--unit));
  cursor: pointer;
  @media ${tabletAndAbove} {
    flex-direction: row;
    & > :last-child {
      margin-inline-start: auto;
    }
  }
`;

const Message = styled(Title3)`
  justify-self: flex-start;
  text-align: center;
`;

export type RewardsBannerProps = {
  rewards: Reward[];
  onClaim: (id: string[]) => void;
  noMargin?: boolean;
  supportPartialClaim?: boolean;
  disabledClaim?: boolean;
};

export const RewardsBanner = ({
  rewards,
  onClaim,
  noMargin,
  supportPartialClaim = false,
  disabledClaim,
}: RewardsBannerProps) => {
  const unclaimedRewards = rewards.filter(r => !r.claimed);
  const [showClaimReward, toggleShowClaimReward] = useToggle(false);

  // prevents closing the claim modal too early
  if (rewards.length > 0) {
    return (
      <>
        {unclaimedRewards.length > 0 && (
          <Banner
            onClick={() => !disabledClaim && toggleShowClaimReward()}
            noMargin={noMargin}
          >
            <Fan
              elements={(supportPartialClaim ? unclaimedRewards : rewards).map(
                ({ back }) => back
              )}
            />
            <Message>
              <FormattedMessage
                id="RewardsBanner.message"
                defaultMessage="You've earned {nb, plural, one {1 reward} other {# rewards}}!"
                values={{
                  nb: (supportPartialClaim ? unclaimedRewards : rewards).length,
                }}
              />
            </Message>
            <Button color="blue" medium type="button">
              <FormattedMessage
                id="RewardsBanner.claim"
                defaultMessage="Claim rewards"
              />
            </Button>
          </Banner>
        )}
        <ClaimRewardsDialog
          open={!disabledClaim && showClaimReward}
          toggleShowClaimReward={toggleShowClaimReward}
          rewards={rewards}
          onClaim={onClaim}
        />
      </>
    );
  }
  return null;
};

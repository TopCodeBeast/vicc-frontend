import { gql } from '@apollo/client';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text14, Text16, Text18, Title3 } from '@sorare/core/src/atoms/typography';
import CardBack from 'components/card/Back';
import OpenItemDialogLink from 'components/link/OpenItemDialogLink';
import { ClaimReferralRewardDialog } from 'components/referral/ClaimReferralRewardDialog';
import UninteractiveToken from 'components/token/UninteractiveToken';
import Avatar from 'components/user/Avatar';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useReferralReward } from '@sorare/core/src/hooks/useReferralReward';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { scarcityNames } from '@sorare/core/src/lib/cards';
import { glossary } from '@sorare/core/src/lib/glossary';
import { qualityNames } from '@sorare/core/src/lib/players';

import { Milestones_referralMilestoneReward } from './__generated__/index.graphql';

const MilestoneRoot = styled.div`
  --padding: var(--double-unit);
  --circle-width: var(--double-unit);
  --path-width: var(--half-unit);

  display: flex;
  align-items: center;
  gap: var(--double-unit);

  padding: var(--padding);
  background-color: var(--c-neutral-200);
  position: relative;

  &:not(.first):before,
  &:not(.last):after {
    content: '';
    width: var(--path-width);
    position: absolute;
    z-index: 0;
    left: calc(
      var(--padding) + var(--circle-width) / 2 - var(--path-width) / 2
    );
    background-color: var(--c-neutral-400);
  }

  &.reached {
    &:not(.first):before {
      background-color: var(--c-static-green-600);
    }
  }

  &.reachedAfter {
    &:after {
      background-color: var(--c-static-green-600);
    }
  }

  &:not(.first):before {
    top: 0;
    height: 50%;
  }
  &:after {
    bottom: calc(-1 * var(--border-width, 0px));
    height: calc(50% + var(--border-width, 0px));
  }
`;
const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--double-unit);
`;
const Details = styled.div`
  display: flex;
  gap: var(--double-unit);
  align-items: center;
`;
const Circle = styled.div`
  width: var(--circle-width);
  height: var(--circle-width);
  background-color: var(--c-neutral-100);
  border: 3px solid var(--c-neutral-400);
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  .reached & {
    background-color: var(--c-static-green-600);
    border: none;
  }
`;
const AvatarAfter = styled.div`
  --avatar-size: 24px;
  position: absolute;
  z-index: 2;
  left: calc(var(--padding) - var(--path-width));
  bottom: calc(-1 * var(--avatar-size) / 2);
`;
const Card = styled.div`
  width: 40px;
`;
const StyledText18 = styled(Text18)`
  display: flex;
  gap: var(--half-unit);
`;
const StyledText16 = styled(Text16)`
  display: flex;
  gap: var(--half-unit);

  & > span:nth-child(1) {
    color: var(--c-neutral-600);
  }
  & > span:nth-child(2) {
    color: var(--c-brand-300);
  }
`;
const Completed = styled(Text14)`
  margin-left: auto;
`;

const Milestone = ({
  first,
  last,
  milestone: {
    referralNumber,
    rewardRarity,
    rewardTier,
    reward,
    reached,
    reachedAfter,
    avatar,
  },
}: {
  first: boolean;
  last: boolean;
  milestone: Milestones_referralMilestoneReward & {
    reached?: boolean;
    reachedAfter?: boolean;
    avatar: 'center' | 'after' | null;
  };
}) => {
  const { currentUser } = useCurrentUserContext();
  const { claimed } = useReferralReward(reward);
  const [openClaimDialog, toggleOpenClaimDialog] = useToggle(false);

  if (!currentUser) return null;

  const avatarComponent = <Avatar user={currentUser} rounded variant="small" />;

  return (
    <MilestoneRoot
      className={classNames({ first, last, reached, reachedAfter })}
    >
      <div>
        <Circle>
          {avatar === 'center' ? (
            avatarComponent
          ) : (
            <>{reached && <FontAwesomeIcon icon={faCheck} width={10} />}</>
          )}
        </Circle>
        {avatar === 'after' && <AvatarAfter>{avatarComponent}</AvatarAfter>}
      </div>
      <Content>
        <Details>
          <Card>
            {reward && claimed ? (
              <OpenItemDialogLink
                sport={reward.token.sport}
                item={reward.token}
              >
                <UninteractiveToken token={reward.token} />
              </OpenItemDialogLink>
            ) : (
              <CardBack
                rarity={rewardRarity}
                tier={rewardTier ? +rewardTier : undefined}
              />
            )}
          </Card>
          <div>
            <StyledText18 bold>
              <span>
                <FormattedMessage
                  id="Notice.MilestonesNotice.Milestones.Milestone.referrals"
                  defaultMessage="{count, plural, one {# Referral} other {# Referrals}}"
                  values={{ count: referralNumber }}
                />
              </span>
            </StyledText18>
            <StyledText16>
              <span>{scarcityNames[rewardRarity]}</span>
              {rewardTier && <span>{qualityNames[rewardTier]}</span>}
            </StyledText16>
          </div>
        </Details>
        {claimed && (
          <Completed bold color="var(--c-green-800)">
            <FormattedMessage {...glossary.completed} />
          </Completed>
        )}
        {reward && !claimed && (
          <Button medium color="black" onClick={toggleOpenClaimDialog}>
            <FormattedMessage {...glossary.claim} />
          </Button>
        )}
        <ClaimReferralRewardDialog
          referralReward={reward}
          open={openClaimDialog}
          onClose={toggleOpenClaimDialog}
        />
      </Content>
    </MilestoneRoot>
  );
};

const Root = styled.div`
  & > div:first-child {
    border-radius: var(--double-unit) var(--double-unit) 0 0;
  }
  & > div:last-child {
    border-radius: 0 0 var(--double-unit) var(--double-unit);
  }
  & > div:not(:last-child) {
    --border-width: 1px;
    border-bottom: var(--border-width) solid var(--c-neutral-400);
  }
`;
const Header = styled.div`
  padding: var(--double-unit);
  background-color: var(--c-neutral-200);
`;

type Props = {
  sport: Sport;
  currentProgression: number;
  milestones: Milestones_referralMilestoneReward[];
};

export const Milestones = ({
  sport,
  milestones,
  currentProgression,
}: Props) => {
  const sortedMilestones = useMemo(
    () =>
      milestones.slice().sort((a, b) => a.referralNumber - b.referralNumber) ||
      [],
    [milestones]
  );

  const preparedMilestones: (Milestones_referralMilestoneReward & {
    reached?: boolean;
    reachedAfter?: boolean;
    avatar: 'center' | 'after' | null;
  })[] = useMemo(
    () =>
      sortedMilestones.map((milestone, index, array) => {
        if (currentProgression === milestone.referralNumber) {
          return {
            ...milestone,
            reached: true,
            avatar: 'center',
          };
        }

        const nextReferralNumber = array[index + 1]?.referralNumber;

        return {
          ...milestone,
          reached: currentProgression > milestone.referralNumber,
          reachedAfter: currentProgression > milestone.referralNumber,
          avatar:
            currentProgression > milestone.referralNumber &&
            currentProgression < nextReferralNumber
              ? 'after'
              : null,
        };
      }),
    [currentProgression, sortedMilestones]
  );

  return (
    <Root>
      <Header>
        {sport === Sport.BASEBALL ? (
          <Title3>
            <FormattedMessage
              id="Notice.MilestonesNotice.outOfRewardsCompleted"
              defaultMessage="{current} out of {max} rewards completed!"
              values={{
                current: preparedMilestones.filter(
                  milestone => milestone.reached
                ).length,
                max: milestones.length,
              }}
            />
          </Title3>
        ) : (
          <>
            <Title3>
              <FormattedMessage
                id="FootballNotice.forEachMilestone"
                defaultMessage="For each milestone"
              />
            </Title3>
            <Text18 color="var(--c-neutral-600)">
              <FormattedMessage
                id="FootballNotice.insteadOfLimitedTier3"
                defaultMessage="instead of a Limited Card Tier 3, you win:"
              />
            </Text18>
          </>
        )}
      </Header>
      {preparedMilestones.map((milestone, i) => (
        <Milestone
          key={milestone.referralNumber}
          first={!i}
          last={i === preparedMilestones.length - 1}
          milestone={milestone}
        />
      ))}
    </Root>
  );
};

Milestones.fragments = {
  ReferralMilestoneReward: gql`
    fragment Milestones_referralMilestoneReward on ReferralMilestoneReward {
      referralNumber
      rewardRarity
      rewardTier
      reward {
        id
        token {
          assetId
          slug
          sport
          ...UninteractiveToken_token
        }
        ...ClaimReferralRewardDialog_referralReward
        ...useReferralReward_referralReward
      }
    }
    ${ClaimReferralRewardDialog.fragments.referralReward}
    ${useReferralReward.fragments.referralReward}
    ${UninteractiveToken.fragments.token}
  `,
};

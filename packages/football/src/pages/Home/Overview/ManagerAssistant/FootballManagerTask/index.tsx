import { gql } from '@apollo/client';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import styled from 'styled-components';

import { FootballManagerTaskState } from '@sorare/core/src/__generated__/globalTypes';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import Coin from '@sorare/core/src/atoms/icons/Coin';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { useConfigContext } from '@sorare/core/src/contexts/config';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  MarketplaceOnboardingStep,
  useManagerTaskContext,
} from '@sorare/core/src/contexts/managerTask';
import {
  WalletTab,
  useWalletDrawerContext,
} from '@sorare/core/src/contexts/walletDrawer';
import { useIsDesktop } from '@sorare/core/src/hooks/device/useIsDesktop';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';
import { glossary } from '@sorare/core/src/lib/glossary';
import { Link } from '@sorare/core/src/routing/Link';

import { useFootballEvents } from 'lib/events';

import {
  ClaimFootballManagerTaskMutation,
  ClaimFootballManagerTaskMutationVariables,
  DeclareFootballManagerTaskMutation,
  DeclareFootballManagerTaskMutationVariables,
  FootballManagerTask_footballManagerTask,
  FootballManagerTask_so5Leaderboard,
} from './__generated__/index.graphql';
import { tasksData } from './data';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);
  padding: var(--unit) var(--double-unit) var(--unit) var(--unit);
  background: var(--c-neutral-200);
  & > img {
    width: var(--quadruple-unit);
  }
  text-align: left;
  &:hover,
  &:focus {
    background: var(--c-neutral-300);
  }
  &.disabled {
    &:hover,
    &:focus {
      background: var(--c-neutral-200);
      cursor: auto;
    }
  }
`;

const Message = styled(Text14)`
  color: var(--c-neutral-1000);
  flex: 1;
`;

const CtaText = styled(Text14)`
  font-weight: var(--t-bold);
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  color: var(--c-neutral-1000);
  margin-right: var(--double-unit);
`;

const Img = styled.img`
  width: 60px;
`;

const ButtonLabel = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

const CLAIM_FOOTBALL_MANAGER_TASK_MUTATION = gql`
  mutation ClaimFootballManagerTaskMutation(
    $input: claimFootballManagerTaskInput!
  ) {
    claimFootballManagerTask(input: $input) {
      currentUser {
        slug
        coinBalance
      }
      footballManagerTask {
        id
        aasmState
        claimedAt
      }
      errors {
        message
        code
      }
    }
  }
`;

const DECLARE_FOOTBALL_MANAGER_TASK_MUTATION = gql`
  mutation DeclareFootballManagerTaskMutation(
    $input: declareFootballManagerTaskInput!
  ) {
    declareFootballManagerTask(input: $input) {
      currentUser {
        slug
        coinBalance
      }
      footballManagerTask {
        id
        aasmState
        claimedAt
      }
      errors {
        message
        code
      }
    }
  }
`;

type Props = {
  task: FootballManagerTask_footballManagerTask;
  leaderboards: Nullable<FootballManagerTask_so5Leaderboard[]>;
};

export const FootballManagerTask = ({ task, leaderboards }: Props) => {
  const isDesktop = useIsDesktop();
  const { setStep, setTask, setOnSuccessCallback } = useManagerTaskContext();
  const {
    so5: { so5LeaguesAlgoliaFilters },
  } = useConfigContext();
  const { showDrawer, setCurrentTab } = useWalletDrawerContext();
  const track = useFootballEvents();
  const [claimReward, { loading }] = useMutation<
    ClaimFootballManagerTaskMutation,
    ClaimFootballManagerTaskMutationVariables
  >(CLAIM_FOOTBALL_MANAGER_TASK_MUTATION);

  const [validateReward] = useMutation<
    DeclareFootballManagerTaskMutation,
    DeclareFootballManagerTaskMutationVariables
  >(DECLARE_FOOTBALL_MANAGER_TASK_MUTATION);

  const taskData = tasksData[task.taskSlug];
  const taskDescription = isDesktop
    ? taskData.desktopDescription
    : taskData.mobileDescription;

  const validateRewardCallback = () => {
    if (task.aasmState !== FootballManagerTaskState.CLAIMED) {
      validateReward({
        variables: {
          input: {
            footballManagerTaskId: task.id,
          },
        },
      });
    }
  };

  const onClick = () => {
    taskData.onClick?.({
      openAddFunds: () => {
        setCurrentTab(WalletTab.ADD_FUNDS);
        showDrawer();
      },
      openExploreMarketplace: () => {
        setTask(task);
        setStep(MarketplaceOnboardingStep.menu);
        setOnSuccessCallback(() => validateRewardCallback);
      },
      validateReward: validateRewardCallback,
    });
    track('Click Manager Assistant Task', {
      task: task.taskSlug,
    });
  };

  const getWrapperProps = () => {
    if (
      !taskData.leaveActiveAfterCompleted &&
      [
        FootballManagerTaskState.COMPLETED,
        FootballManagerTaskState.CLAIMED,
      ].includes(task.aasmState)
    ) {
      return {
        className: 'disabled',
      };
    }
    if (taskData.getLink) {
      return {
        as: Link,
        to: taskData.getLink({
          leaderboards,
          so5LeaguesAlgoliaFilters,
        }),
        onClick,
      };
    }
    return {
      as: 'button',
      onClick,
    };
  };

  const getCta = () => {
    if (
      task.aasmState === FootballManagerTaskState.ASSIGNED ||
      task.aasmState === FootballManagerTaskState.READY
    ) {
      return (
        <CtaText>
          <FormattedNumber value={task.coinAmount} />
          <Coin />
        </CtaText>
      );
    }

    if (task.aasmState === FootballManagerTaskState.CLAIMED) {
      return (
        <CtaText color="var(--c-green-600)">
          <FormattedMessage {...glossary.completed} />
          <FontAwesomeIcon icon={faCheckCircle} size="sm" />
        </CtaText>
      );
    }
    return (
      <LoadingButton
        small
        color="blue"
        onClick={e => {
          e.preventDefault();
          claimReward({
            variables: {
              input: {
                footballManagerTaskId: task.id,
              },
            },
          });
        }}
        loading={loading}
      >
        <ButtonLabel>
          <FormattedMessage {...glossary.claim} />{' '}
          <FormattedNumber value={task.coinAmount} />
          <Coin />
        </ButtonLabel>
      </LoadingButton>
    );
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Wrapper {...getWrapperProps()}>
      <Img src={taskData.image} alt="" />
      <Message>
        <FormattedMessage {...taskDescription} />
      </Message>
      {getCta()}
    </Wrapper>
  );
};

FootballManagerTask.fragments = {
  footballManagerTask: gql`
    fragment FootballManagerTask_footballManagerTask on FootballManagerTask {
      id
      taskSlug
      aasmState
      coinAmount
    }
  `,
  so5Leaderboard: gql`
    fragment FootballManagerTask_so5Leaderboard on So5Leaderboard {
      slug
      so5LeaderboardType
      division
      canCompose {
        value
      }
      commonDraftCampaign {
        slug
        status
      }
      mySo5Lineups {
        id
        draft
      }
      so5League {
        slug
        displayName
      }
    }
  `,
};

import { TypedDocumentNode, gql } from '@apollo/client';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import styled from 'styled-components';

import { FootballManagerTaskState } from '@sorare/core/src/__generated__/globalTypes';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import Coin from '@sorare/core/src/atoms/icons/Coin';
import { LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { useConfigContext } from '@sorare/core/src/contexts/config';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  LearnCompetitionsOnboardingStep,
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

import { useFootballEvents } from '@football/lib/events';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import { Layout as DefaultLayout } from './Layout';
import {
  ClaimFootballManagerTaskMutation,
  ClaimFootballManagerTaskMutationVariables,
  DeclareFootballManagerTaskMutation,
  DeclareFootballManagerTaskMutationVariables,
  FootballManagerTask_footballManagerTask,
  FootballManagerTask_so5Leaderboard,
} from './__generated__/index.graphql';
import { tasksData } from './data';
import { FootballManagerTaskProps } from './types';

const Message = styled(Text14)`
  color: var(--c-neutral-1000);
  flex: 1;
  & > button {
    text-align: start;
  }
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
` as TypedDocumentNode<
  ClaimFootballManagerTaskMutation,
  ClaimFootballManagerTaskMutationVariables
>;

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
` as TypedDocumentNode<
  DeclareFootballManagerTaskMutation,
  DeclareFootballManagerTaskMutationVariables
>;

const Cta = ({ task }: Pick<FootballManagerTaskProps, 'task'>) => {
  const [claimReward, { loading }] = useMutation(
    CLAIM_FOOTBALL_MANAGER_TASK_MUTATION
  );
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

export const FootballManagerTask = ({
  task,
  leaderboards,
  Layout,
}: FootballManagerTaskProps) => {
  const isDesktop = useIsDesktop();
  const { setStep, setTask, setOnSuccessCallback } = useManagerTaskContext();
  const {
    so5: { so5LeaguesAlgoliaFilters },
  } = useConfigContext();
  const { showDrawer, setCurrentTab } = useWalletDrawerContext();
  const track = useFootballEvents();

  const [validateReward] = useMutation(DECLARE_FOOTBALL_MANAGER_TASK_MUTATION);

  const taskData = tasksData[task.taskSlug];

  if (!taskData) {
    return null;
  }
  const disabled =
    !taskData.leaveActiveAfterCompleted &&
    [
      FootballManagerTaskState.COMPLETED,
      FootballManagerTaskState.CLAIMED,
    ].includes(task.aasmState);
  const taskDescription = isDesktop
    ? taskData.desktopDescription
    : taskData.mobileDescription;
  const to = taskData.getLink?.({
    leaderboards,
    so5LeaguesAlgoliaFilters,
  });
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
      onLearnCompetitions: () => {
        setTask(task);
        setStep(LearnCompetitionsOnboardingStep.menu);
        setOnSuccessCallback(() => validateRewardCallback);
      },
    });
    track('Click Manager Assistant Task', {
      task: task.taskSlug,
    });
  };

  const LayoutComponent = Layout || DefaultLayout;
  return (
    <LayoutComponent
      img={<Img src={taskData.image} alt="" />}
      message={
        <Message>
          <LinkOverlay
            as={to && !disabled ? Link : 'button'}
            to={to}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
          >
            <FormattedMessage {...taskDescription} />
          </LinkOverlay>
        </Message>
      }
      cta={<Cta task={task} />}
    />
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
  ` as TypedDocumentNode<FootballManagerTask_footballManagerTask>,
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
  ` as TypedDocumentNode<FootballManagerTask_so5Leaderboard>,
};

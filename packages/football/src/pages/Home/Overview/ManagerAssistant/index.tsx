import { gql } from '@apollo/client';
import { faChevronsDown, faChevronsUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from '@material-ui/core';
import { differenceInDays } from 'date-fns';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  FootballManagerTaskSlug,
  FootballManagerTaskState,
} from '@sorare/core/src/__generated__/globalTypes';
import Collapsible from '@sorare/core/src/atoms/layout/Collapsible';
import { Title5 } from '@sorare/core/src/atoms/typography';
import { useIsDesktop } from '@sorare/core/src/hooks/device/useIsDesktop';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useToggle from '@sorare/core/src/hooks/useToggle';

import { HomeBlock } from '@football/components/Home/Block';
import { EmptyBlock } from '@football/components/Home/ItemRows';
import { useFootballEvents } from '@football/lib/events';

import { FootballManagerTask } from './FootballManagerTask';
import { tasksData } from './FootballManagerTask/data';
import {
  ManagerAssistant_currentUser,
  ManagerAssistant_so5Leaderboard,
} from './__generated__/index.graphql';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--intermediate-unit);
  overflow: hidden;
  & > *:not(:last-child) {
    border-bottom: 2px solid var(--c-neutral-300);
  }
`;

const StyledEmptyBlock = styled(EmptyBlock)`
  flex: 1;
  min-height: 150px;
`;
const CollapsibleButton = styled.button`
  display: flex;
  gap: var(--unit);
  align-items: center;
  justify-content: center;
  padding: var(--double-unit) 0;
  color: var(--c-neutral-600);
  font: var(--t-bold) var(--t-14);
`;

const Title = styled(Title5)`
  color: var(--c-neutral-1000);
  padding-right: var(--unit);
`;
type Props = {
  user: Nullable<ManagerAssistant_currentUser>;
  loading: boolean;
  leaderboards: Nullable<ManagerAssistant_so5Leaderboard[]>;
};

const ITEM_HEIGHT = 50;

export const ManagerAssistant = ({ user, loading, leaderboards }: Props) => {
  const [expanded, toggleExpanded] = useToggle(false);
  const isDesktop = useIsDesktop();
  const defaultDisplayedItems = isDesktop ? 3 : 2;
  const track = useFootballEvents();
  const {
    flags: { showScoutPlayerTask = false },
  } = useFeatureFlags();

  const toggleManagerAssistant = (source: 'button' | 'title') => () => {
    if (!expanded) {
      track('Expand Manager Assistant', {
        source,
      });
    }
    toggleExpanded();
  };

  const tasksToDisplay =
    user?.myFootballManagerTasks.filter(task => {
      if (!tasksData[task.taskSlug]) {
        return false;
      }
      if (
        !showScoutPlayerTask &&
        task.taskSlug === FootballManagerTaskSlug.SCOUT_PLAYER
      ) {
        return false;
      }
      if (task.aasmState === FootballManagerTaskState.CLAIMED) {
        return (
          task.claimedAt &&
          differenceInDays(new Date(), new Date(task.claimedAt)) <= 1
        );
      }
      return true;
    }) || [];

  if (!loading && !tasksToDisplay.length) {
    return null;
  }

  const tasksList = tasksToDisplay.map(task => (
    <FootballManagerTask
      key={task.id}
      task={task}
      leaderboards={leaderboards}
    />
  ));

  const claimableTasksCount = tasksToDisplay.filter(
    task => task.aasmState === FootballManagerTaskState.COMPLETED
  ).length;

  const content =
    (tasksList?.length || 0) > defaultDisplayedItems ? (
      <>
        <Collapsible
          open={expanded}
          options={{
            baseHeight: ITEM_HEIGHT * defaultDisplayedItems + ITEM_HEIGHT / 2,
            fadeHeight: ITEM_HEIGHT / 2,
          }}
        >
          <Content>{tasksList}</Content>
        </Collapsible>
        <CollapsibleButton onClick={toggleManagerAssistant('button')}>
          {expanded ? (
            <FontAwesomeIcon icon={faChevronsUp} size="xs" />
          ) : (
            <>
              <FormattedMessage
                id="FootballManagerTask.showMore"
                defaultMessage="See all ({count})"
                values={{
                  count: tasksList?.length,
                }}
              />
              <FontAwesomeIcon icon={faChevronsDown} size="xs" />
            </>
          )}
        </CollapsibleButton>
      </>
    ) : (
      <Content>{tasksList}</Content>
    );

  return (
    <HomeBlock
      loading={loading}
      title={
        <button onClick={toggleManagerAssistant('title')} type="button">
          <Badge badgeContent={claimableTasksCount}>
            <Title as="span">
              <FormattedMessage
                id="Home.Overview.GeneralManagerAwards.title"
                defaultMessage="Manager assistant"
              />
            </Title>
          </Badge>
        </button>
      }
    >
      {loading ? <StyledEmptyBlock /> : content}
    </HomeBlock>
  );
};

ManagerAssistant.fragments = {
  currentUser: gql`
    fragment ManagerAssistant_currentUser on CurrentUser {
      slug
      myFootballManagerTasks {
        id
        claimedAt
        ...FootballManagerTask_footballManagerTask
      }
    }
    ${FootballManagerTask.fragments.footballManagerTask}
  `,
  so5Leaderboard: gql`
    fragment ManagerAssistant_so5Leaderboard on So5Leaderboard {
      slug
      ...FootballManagerTask_so5Leaderboard
    }
    ${FootballManagerTask.fragments.so5Leaderboard}
  `,
};

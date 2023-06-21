import { gql } from '@apollo/client';
import { faCheck, faClose } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import qs from 'qs';
import { ReactNode } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Info } from '@sorare/core/src/atoms/icons/Info';
import { User } from '@sorare/core/src/atoms/icons/User';
import { LinkOther, LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import {
  Caption,
  Text14,
  Text16,
  caption,
  text14,
} from '@sorare/core/src/atoms/typography';
import { Cell, CellLink, Line } from '@sorare/core/src/components/data/Table';
import {
  FOOTBALL_COMPETITION_DETAILS,
  FOOTBALL_COMPETITION_DETAILS_REWARDS,
} from '@sorare/core/src/constants/routes';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import { Link } from '@sorare/core/src/routing/Link';
import { theme } from '@sorare/core/src/style/theme';

import { Rewards } from '@football/components/lineup/Rewards';
import HeadlineRewards from '@football/components/lobby/HeadlineRewards';
import DivisionLogo from '@football/components/so5/DivisionLogo';
import { useFootballEvents } from '@football/lib/events';
import getLineupDisplayName from '@football/lib/lineup/getLineupDisplayName';
import { getLeaderboardInfo } from '@football/lib/so5';
import CompetitionListActions from '@football/pages/Lobby/Components/CompetitionListActions';

import { TableRow_so5Leaderboard } from './__generated__/index.graphql';

const DivisionCell = styled(Cell)`
  --size: 100%;
`;

const LeaderboardNameWrapper = styled(Text16)`
  display: inline-flex;
  gap: var(--half-unit);
`;

const LeaderboardName = styled.span`
  display: inline-flex;
`;

const UserGrey = styled(User)`
  color: var(--c-neutral-600);
`;
const TooltipWrapper = styled.span`
  display: none;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: flex;
    color: var(--c-neutral-600);
  }
`;
const Participants = styled(Caption)`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  @media (min-width: ${theme.breakpoints.values.sm}px) {
    padding-top: 0;
    gap: var(--unit);
  }
`;

const StyledLink = styled(Link)`
  &,
  &:hover,
  &:focus {
    color: inherit;
  }
`;
const HeadlineWrapper = styled(LinkOther)`
  width: 100%;
  font: var(--t-14);
`;
const StatusWrapper = styled.div`
  height: var(--double-unit);
  width: var(--double-unit);
  border-radius: 50%;
  border: 2px solid var(--c-neutral-400);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &.confirmed {
    background: var(--c-green-600);
    border: none;
  }
  &.unconfirmed {
    background: var(--c-red-600);
    border: none;
  }
`;

const StatusCell = styled(Cell)`
  justify-self: center;
`;

const RewardsWrapper = styled.span`
  color: var(--c-neutral-600);
  height: fit-content;
  display: flex;
  ${caption}
  @media (min-width: ${theme.breakpoints.values.sm}px) {
    padding-top: 0;
    ${text14}
  }
`;

const ParticipantsAndRewards = styled(Cell)`
  gap: var(--unit);
`;
const Prize = styled(Cell)`
  margin-bottom: var(--half-unit);
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    margin-bottom: 0;
  }
`;

const StyledTooltip = styled(Tooltip)`
  z-index: 2;
`;

const NameAndScarcityWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export enum Areas {
  logo = 'logo',
  name = 'name',
  scarcity = 'scarcity',
  rewards = 'rewards',
  status = 'status',
  rewardsAndParticipants = 'rewardsAndParticipants',
  participants = 'participants',
  cta = 'cta',
  prize = 'prize',
  nameAndScarcity = 'nameAndScarcity',
  participantsAndRewards = 'participantsAndRewards',
}

type Props = {
  so5Leaderboard: TableRow_so5Leaderboard;
  onActionSuccess: () => void;
  lineupId: number;
  rowCta: ReactNode;
};

const TableRow = ({
  so5Leaderboard,
  onActionSuccess,
  lineupId,
  rowCta,
}: Props) => {
  const { totalRewards, mySo5Lineups, so5LineupsCount } = so5Leaderboard;
  const { scarcityMessageDescriptor, hasRewards } =
    getLeaderboardInfo(so5Leaderboard);
  const track = useFootballEvents();

  const correspondingLineup = mySo5Lineups[lineupId];
  const joined = !correspondingLineup?.draft;
  const competitionDetailsQueryParams = correspondingLineup
    ? `?${qs.stringify({ id: idFromObject(correspondingLineup.id) })}`
    : '';

  const linkToCompetitionDetails = `${generatePath(
    FOOTBALL_COMPETITION_DETAILS,
    {
      tab: correspondingLineup ? 'team' : 'details',
      competition: so5Leaderboard.slug,
    }
  )}${competitionDetailsQueryParams}`;

  const getStatus = () => {
    if (!correspondingLineup) {
      return (
        <StyledTooltip
          title={
            <FormattedMessage
              id="Lobby.CompetitionListTable.NotJoined"
              defaultMessage="Not joined"
            />
          }
        >
          <StatusWrapper />
        </StyledTooltip>
      );
    }
    if (joined) {
      return (
        <StyledTooltip
          title={
            <FormattedMessage
              id="Lobby.CompetitionListTable.Confirmed"
              defaultMessage="Confirmed"
            />
          }
        >
          <StatusWrapper className="confirmed">
            <FontAwesomeIcon
              icon={faCheck}
              size="xs"
              color="var(--c-neutral-200)"
            />
          </StatusWrapper>
        </StyledTooltip>
      );
    }
    return (
      <StyledTooltip
        title={
          <FormattedMessage
            id="Lobby.CompetitionListTable.Unconfirmed"
            defaultMessage="Unconfirmed"
          />
        }
      >
        <StatusWrapper className="unconfirmed">
          <FontAwesomeIcon
            icon={faClose}
            size="xs"
            color="var(--c-neutral-200)"
          />
        </StatusWrapper>
      </StyledTooltip>
    );
  };

  const rewards = (
    <RewardsWrapper>
      <Rewards rewards={totalRewards} hideExperienceDescription />
    </RewardsWrapper>
  );

  const name = (
    <LinkOverlay
      as={StyledLink}
      to={linkToCompetitionDetails}
      onClick={() => {
        track('Click Competition', {
          leaderboardSlug: so5Leaderboard.slug,
          leaderboardName: so5Leaderboard.displayName,
        });
      }}
    >
      <LeaderboardNameWrapper bold>
        <LeaderboardName>
          {getLineupDisplayName(correspondingLineup, so5Leaderboard)}
        </LeaderboardName>
        {!!so5Leaderboard.description && (
          <TooltipWrapper>
            <LinkOther as={Tooltip} title={so5Leaderboard.description}>
              <small>
                <Info />
              </small>
            </LinkOther>
          </TooltipWrapper>
        )}
      </LeaderboardNameWrapper>
    </LinkOverlay>
  );
  return (
    <Line key={so5Leaderboard.slug}>
      <StatusCell area={Areas.status}>{getStatus()}</StatusCell>

      <DivisionCell area={Areas.logo}>
        <DivisionLogo so5Leaderboard={so5Leaderboard} />
      </DivisionCell>
      <Cell hideOnDesktop area={Areas.nameAndScarcity}>
        <NameAndScarcityWrapper>
          <Caption color="var(--c-neutral-600)">
            <FormattedMessage {...scarcityMessageDescriptor} />
          </Caption>
          {name}
        </NameAndScarcityWrapper>
      </Cell>
      <Cell showOnDesktop area={Areas.name}>
        {name}
      </Cell>
      <Cell showOnDesktop area={Areas.scarcity}>
        <Text14 color="var(--c-neutral-600)">
          <FormattedMessage {...scarcityMessageDescriptor} />
        </Text14>
      </Cell>
      <ParticipantsAndRewards area={Areas.participantsAndRewards} hideOnDesktop>
        {lineupId === 0 && (
          <>
            <Participants>
              <UserGrey />
              <Text14 color="var(--c-neutral-600)" as="span">
                <FormattedNumber value={so5LineupsCount} notation="standard" />
              </Text14>
            </Participants>
            <svg width="4" viewBox="0 0 8 8">
              <circle r="4" cx="4" cy="4" fill="var(--c-neutral-400)" />
            </svg>
          </>
        )}
        {hasRewards && (
          <CellLink
            as={Link}
            to={`${generatePath(FOOTBALL_COMPETITION_DETAILS_REWARDS, {
              competition: so5Leaderboard.slug,
            })}${competitionDetailsQueryParams}`}
          >
            {rewards}
          </CellLink>
        )}
      </ParticipantsAndRewards>
      <Cell area={Areas.rewards} showOnDesktop>
        {hasRewards && (
          <CellLink
            as={Link}
            to={`${generatePath(FOOTBALL_COMPETITION_DETAILS_REWARDS, {
              competition: so5Leaderboard.slug,
            })}${competitionDetailsQueryParams}`}
          >
            {rewards}
          </CellLink>
        )}
      </Cell>
      <Cell area={Areas.participants} showOnDesktop>
        {lineupId === 0 && (
          <Participants>
            <UserGrey />
            <Text14 color="var(--c-neutral-600)" as="span">
              <FormattedNumber value={so5LineupsCount} notation="standard" />
            </Text14>
          </Participants>
        )}
      </Cell>
      <Cell area={Areas.cta}>
        {rowCta ?? (
          <CompetitionListActions
            so5Leaderboard={so5Leaderboard}
            onActionSuccess={onActionSuccess}
            lineupId={lineupId}
            linkToCompetitionDetails={linkToCompetitionDetails}
          />
        )}
      </Cell>
      {so5Leaderboard && (
        <Prize area={Areas.prize}>
          <HeadlineWrapper
            as={Link}
            to={`${generatePath(FOOTBALL_COMPETITION_DETAILS_REWARDS, {
              competition: so5Leaderboard.slug,
            })}${competitionDetailsQueryParams}`}
          >
            <HeadlineRewards leaderboard={so5Leaderboard} />
          </HeadlineWrapper>
        </Prize>
      )}
    </Line>
  );
};

TableRow.fragments = {
  so5Leaderboard: gql`
    fragment TableRow_so5Leaderboard on So5Leaderboard {
      slug
      description
      so5LineupsCount
      startDate
      mySo5Lineups {
        id
        draft
        name
        ...getLineupDisplayName_so5Lineup
      }
      totalRewards {
        ...Rewards_rewardsOverview
      }
      ...getLeaderboardInfo_so5Leaderboard
      ...DivisionLogo_so5Leaderboard
      ...CompetitionListActions_so5Leaderboard
      ...HeadlineRewards_so5Leaderboard
      ...getLineupDisplayName_so5Leaderboard
    }
    ${DivisionLogo.fragments.so5Leaderboard}
    ${CompetitionListActions.fragments.so5Leaderboard}
    ${getLeaderboardInfo.fragments.so5Leaderboard}
    ${HeadlineRewards.fragments.so5Leaderboard}
    ${Rewards.fragments.reward}
    ${getLineupDisplayName.fragments.so5Leaderboard}
    ${getLineupDisplayName.fragments.so5Lineup}
  `,
};

export default TableRow;

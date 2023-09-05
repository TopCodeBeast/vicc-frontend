import { TypedDocumentNode, gql } from '@apollo/client';
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
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { Rewards } from '@football/components/lineup/Rewards';
import HeadlineRewards from '@football/components/lobby/HeadlineRewards';
import DivisionLogo from '@football/components/so5/DivisionLogo';
import { useFootballEvents } from '@football/lib/events';
import getLineupDisplayName from '@football/lib/lineup/getLineupDisplayName';
import { getLeaderboardInfo } from '@football/lib/so5';
import CompetitionListActions from '@football/pages/Lobby/Components/CompetitionListActions';

import { TableRow_vicc5Leaderboard } from './__generated__/index.graphql';

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
  @media ${laptopAndAbove} {
    display: flex;
    color: var(--c-neutral-600);
  }
`;
const Participants = styled(Caption)`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  @media ${tabletAndAbove} {
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
  @media ${tabletAndAbove} {
    padding-top: 0;
    ${text14}
  }
`;

const ParticipantsAndRewards = styled(Cell)`
  gap: var(--unit);
`;
const Prize = styled(Cell)`
  margin-bottom: var(--half-unit);
  @media ${laptopAndAbove} {
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
  vicc5Leaderboard: TableRow_vicc5Leaderboard;
  onActionSuccess: () => void;
  lineupId: number;
  rowCta: ReactNode;
};

const TableRow = ({
  vicc5Leaderboard,
  onActionSuccess,
  lineupId,
  rowCta,
}: Props) => {
  const { totalRewards, myVicc5Lineups, vicc5LineupsCount } = vicc5Leaderboard;
  const { scarcityMessageDescriptor, hasRewards } =
    getLeaderboardInfo(vicc5Leaderboard);
  const track = useFootballEvents();

  const correspondingLineup = myVicc5Lineups[lineupId];
  const joined = !correspondingLineup?.draft;
  const competitionDetailsQueryParams = correspondingLineup
    ? `?${qs.stringify({ id: idFromObject(correspondingLineup.id) })}`
    : '';

  const linkToCompetitionDetails = `${generatePath(
    FOOTBALL_COMPETITION_DETAILS,
    {
      tab: correspondingLineup ? 'team' : 'details',
      competition: vicc5Leaderboard.slug,
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
          leaderboardSlug: vicc5Leaderboard.slug,
          leaderboardName: vicc5Leaderboard.displayName,
        });
      }}
    >
      <LeaderboardNameWrapper bold>
        <LeaderboardName>
          {getLineupDisplayName(correspondingLineup, vicc5Leaderboard)}
        </LeaderboardName>
        {!!vicc5Leaderboard.description && (
          <TooltipWrapper>
            <LinkOther as={Tooltip} title={vicc5Leaderboard.description}>
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
    <Line key={vicc5Leaderboard.slug}>
      <StatusCell area={Areas.status}>{getStatus()}</StatusCell>

      <DivisionCell area={Areas.logo}>
        <DivisionLogo vicc5Leaderboard={vicc5Leaderboard} />
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
                <FormattedNumber value={vicc5LineupsCount} notation="standard" />
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
              competition: vicc5Leaderboard.slug,
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
              competition: vicc5Leaderboard.slug,
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
              <FormattedNumber value={vicc5LineupsCount} notation="standard" />
            </Text14>
          </Participants>
        )}
      </Cell>
      <Cell area={Areas.cta}>
        {rowCta ?? (
          <CompetitionListActions
            vicc5Leaderboard={vicc5Leaderboard}
            onActionSuccess={onActionSuccess}
            lineupId={lineupId}
            linkToCompetitionDetails={linkToCompetitionDetails}
          />
        )}
      </Cell>
      {vicc5Leaderboard && (
        <Prize area={Areas.prize}>
          <HeadlineWrapper
            as={Link}
            to={`${generatePath(FOOTBALL_COMPETITION_DETAILS_REWARDS, {
              competition: vicc5Leaderboard.slug,
            })}${competitionDetailsQueryParams}`}
          >
            <HeadlineRewards leaderboard={vicc5Leaderboard} />
          </HeadlineWrapper>
        </Prize>
      )}
    </Line>
  );
};

TableRow.fragments = {
  vicc5Leaderboard: gql`
    fragment TableRow_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      description
      vicc5LineupsCount
      startDate
      myVicc5Lineups {
        id
        draft
        name
        ...getLineupDisplayName_vicc5Lineup
      }
      totalRewards {
        ...Rewards_rewardsOverview
      }
      ...getLeaderboardInfo_vicc5Leaderboard
      ...DivisionLogo_vicc5Leaderboard
      ...CompetitionListActions_vicc5Leaderboard
      ...HeadlineRewards_vicc5Leaderboard
      ...getLineupDisplayName_vicc5Leaderboard
    }
    ${DivisionLogo.fragments.vicc5Leaderboard}
    ${CompetitionListActions.fragments.vicc5Leaderboard}
    ${getLeaderboardInfo.fragments.vicc5Leaderboard}
    ${HeadlineRewards.fragments.vicc5Leaderboard}
    ${Rewards.fragments.reward}
    ${getLineupDisplayName.fragments.vicc5Leaderboard}
    ${getLineupDisplayName.fragments.vicc5Lineup}
  ` as TypedDocumentNode<TableRow_vicc5Leaderboard>,
};

export default TableRow;

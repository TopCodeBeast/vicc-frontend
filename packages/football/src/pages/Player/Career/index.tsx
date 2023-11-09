import { TypedDocumentNode, gql } from '@apollo/client';
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import classnames from 'classnames';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Table from '@sorare/core/src/atoms/layout/Table';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Caption, Text14, Title6 } from '@sorare/core/src/atoms/typography';
import FlagAvatar from '@sorare/core/src/components/country/FlagAvatar';
import { FOOTBALL_COUNTRY_SHOW } from '@sorare/core/src/constants/routes';
import { isType } from '@sorare/core/src/lib/gql';

import TeamPicture from '@football/components/club/TeamPicture';

import { Career_player } from './__generated__/index.graphql';

type Props = {
  player: Career_player;
};

const messages = defineMessages({
  title: {
    id: 'Career.title',
    defaultMessage: 'Transfers detailed',
  },
  yearClub: {
    id: 'Career.yearClub',
    defaultMessage: 'Year / club',
  },
  competition: {
    id: 'Career.competition',
    defaultMessage: 'Competition',
  },
  appearances: {
    id: 'Career.appearances',
    defaultMessage: 'APP (ST)',
  },
  goals: {
    id: 'Career.goals',
    defaultMessage: 'GLS',
  },
  assists: {
    id: 'Career.assists',
    defaultMessage: 'ASTS',
  },
  appearancesTooltip: {
    id: 'Career.appearancesTooltip',
    defaultMessage: 'Appearances (Start)',
  },
  goalsTooltip: {
    id: 'Career.goalsTooltip',
    defaultMessage: 'Goals',
  },
  assistsTooltip: {
    id: 'Career.assistsTooltip',
    defaultMessage: 'Assists',
  },
});

const formatDateToTwoLetterYear = (date: string) => {
  return new Date(date).getFullYear().toString().slice(-2);
};

const YearClubLogo = styled.div`
  display: flex;
  align-items: center;
`;
const Picture = styled(TeamPicture)`
  width: 32px;
  margin-right: 10px;
`;
const YearClub = styled.div`
  display: flex;
  flex-direction: column;
`;
const Contract = styled(Caption)`
  color: var(--c-neutral-600);
  &.active {
    color: var(--c-neutral-1000);
    font-weight: var(--t-bold);
  }
`;

export const Career = ({ player: { clubMemberships } }: Props) => {
  const { formatMessage } = useIntl();

  if (clubMemberships.length === 0) {
    return null;
  }

  return (
    <div>
      <Title6 as="h2">
        <FormattedMessage {...messages.title} />
      </Title6>
      <TableContainer>
        <Table aria-label="Career Stats">
          <TableHead>
            <TableRow>
              <TableCell>{formatMessage(messages.yearClub)}</TableCell>
              <TableCell>{formatMessage(messages.competition)}</TableCell>
              <TableCell />
              <TableCell>
                <Tooltip title={formatMessage(messages.appearancesTooltip)}>
                  <div>{formatMessage(messages.appearances)}</div>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={formatMessage(messages.goalsTooltip)}>
                  <div>{formatMessage(messages.goals)}</div>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={formatMessage(messages.assistsTooltip)}>
                  <div>{formatMessage(messages.assists)}</div>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...clubMemberships]
              .sort(
                (a, b) =>
                  new Date(b.startDate).getTime() -
                  new Date(a.startDate).getTime()
              )
              .map((membership, index) => {
                const {
                  startDate,
                  endDate,
                  membershipTeam,
                  //aggregatedStats,
                  id,
                } = membership;
                const { appearances, goals, assists, substituteIn } =
                  { appearances: null, goals: null, assists: null, substituteIn: null };
                //aggregatedStats;

                if (!appearances) return null;
                if (!membershipTeam) return null;

                return (
                  <TableRow key={id}>
                    <TableCell>
                      <YearClubLogo>
                        <Picture team={membershipTeam} />
                        <YearClub>
                          <Caption bold color="var(--c-neutral-1000)">
                            {formatDateToTwoLetterYear(startDate)}
                            {endDate &&
                              `/${formatDateToTwoLetterYear(endDate)}`}
                          </Caption>
                          <Contract
                            className={classnames({
                              active: index === 0,
                            })}
                          >
                            {membershipTeam.name}
                          </Contract>
                        </YearClub>
                      </YearClubLogo>
                    </TableCell>
                    <TableCell>
                      {isType(membershipTeam, 'Club') &&
                        membershipTeam.domesticLeague && (
                          <Caption bold color="var(--c-neutral-1000)">
                            {membershipTeam.domesticLeague.displayName}
                          </Caption>
                        )}
                    </TableCell>
                    <TableCell>
                      {isType(membershipTeam, 'Club') &&
                        membershipTeam.domesticLeague?.country && (
                          <Link
                            to={generatePath(FOOTBALL_COUNTRY_SHOW, {
                              slug: membershipTeam.domesticLeague?.country
                                ?.slug,
                            })}
                          >
                            <FlagAvatar
                              country={membershipTeam.domesticLeague?.country}
                              imageRes={32}
                              type="flat"
                            />
                          </Link>
                        )}
                    </TableCell>
                    <TableCell>
                      <Text14 color="var(--c-neutral-1000)">
                        {appearances} ({appearances - substituteIn})
                      </Text14>
                    </TableCell>
                    <TableCell>
                      <Text14 color="var(--c-neutral-1000)">{goals}</Text14>
                    </TableCell>
                    <TableCell>
                      <Text14 color="var(--c-neutral-1000)">{assists}</Text14>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

Career.fragments = {
  player: gql`
    fragment Career_player on Player {
      slug
      clubMemberships {
        id
        startDate
        endDate
        membershipTeam {
          ... on TeamInterface {
            slug
            name
          }
          ... on Club {
            slug
            domesticLeague {
              slug
              displayName
              country {
                slug
              }
            }
          }
          ...TeamPicture_team
        }
        #aggregatedStats {
        #  id
        #  appearances
        #  goals
        #  assists
        #  substituteIn
        #}
      }
    }
    ${TeamPicture.fragments.team}
  ` as TypedDocumentNode<Career_player>,
};

export default Career;

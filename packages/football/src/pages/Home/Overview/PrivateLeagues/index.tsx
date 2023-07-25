import { gql } from '@apollo/client';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import privateLeague from '@sorare/core/src/assets/private-league.png';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { LinkBox, LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import {
  FOOTBALL_PRIVATE_LEAGUES,
  FOOTBALL_PRIVATE_LEAGUES_CREATE,
  PrivateLeaguesStep,
} from '@sorare/core/src/constants/routes';
import { groupBy } from '@sorare/core/src/lib/arrays';

import { HomeBlock } from '@football/components/Home/Block';
import { ItemRows } from '@football/components/Home/ItemRows';
import { SeeAllButton } from '@football/components/Home/SeeAllButton';
import { homeLabels } from '@football/lib/home';
import { sortLeaderboardsByTournamentType } from '@football/lib/so5';

import { PrivateLeagueBlock } from './PrivateLeagueBlock';
import { PrivateLeagues_so5 } from './__generated__/index.graphql';

const EmptyWrapper = styled(LinkBox)`
  background: var(--c-neutral-200);
  flex: 1;
  display: flex;
  padding: var(--double-unit);
  border-radius: var(--intermediate-unit);
  gap: var(--double-unit);
  align-items: center;
`;

const EmptyContent = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
`;

const IconButtonWrapper = styled(LinkOverlay)`
  border: 2px solid var(--c-neutral-600);
`;

type Props = {
  so5?: PrivateLeagues_so5;
  loading: boolean;
};

export const PrivateLeagues = ({ so5, loading }: Props) => {
  const userGroups = so5?.mySo5UserGroups?.nodes; //TODO*************
  const { totalCount } = so5?.mySo5UserGroups || {};

  const groupedByTournamentsGroups = useMemo(
    () =>
      userGroups
        ? Object.values(
            groupBy(
              node => node.so5TournamentType.so5LeaderboardType,
              userGroups
            )
          ).sort((a, b) => {
            return sortLeaderboardsByTournamentType(
              a[0].so5TournamentType.so5LeaderboardType,
              b[0].so5TournamentType.so5LeaderboardType
            );
          })
        : [],
    [userGroups]
  );

  return (
    <HomeBlock
      loading={loading}
      title={
        <FormattedMessage
          id="Home.PrivateLeagues.Title"
          defaultMessage="Play with friends"
        />
      }
      subtitle={
        totalCount && totalCount > 1 ? (
          <FormattedMessage
            {...homeLabels.lineupsCount}
            values={{
              teams: totalCount,
            }}
          />
        ) : (
          <FormattedMessage
            id="Home.PrivateLeagues.Subtitle"
            defaultMessage="See how you perform against your friends"
          />
        )
      }
      action={
        <SeeAllButton
          context="Private Leagues"
          to={generatePath(FOOTBALL_PRIVATE_LEAGUES)}
        />
      }
    >
      {groupedByTournamentsGroups.length ? (
        <ItemRows
          minHeight={200}
          loading={loading}
          itemsCount={groupedByTournamentsGroups.length}
        >
          {groupedByTournamentsGroups.slice(0, 3).map(group => (
            <PrivateLeagueBlock key={group[0].slug} userGroupsList={group} />
          ))}
        </ItemRows>
      ) : (
        <EmptyWrapper>
          <img src={privateLeague} alt="private league" width={60} />
          <EmptyContent>
            <Text16 bold color="var(--c-neutral-1000)">
              <FormattedMessage
                id="Home.PrivateLeagues.EmptyTitle"
                defaultMessage="Private Leagues"
              />
            </Text16>
            <Text14 color="var(--c-neutral-600)">
              <FormattedMessage
                id="Home.PrivateLeagues.EmptySubtitle"
                defaultMessage="Create or join a private league to play with friends"
              />
            </Text14>
          </EmptyContent>
          <IconButtonWrapper
            as={IconButton}
            component={Link}
            icon={faChevronRight}
            to={generatePath(FOOTBALL_PRIVATE_LEAGUES_CREATE, {
              step: PrivateLeaguesStep.CREATE,
            })}
            color="dark"
            className="light-theme"
            small
          />
        </EmptyWrapper>
      )}
    </HomeBlock>
  );
};

PrivateLeagues.fragments = {
  so5: gql`
    fragment PrivateLeagues_so5 on Vicc5Root {
      mySo5UserGroups: myVicc5UserGroups(first: 20, statuses: [STARTED, TO_START]) {
        nodes {
          slug
          so5TournamentType: vicc5TournamentType {
            id
            so5LeaderboardType: vicc5LeaderboardType
          }
          ...PrivateLeagueBlock_userGroup
        }
        totalCount
      }
    }
    ${PrivateLeagueBlock.fragments.userGroup}
  `,
};

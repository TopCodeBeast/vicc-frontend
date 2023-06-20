import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { FOOTBALL_LOBBY_PAST } from '@sorare/core/src/constants/routes';

import { HomeBlock } from '@sorare/football/src/components/Home/Block';
import { ItemRows } from '@sorare/football/src/components/Home/ItemRows';
import { SeeAllButton } from '@sorare/football/src/components/Home/SeeAllButton';
import { Lineup } from '@sorare/football/src/components/lineup/Lineup';
import { homeLabels } from 'lib/home';
import { getRewardType } from 'lib/lineupRewards';

import { Past_so5 } from './__generated__/index.graphql';

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

type Props = {
  so5?: Past_so5;
  loading: boolean;
};
export const Past = ({ so5, loading }: Props) => {
  const so5Fixture = so5?.pastFixture;
  const { edges } = so5Fixture?.mySo5LineupsPaginated || {};
  const lineups =
    edges?.map(edge => edge.node).filter(lineup => lineup?.so5Leaderboard) ||
    [];
  const lineupsCount = so5Fixture?.mySo5LineupsCount;

  if (!lineups.length && !loading) {
    return null;
  }

  return (
    <HomeBlock
      title={
        <Title>
          <FormattedMessage
            id="Home.Past.Title"
            defaultMessage="Your Game Week {gameWeek, number} performance"
            values={{ gameWeek: so5Fixture?.gameWeek }}
          />
        </Title>
      }
      subtitle={
        <FormattedMessage
          {...homeLabels.lineupsCount}
          values={{
            teams: lineupsCount,
          }}
        />
      }
      loading={loading}
      action={
        lineupsCount &&
        lineupsCount > 3 && (
          <SeeAllButton
            context="Past"
            to={generatePath(FOOTBALL_LOBBY_PAST, {
              tab: 'my-teams',
              slug: so5Fixture?.slug,
            })}
          />
        )
      }
    >
      <ItemRows itemsCount={lineups.length} loading={loading}>
        {lineups.map(
          lineup =>
            lineup?.so5Leaderboard && (
              <Lineup
                key={lineup.id}
                leaderboard={lineup.so5Leaderboard}
                lineup={lineup}
                rewardType={getRewardType(so5Fixture)}
                displayScore
              />
            )
        )}
      </ItemRows>
    </HomeBlock>
  );
};

Past.fragments = {
  so5: gql`
    fragment Past_so5 on So5Root {
      pastFixture: so5Fixture(type: PAST) {
        slug
        aasmState
        gameWeek
        mySo5LineupsCount(training: false)
        mySo5LineupsPaginated(first: 3, withTraining: false) {
          edges {
            node {
              id
              ...Lineup_so5Lineup
              so5Leaderboard {
                slug
                ...Lineup_so5Leaderboard
              }
            }
          }
        }
        ...getRewardType_so5Fixture
      }
    }
    ${getRewardType.fragments.so5Fixture}
    ${Lineup.fragments.so5Leaderboard}
    ${Lineup.fragments.so5Lineup}
  `,
};

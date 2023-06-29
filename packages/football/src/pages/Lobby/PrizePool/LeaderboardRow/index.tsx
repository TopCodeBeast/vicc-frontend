import { gql } from '@apollo/client';
import { useIntl } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_COMPETITION_DETAILS_REWARDS } from '@sorare/core/src/constants/routes';
import { Link } from '@sorare/core/src/routing/Link';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { getLeaderboardInfo } from '@football/lib/so5';

import Rewards from './Rewards';
import { LeaderboardRow_so5Leaderboard } from './__generated__/index.graphql';

export enum Areas {
  logo = 'logo',
  name = 'name',
  rewards = 'rewards',
  rarity = 'rarity',
}

const Root = styled(Link)`
  grid-template-areas:
    '${Areas.logo} ${Areas.rarity}'
    '${Areas.logo} ${Areas.name}'
    '${Areas.rewards} ${Areas.rewards}';
  display: grid;
  align-items: center;
  column-gap: var(--unit);
  grid-template-columns: min-content 1fr;
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-200);
  &,
  &:focus,
  &:hover {
    color: inherit;
  }
  @media ${tabletAndAbove} {
    grid-template-areas: '${Areas.logo} ${Areas.name} ${Areas.rarity} ${Areas.rewards}';
    grid-template-columns: 50px 220px 100px 1fr;
  }
`;
const LeaderboardLogo = styled.div`
  grid-area: ${Areas.logo};
  padding: var(--double-unit) var(--unit) var(--double-unit) var(--double-unit);
`;
const Logo = styled.img`
  width: 40px;
  height: 40px;
  @media ${tabletAndAbove} {
    width: 32px;
    height: 32px;
  }
`;
const LeaderboardName = styled.div`
  grid-area: ${Areas.name};
  align-self: start;
  @media ${tabletAndAbove} {
    padding-top: 0;
    align-self: center;
  }
`;
const LeaderboardRarity = styled.div`
  grid-area: ${Areas.rarity};
  align-self: end;
  @media ${tabletAndAbove} {
    padding-top: 0;
    align-self: center;
  }
`;
const LeaderboardRewards = styled.div`
  grid-area: ${Areas.rewards};
  padding: var(--double-unit);
  border-top: 1px solid var(--c-neutral-300);
  @media ${tabletAndAbove} {
    border-top: none;
  }
`;

type Props = {
  so5Leaderboard: LeaderboardRow_so5Leaderboard;
};
const LeaderboardRow = ({ so5Leaderboard }: Props) => {
  const { formatMessage } = useIntl();
  const { scarcityMessageDescriptor } = getLeaderboardInfo(so5Leaderboard);
  const to = generatePath(FOOTBALL_COMPETITION_DETAILS_REWARDS, {
    competition: so5Leaderboard.slug,
  });

  const rewards = [
    ...(so5Leaderboard.rewardsConfig.ranking || []),
    ...(so5Leaderboard.rewardsConfig.conditional || []),
  ];

  return (
    <Root key={so5Leaderboard.slug} to={to}>
      <LeaderboardLogo>
        <Logo
          src={so5Leaderboard.svgLogoUrl}
          alt={so5Leaderboard.displayName}
        />
      </LeaderboardLogo>
      <LeaderboardName>{so5Leaderboard.displayName}</LeaderboardName>
      <LeaderboardRarity>
        <Text16 color="var(--c-neutral-600)">
          {formatMessage(scarcityMessageDescriptor)}
        </Text16>
      </LeaderboardRarity>
      {rewards.length > 0 && (
        <LeaderboardRewards>
          <Rewards rewards={rewards} />
        </LeaderboardRewards>
      )}
    </Root>
  );
};

LeaderboardRow.fragments = {
  so5Leaderboard: gql`
    fragment LeaderboardRow_so5Leaderboard on So5Leaderboard {
      slug
      displayName
      rarityType
      svgLogoUrl
      rewardsConfig {
        ranking {
          score
          ...Rewards_so5RewardConfig
        }
        conditional {
          score
          ...Rewards_so5RewardConfig
        }
      }
      ...getLeaderboardInfo_so5Leaderboard
    }
    ${Rewards.fragments.so5RewardConfig}
    ${getLeaderboardInfo.fragments.so5Leaderboard}
  `,
};

export default LeaderboardRow;

import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import styled from 'styled-components';

import { Vicc5Tournament } from '@sorare/core/src/__generated__/globalTypes';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import CardRewards from '@football/pages/Home/ClubHonors/CardRewards';

import LeaderboardsCollapse from './LeaderboardsCollapse';
import { ClubHonorsSummaryByLeaderboard_user } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;
const LeaderboardRewards = styled.button`
  width: 100%;
  text-align: left;
  display: grid;
  grid-template-columns: min-content 1fr max-content;
  grid-template-areas:
    'logo name'
    'trophies trophies';
  gap: var(--double-unit);
  align-items: center;
  padding: var(--double-unit);
  color: var(--c-neutral-1000);
  background-color: var(--c-neutral-200);
  &:first-child {
    border-top-left-radius: var(--double-unit);
    border-top-right-radius: var(--double-unit);
  }
  &:last-child {
    border-bottom-left-radius: var(--double-unit);
    border-bottom-right-radius: var(--double-unit);
  }
  &:not(:last-child) {
    border-bottom: 1px solid var(--c-neutral-400);
  }
  &.selected {
    border: 1px solid var(--c-brand-600);
    background: linear-gradient(
        0deg,
        rgba(var(--c-rgb-brand-600), 0.2),
        rgba(var(--c-rgb-brand-600), 0.2)
      ),
      var(--c-neutral-300);
  }
  @media ${tabletAndAbove} {
    grid-template-areas: 'logo name trophies';
  }
`;
const LeaderboardLogo = styled.img`
  grid-area: logo;
  width: 32px;
  height: 32px;
`;
const LeaderboardName = styled.p`
  grid-area: name;
`;
const RewardsWrapper = styled.div`
  grid-area: trophies;
`;

type Props = {
  leaderboards: ClubHonorsSummaryByLeaderboard_user['trophies'];
  selectedLeaderboard: Vicc5Tournament | null;
  onSelectLeaderboard: React.Dispatch<
    React.SetStateAction<Vicc5Tournament | null>
  >;
};
const ClubHonorsSummaryByLeaderboard = ({
  leaderboards,
  selectedLeaderboard,
  onSelectLeaderboard,
}: Props) => {
  const { slug: vicc5LeaderboardType } = selectedLeaderboard || {};

  if (!leaderboards) {
    return null;
  }

  const onClick = (vicc5Tournament: Vicc5Tournament) => {
    if (vicc5LeaderboardType === vicc5Tournament.slug) {
      onSelectLeaderboard(null);
    } else {
      onSelectLeaderboard(vicc5Tournament);
    }
  };

  return (
    <Root>
      <LeaderboardsCollapse showMore={leaderboards.length > 5}>
        <div>
          {leaderboards.map(({ vicc5Tournament, ...cards }) => (
            <LeaderboardRewards
              key={vicc5Tournament.id}
              className={classnames({
                selected:
                  vicc5LeaderboardType === vicc5Tournament.slug,
              })}
              onClick={() => onClick(vicc5Tournament)}
            >
              <LeaderboardLogo
                src={vicc5Tournament.svgLogoUrl}
                alt={vicc5Tournament.displayName}
              />
              <LeaderboardName>{vicc5Tournament.displayName}</LeaderboardName>
              <RewardsWrapper>
                <CardRewards {...cards} />
              </RewardsWrapper>
            </LeaderboardRewards>
          ))}
        </div>
      </LeaderboardsCollapse>
    </Root>
  );
};

ClubHonorsSummaryByLeaderboard.fragments = {
  user: gql`
    fragment ClubHonorsSummaryByLeaderboard_user on PublicUserInfoInterface {
      slug
      trophies {
        vicc5Tournament {
          id
          displayName
          slug
          svgLogoUrl
        }
        limited: cardRewards(rarity: limited)
        rare: cardRewards(rarity: rare)
        superRare: cardRewards(rarity: super_rare)
        unique: cardRewards(rarity: unique)
        customSeries: cardRewards(rarity: custom_series)
        top1: podiumRankings(ranking: 1)
        top2: podiumRankings(ranking: 2)
        top3: podiumRankings(ranking: 3)
      }
    }
  ` as TypedDocumentNode<ClubHonorsSummaryByLeaderboard_user>,
};

export default ClubHonorsSummaryByLeaderboard;

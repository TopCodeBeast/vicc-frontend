import { gql } from '@apollo/client';
import classNames from 'classnames';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { LeaderboardRarity } from '__generated__/usSportsGlobalTypes';
import { Text14 } from '@core/atoms/typography';
import { proxyUrl } from '@core/atoms/ui/ResponsiveImg';
import { PictureAvatar, PlaceHolderAvatar } from '@core/components/user/Avatar';
import idFromObject from '@core/gql/idFromObject';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useQuery from '@core/hooks/graphql/useQuery';
import { useUSSportsQuery } from '@core/hooks/graphql/useUSSportsQuery';
import { Scarcity } from '@core/lib/cards';
// import {
//   BaseballPastWinnerQuery,
//   NBAPastWinnerQuery,
// } from '@core/lib/usSportsGraphql/__generated__/queries.graphql';
// import {
//   BASEBALL_PAST_WINNER_QUERY,
//   NBA_PAST_WINNER_QUERY,
// } from '@core/lib/usSportsGraphql/queries';
import { theme } from '@core/style/theme';

import {
  FootballPastLeaderboardQuery,
  FootballPastLeaderboardSlugQuery,
  FootballPastLineupWinnerQuery,
} from './__generated__/PastWinners.graphql';

const messages = defineMessages({
  firstPlace: {
    id: 'Landing.communityBlock.pastWinners.firstPlace',
    defaultMessage: '1st place',
  },
  points: {
    id: 'Landing.communityBlock.pastWinners.points',
    defaultMessage: 'PTS',
  },
});

const Wrapper = styled.div`
  display: flex;
  gap: var(--intermediate-unit);
  padding: var(--double-unit);
  border-radius: var(--triple-unit);
  flex-direction: column;
  background-color: #1c1c1c;
`;

const LeaderboardNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const LeaderboardName = styled.p`
  font-size: var(--t-14);
`;

const Ranking = styled.div`
  display: flex;
  justify-content: space-between;

  padding-bottom: var(--intermediate-unit);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  margin-bottom: var(--intermediate-unit);
`;

const UserPanel = styled.div`
  display: flex;
  gap: var(--unit);
`;

const Rank = styled.div`
  span {
    color: var(--c-static-neutral-100);
    &.limited {
      color: #dfad46;
    }
    &.rare {
      color: #f2412d;
    }
    &.superRare,
    &.super_rare {
      color: #366bf2;
    }
    &.unique {
      color: #feecb3;
    }
  }
`;

const Score = styled(Text14)`
  font-weight: bold;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 18px;
  }
`;

const CardsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  height: 100%;
  gap: var(--unit);
  align-items: center;
  grid-template-columns: repeat(5, 1fr);

  &.sevenCards {
    gap: var(--half-unit);
    grid-template-columns: repeat(7, 1fr);
  }

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    grid-template-columns: repeat(5, minmax(70px, 1fr));
    &.sevenCards {
      grid-template-columns: repeat(7, minmax(60px, 1fr));
    }
  }

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    grid-template-columns: repeat(5, 1fr);
    &.sevenCards {
      grid-template-columns: repeat(7, 1fr);
    }
  }
`;

const Cards = styled.img`
  width: 100%;
`;

const UserName = styled.p`
  font-size: var(--t-20);
  font-family: 'Druk Wide';
  text-transform: uppercase;
  max-width: 10ch;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 26px;
  }
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    font-size: var(--t-20);
  }
`;

type PastWinnerProps = {
  leaderboardIconUrl: string;
  leaderboardName: string;
  leaderboardRarity: Scarcity | LeaderboardRarity | null;
  lineupsCount: number;
  winner: { nickname: string; avatarUrl: string | null };
  score: number;
  cards: {
    imageUrl: string | null;
  }[];
};

const PastWinnerDumb = ({
  cards,
  leaderboardIconUrl,
  leaderboardName,
  leaderboardRarity,
  lineupsCount,
  score,
  winner,
}: PastWinnerProps) => {
  const { up: isTabletOrDesktop } = useScreenSize('tablet');
  const { formatMessage, formatNumber } = useIntl();

  return (
    <Wrapper>
      <LeaderboardNameWrapper>
        <img width={20} src={leaderboardIconUrl} alt={leaderboardName} />
        <LeaderboardName>{leaderboardName}</LeaderboardName>
      </LeaderboardNameWrapper>
      <Ranking>
        {winner?.nickname && (
          <UserPanel>
            {winner?.avatarUrl ? (
              <PictureAvatar
                rounded
                variant={isTabletOrDesktop ? 'large' : 'medium'}
                user={winner}
                pictureUrl={winner.avatarUrl}
              />
            ) : (
              <PlaceHolderAvatar
                rounded
                user={winner}
                variant={isTabletOrDesktop ? 'large' : 'medium'}
              />
            )}
            <div>
              <Rank>
                <span className={leaderboardRarity?.toLocaleLowerCase()}>
                  {formatMessage(messages.firstPlace)}
                </span>
                &nbsp;/&nbsp;{formatNumber(lineupsCount)}
              </Rank>
              <UserName>{winner.nickname}</UserName>
            </div>
          </UserPanel>
        )}
        <Score>
          {formatNumber(score)}&nbsp;
          {formatMessage(messages.points)}
        </Score>
      </Ranking>
      <CardsWrapper className={classNames({ sevenCards: cards?.length === 7 })}>
        {cards?.map((card, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            {card.imageUrl && (
              <Cards
                src={proxyUrl(card.imageUrl, {
                  cropWidth: 80,
                })}
              />
            )}
          </div>
        ))}
      </CardsWrapper>
    </Wrapper>
  );
};

type Props = {
  leaderboardSlug: string;
};

export const NBAPastWinners = ({ leaderboardSlug }: Props) => {
  /*const { data } = useUSSportsQuery<NBAPastWinnerQuery>(NBA_PAST_WINNER_QUERY);

  const lastLeaderboard = data?.nbaPastFixtures.nodes[0]?.leaderboards?.find(
    leaderboard => leaderboard.slug.includes(leaderboardSlug)
  );

  if (!lastLeaderboard) return null;
  const winner = lastLeaderboard.lineups.nodes[0];
  return (
    <PastWinnerDumb
      leaderboardIconUrl={lastLeaderboard.iconImageUrl}
      leaderboardName={lastLeaderboard.displayName}
      leaderboardRarity={lastLeaderboard.leaderboardRarity}
      lineupsCount={lastLeaderboard.lineupsCount}
      winner={{
        nickname: winner?.user?.nickname,
        avatarUrl: winner?.user?.avatarUrl,
      }}
      score={winner?.score}
      cards={winner?.cards.map(card => ({
        imageUrl: card.card.fullImageUrl,
      }))}
    />
  );*/
  return <>NBAPastWinners</>
};

export const BaseballPastWinners = ({ leaderboardSlug }: Props) => {
  /*const { data } = useUSSportsQuery<BaseballPastWinnerQuery>(
    BASEBALL_PAST_WINNER_QUERY
  );

  const lastLeaderboard =
    data?.baseballPastFixtures.nodes[0]?.leaderboards?.find(leaderboard =>
      leaderboard.slug.includes(leaderboardSlug)
    );
  if (!lastLeaderboard) return null;
  const winner = lastLeaderboard.lineups.nodes[0];

  return (
    <PastWinnerDumb
      leaderboardIconUrl={lastLeaderboard.iconImageUrl}
      leaderboardName={lastLeaderboard.displayName}
      leaderboardRarity={lastLeaderboard.leaderboardRarity}
      lineupsCount={lastLeaderboard.lineupsCount}
      winner={{
        nickname: winner?.user?.nickname,
        avatarUrl: winner?.user?.avatarUrl,
      }}
      score={winner?.score}
      cards={winner?.cards.map(card => ({
        imageUrl: card.card.fullImageUrl,
      }))}
    />
  );*/
  return <>BaseballPastWinners</>
};

const FOOTBALL_PAST_LEADERBOARD_SLUG_QUERY = gql`
  query FootballPastLeaderboardSlugQuery {
    football {
      so5 {
        so5Fixture(type: PAST) {
          slug
          displayName
          so5Leaderboards {
            slug
          }
        }
      }
    }
  }
`;

const FOOTBALL_PAST_LEADERBOARD_QUERY = gql`
  query FootballPastLeaderboardQuery($leaderboardSlug: String!) {
    football {
      so5 {
        so5Leaderboard(slug: $leaderboardSlug) {
          slug
          displayName
          svgLogoUrl
          mainRarityType
          so5LineupsCount
          so5Rankings(first: 1) {
            nodes {
              score
              ranking
              so5Lineup {
                id
              }
            }
          }
        }
      }
    }
  }
`;
const FOOTBALL_PAST_LINEUP_WINNER_QUERY = gql`
  query FootballPastLineupWinnerQuery($lineupId: ID!) {
    football {
      so5 {
        so5Lineup(id: $lineupId) {
          so5Appearances {
            card {
              slug
              assetId
              pictureUrl
            }
          }
          user {
            slug
            nickname
            profile {
              id
              pictureUrl
            }
          }
        }
      }
    }
  }
`;

export const FootballPastWinners = ({ leaderboardSlug }: Props) => {
  const { data: slugData } = useQuery<FootballPastLeaderboardSlugQuery>(
    FOOTBALL_PAST_LEADERBOARD_SLUG_QUERY
  );
  const lastLeaderboard =
    slugData?.football.so5.so5Fixture?.so5Leaderboards.find(leaderboard =>
      leaderboard.slug.includes(leaderboardSlug)
    );

  const { data: leaderboardData } = useQuery<FootballPastLeaderboardQuery>(
    FOOTBALL_PAST_LEADERBOARD_QUERY,
    {
      skip: !lastLeaderboard?.slug,
      variables: { leaderboardSlug: lastLeaderboard?.slug },
    }
  );

  const leaderboardDataSimplified =
    leaderboardData?.football.so5.so5Leaderboard;

  const lineupId =
    leaderboardDataSimplified?.so5Rankings.nodes[0]?.so5Lineup?.id;

  const { data: lineupData } = useQuery<FootballPastLineupWinnerQuery>(
    FOOTBALL_PAST_LINEUP_WINNER_QUERY,
    {
      skip: !idFromObject(lineupId),
      variables: { lineupId: idFromObject(lineupId) },
    }
  );

  const lineupDataSimplified = lineupData?.football.so5.so5Lineup;

  if (!lineupDataSimplified || !leaderboardDataSimplified) return null;
  return (
    <PastWinnerDumb
      cards={lineupDataSimplified.so5Appearances.map(card => ({
        imageUrl: card.card.pictureUrl,
      }))}
      leaderboardIconUrl={leaderboardDataSimplified.svgLogoUrl}
      leaderboardName={leaderboardDataSimplified.displayName}
      leaderboardRarity={leaderboardDataSimplified.mainRarityType}
      lineupsCount={leaderboardDataSimplified.so5LineupsCount}
      winner={{
        nickname: lineupDataSimplified.user.nickname,
        avatarUrl: lineupDataSimplified.user.profile.pictureUrl,
      }}
      score={leaderboardDataSimplified.so5Rankings.nodes[0].score}
    />
  );
};

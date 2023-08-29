import classNames from 'classnames';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { So5LeaderboardRarity } from '__generated__/globalTypes';
import { Text14 } from '@core/atoms/typography';
import { proxyUrl } from '@core/atoms/ui/ResponsiveImg';
import { PictureAvatar, PlaceHolderAvatar } from '@core/components/user/Avatar';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { Scarcity } from '@core/lib/cards';
import { laptopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

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

  @media ${tabletAndAbove} {
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

  @media ${tabletAndAbove} {
    grid-template-columns: repeat(5, minmax(70px, 1fr));
    &.sevenCards {
      grid-template-columns: repeat(7, minmax(60px, 1fr));
    }
  }

  @media ${laptopAndAbove} {
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

  @media ${tabletAndAbove} {
    font-size: 26px;
  }
  @media ${laptopAndAbove} {
    font-size: var(--t-20);
  }
`;

type PastWinnerProps = {
  leaderboardIconUrl: string;
  leaderboardName: string;
  leaderboardRarity: Scarcity | So5LeaderboardRarity | null;
  lineupsCount: number;
  winner: { nickname: string; avatarUrl: string | null };
  score: number;
  cards: {
    imageUrl: string | null;
  }[];
};

export const DumbPastWinner = ({
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
          {formatNumber(score || 0)}&nbsp;
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

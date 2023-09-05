import { TypedDocumentNode, gql } from '@apollo/client';
import { isToday } from 'date-fns';
import { FormattedDate, FormattedTime } from 'react-intl';
import styled from 'styled-components';

import { Ball } from '@sorare/core/src/atoms/icons/Ball';
import { LinkOther } from '@sorare/core/src/atoms/navigation/Box';
import { Caption } from '@sorare/core/src/atoms/typography';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import Captain from '@football/components/so5/Captain';
import { LiveDot } from '@football/components/so5/LiveDot';
import { useGetLabel as getPlayerScoreLabel } from '@football/components/stats/PlayerScore';
import {
  PlayerScoreStatus,
  getPlayerScore,
  isGameLive,
  isGameScheduled,
} from '@football/lib/so5';

import { PlayerCard_vicc5Appearance } from './__generated__/index.graphql';

const CaptainBadge = styled.aside`
  position: absolute;
  top: -6px;
  left: -4px;
  --size: 16px;
`;

const Picture = styled.div`
  position: relative;
  max-width: 100%;
  transition: transform 200ms ease-in-out;
`;

const Card = styled(LinkOther)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--half-unit);
  &:not(:disabled) {
    &:hover,
    &:focus {
      & ${Picture} {
        transform: scale(1.05);
      }
    }
  }
`;

export const CardFooter = styled.footer`
  height: var(--double-unit);
  @media ${laptopAndAbove} {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--half-unit);
    text-align: center;
  }
`;

const PlayerPicture = styled.div`
  position: relative;
  width: 100%;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlayerScore = styled(Caption)`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

const DateInfo = styled.span`
  text-transform: uppercase;
  color: var(--c-neutral-500);
`;

type Props = {
  onClick?: () => void;
  appearance: PlayerCard_vicc5Appearance;
  isLive: boolean;
};

export const PlayerCard = ({ onClick, appearance, isLive }: Props) => {
  const { vicc5Score, captain, card, bonus, id } = appearance;

  const { pictureUrl } = card || {};
  const { status, date } = vicc5Score?.game || {};
  const { score: playerScore, status: scoreStatus } = getPlayerScore(
    vicc5Score,
    bonus
  );
  const gameIsScheduled = !!status && isGameScheduled(status);
  const gameIsLive = !!status && isGameLive(status);

  const getScoreLabel = () => {
    if (scoreStatus === PlayerScoreStatus.PENDING && date) {
      return (
        <DateInfo>
          {isToday(new Date(date)) ? (
            <FormattedTime value={date} />
          ) : (
            <FormattedDate value={date} weekday="short" day="numeric" />
          )}
        </DateInfo>
      );
    }
    return getPlayerScoreLabel(
      gameIsScheduled ? null : playerScore,
      scoreStatus
    );
  };
  return (
    <Card
      key={id}
      as="button"
      onClick={onClick}
      type="button"
      disabled={!vicc5Score?.id}
    >
      <Picture>
        <PlayerPicture>
          {pictureUrl && <CardImg src={pictureUrl} alt="" width={80} />}
        </PlayerPicture>
        {captain && (
          <CaptainBadge>
            <Captain active />
          </CaptainBadge>
        )}
      </Picture>
      <CardFooter>
        <PlayerScore
          bold
          color={
            isLive && (playerScore || 0) >= 60
              ? 'var(--c-static-green-300)'
              : 'var(--c-neutral-600)'
          }
        >
          {gameIsLive && <LiveDot size="sm" animate />}
          {vicc5Score?.playerGameStats?.goals && <Ball />}
          {getScoreLabel()}
        </PlayerScore>
      </CardFooter>
    </Card>
  );
};

PlayerCard.fragments = {
  vicc5Appearance: gql`
    fragment PlayerCard_vicc5Appearance on Vicc5Appearance {
      id
      bonus
      captain
      card {
        assetId
        slug
        pictureUrl: pictureUrl(derivative: "tinified")
      }
      vicc5Score {
        id
        playerGameStats {
          id
          goals
        }
        game {
          id
          status
          date
        }

        ...getPlayerScore_vicc5Score
      }
    }
    ${getPlayerScore.fragments.vicc5Score}
  ` as TypedDocumentNode<PlayerCard_vicc5Appearance>,
};

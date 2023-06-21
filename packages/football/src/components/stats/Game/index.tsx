import { gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import { Game as CoreGame } from '@sorare/core/src/components/Game';
import { CLUB_PLACEHOLDER } from '@sorare/core/src/constants/assets';
import { flagUrl } from '@sorare/core/src/lib/territories';

import MatchViewDialog from '@football/components/stats/MatchViewDialog';
import { GameEventStatus } from '@football/lib/so5';

import { StatusRow, StatusRowProps } from './StatusRow';
import { TeamRow } from './TeamRow';
import { So5Game_game as So5Game } from './__generated__/index.graphql';

const MatchViewButon = styled.button`
  display: block;
  width: 100%;
`;

type MinimalGame = Pick<So5Game, 'date' | 'homeTeam' | 'awayTeam' | 'status'>;
type WithTeamCountry = {
  homeTeam?: { country?: { slug: string } } | null;
  awayTeam?: { country?: { slug: string } } | null;
};
type WithShortDisplayName = { so5Fixture: { shortDisplayName: string } | null };
type WithCompetition = { competition: { displayName: string } | null };
type GameType = MinimalGame &
  Partial<So5Game> &
  Partial<WithTeamCountry> &
  Partial<WithShortDisplayName> &
  Partial<WithCompetition>;

function teamLogo(team: GameType['homeTeam'] | GameType['awayTeam']): string {
  return (
    team?.pictureUrl ||
    (team?.country &&
      flagUrl({
        country: team?.country,
        type: 'round',
      })) ||
    CLUB_PLACEHOLDER
  );
}

type Props = {
  game: GameType;
  cardScore?: StatusRowProps['cardScore'];
  withPopover?: boolean;
  className?: string;
  withMatchView?: boolean;
  withDate?: boolean;
};
export const Game = ({
  game,
  cardScore,
  className,
  withMatchView,
  withDate,
}: Props) => {
  const [openMatchView, setOpenMatchView] = useState<boolean>(false);
  const {
    id = '',
    date,
    minute,
    homeTeam,
    awayTeam,
    status,
    winner,
    penaltyScoreHome,
    penaltyScoreAway,
  } = game;

  const homeGoals = game.homeGoals ?? 0;
  const awayGoals = game.awayGoals ?? 0;

  const Content = () => (
    <CoreGame
      id={id}
      StatusRow={
        <StatusRow
          date={date}
          so5Fixture={game.so5Fixture}
          competitionName={game.competition?.displayName}
          status={status as GameEventStatus}
          minute={minute}
          cardScore={cardScore}
          withDate={withDate}
        />
      }
      FirstTeamRow={
        <TeamRow
          score={homeGoals}
          lost={winner?.slug === awayTeam?.slug}
          name={homeTeam?.name || ''}
          code={homeTeam?.code || ''}
          pictureUrl={teamLogo(homeTeam)}
          status={status as GameEventStatus}
          penaltiesScore={penaltyScoreHome}
          otherPenaltiesScore={penaltyScoreAway}
        />
      }
      SecondTeamRow={
        <TeamRow
          score={awayGoals}
          lost={winner?.slug === homeTeam?.slug}
          name={awayTeam?.name || ''}
          code={awayTeam?.code || ''}
          pictureUrl={teamLogo(awayTeam)}
          status={status as GameEventStatus}
          penaltiesScore={penaltyScoreAway}
          otherPenaltiesScore={penaltyScoreHome}
        />
      }
      className={className}
    />
  );

  const matchLiveOrPlayed = [
    GameEventStatus.PLAYED,
    GameEventStatus.PLAYING,
  ].includes(status as GameEventStatus);
  if (withMatchView && matchLiveOrPlayed) {
    return (
      <>
        <MatchViewButon type="button" onClick={() => setOpenMatchView(true)}>
          <Content />
        </MatchViewButon>
        <MatchViewDialog
          open={openMatchView}
          onClose={() => setOpenMatchView(false)}
          gameId={game.id}
        />
      </>
    );
  }

  return <Content />;
};

Game.fragments = {
  game: gql`
    fragment So5Game_game on Game {
      id
      date
      minute
      status
      awayGoals
      homeGoals
      winner {
        ... on TeamInterface {
          slug
        }
      }
      awayTeam {
        ... on TeamInterface {
          slug
          code
          name
          pictureUrl: pictureUrl(derivative: "avatar")
        }
      }
      homeTeam {
        ... on TeamInterface {
          slug
          code
          name
          pictureUrl: pictureUrl(derivative: "avatar")
        }
      }
      penaltyScoreHome
      penaltyScoreAway
    }
  `,
  gameWeek: gql`
    fragment So5Game_gameWeek on Game {
      so5Fixture {
        slug
        shortDisplayName
      }
    }
  `,
  competitionName: gql`
    fragment So5Game_competitionName on Game {
      competition {
        slug
        displayName
      }
    }
  `,
  teamCountry: gql`
    fragment So5Game_teamCountry on Game {
      awayTeam {
        ... on TeamInterface {
          slug
          country {
            slug
          }
        }
      }
      homeTeam {
        ... on TeamInterface {
          slug
          country {
            slug
          }
        }
      }
    }
  `,
};

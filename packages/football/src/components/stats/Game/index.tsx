import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import { Game as CoreGame } from '@sorare/core/src/components/Game';
import { CLUB_PLACEHOLDER } from '@sorare/core/src/constants/assets';
import { flagUrl } from '@sorare/core/src/lib/territories';

import MatchViewDialog from '@football/components/stats/MatchViewDialog';
import { GameEventStatus } from '@football/lib/so5';

import { StatusRow, StatusRowProps } from './StatusRow';
import { TeamRow } from './TeamRow';
import {
  Vicc5Game_game as Vicc5Game,
  Vicc5Game_competitionName,
  Vicc5Game_gameWeek,
  Vicc5Game_teamCountry,
} from './__generated__/index.graphql';

const MatchViewButon = styled.button`
  display: block;
  width: 100%;
`;

type MinimalGame = Pick<Vicc5Game, 'date' | 'homeTeam' | 'awayTeam' | 'status'>;
type WithTeamCountry = {
  homeTeam?: { country?: { slug: string } } | null;
  awayTeam?: { country?: { slug: string } } | null;
};
type WithShortDisplayName = { vicc5Fixture: { shortDisplayName: string } | null };
type WithCompetition = { competition: { displayName: string } | null };
type GameType = MinimalGame &
  Partial<Vicc5Game> &
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

  const homeGoals = 0;//game.homeGoals ?? 0;
  const awayGoals = 0;//game.awayGoals ?? 0;

  const Content = () => (
    <CoreGame
      id={id}
      StatusRow={
        <StatusRow
          date={date}
          vicc5Fixture={game.vicc5Fixture}
          competitionName={game.competition?.displayName}
          status={status as any as GameEventStatus}
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
          status={status as any as GameEventStatus}
          penaltiesScore={penaltyScoreHome}
          otherPenaltiesScore={penaltyScoreAway}
        />
      }
      SecondTeamRow={
        <TeamRow
          score={0}
          lost={winner?.slug === homeTeam?.slug}
          name={awayTeam?.name || ''}
          code={awayTeam?.code || ''}
          pictureUrl={teamLogo(awayTeam)}
          status={status as any as GameEventStatus}
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
  ].includes(status as any as GameEventStatus);
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
    fragment Vicc5Game_game on Game {
      id
      date
      minute
      status
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
  ` as TypedDocumentNode<Vicc5Game>,
  gameWeek: gql`
    fragment Vicc5Game_gameWeek on Game {
      vicc5Fixture {
        slug
        shortDisplayName
      }
    }
  ` as TypedDocumentNode<Vicc5Game_gameWeek>,
  competitionName: gql`
    fragment Vicc5Game_competitionName on Game {
      competition {
        slug
        displayName
      }
    }
  ` as TypedDocumentNode<Vicc5Game_competitionName>,
  teamCountry: gql`
    fragment Vicc5Game_teamCountry on Game {
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
  ` as TypedDocumentNode<Vicc5Game_teamCountry>,
};

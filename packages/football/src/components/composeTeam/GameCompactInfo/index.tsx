import { gql } from '@apollo/client';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Caption, Text14, Text18 } from '@sorare/core/src/atoms/typography';

import TeamAvatar from '@football/components/club/TeamAvatar';
import { NoGameLabel } from '@football/components/stats/PlayingLabel';
import { isGameCancelled } from '@football/lib/so5';

import { GameCompactInfo_game } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: var(--half-unit);
`;

const TooltipGameDetailsWrapper = styled.div`
  display: grid;
  grid-template-areas:
    'homeAvatar time awayAvatar'
    'homeName date awayName';
  grid-template-columns: 1fr min-content 1fr;
  gap: var(--unit);
  justify-items: center;
  align-items: center;
`;

const MultipleGameWeeksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--intermediate-unit);
`;

const MultipleGameWeeksTitles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid var(--c-neutral-800);
  padding-bottom: var(--intermediate-unit);
`;

const HomeAvatar = styled.div`
  grid-area: homeAvatar;
`;

const AwayAvatar = styled.div`
  grid-area: awayAvatar;
`;

const HomeName = styled(Caption)`
  grid-area: homeName;
`;

const AwayName = styled(Caption)`
  grid-area: awayName;
`;

const Date = styled(Caption)`
  grid-area: date;
  white-space: nowrap;
`;

const Time = styled(Text18)`
  grid-area: time;
  white-space: nowrap;
`;

const getTeamColor = (
  team: GameCompactInfo_game['homeTeam'] | GameCompactInfo_game['awayTeam'],
  playerTeamSlug?: string
) =>
  team?.slug === playerTeamSlug
    ? 'var(--c-neutral-1000)'
    : 'var(--c-neutral-500)';

const TooltipGameDetails = ({
  game,
}: {
  game: GameCompactInfo_game;
  playerTeamSlug?: string;
}) => {
  const { homeTeam, date, awayTeam } = game;
  return (
    <TooltipGameDetailsWrapper>
      <HomeAvatar>
        <TeamAvatar team={homeTeam} size={32} />
      </HomeAvatar>
      <Time bold>
        <FormattedTime value={date} hour="numeric" minute="numeric" />
      </Time>
      <AwayAvatar>
        <TeamAvatar team={awayTeam} size={32} />
      </AwayAvatar>

      <HomeName color="var(--c-neutral-500)">{homeTeam?.name}</HomeName>
      <Date>
        <FormattedDate value={date} month="short" day="numeric" />
      </Date>
      <AwayName color="var(--c-neutral-500)">{awayTeam?.name}</AwayName>
    </TooltipGameDetailsWrapper>
  );
};

type Props = {
  games: GameCompactInfo_game[];
  playerTeamSlug?: string;
};

export const GameCompactInfo = ({ games, playerTeamSlug }: Props) => {
  const playingGames = games?.filter(game => !isGameCancelled(game.status));

  if (!playingGames.length)
    return (
      <Wrapper>
        <Caption color="var(--c-neutral-500)">
          <NoGameLabel />
        </Caption>
      </Wrapper>
    );

  if (playingGames.length === 1) {
    const { homeTeam, awayTeam } = playingGames[0];

    return (
      <Tooltip
        title={
          <TooltipGameDetails
            game={playingGames[0]}
            playerTeamSlug={playerTeamSlug}
          />
        }
      >
        <Wrapper>
          <Caption color={getTeamColor(homeTeam, playerTeamSlug)}>
            {homeTeam?.code}
          </Caption>
          <TeamAvatar team={homeTeam} size={16} />
          <Caption color="var(--c-neutral-500)">-</Caption>
          <TeamAvatar team={awayTeam} size={16} />
          <Caption color={getTeamColor(awayTeam, playerTeamSlug)}>
            {awayTeam?.code}
          </Caption>
        </Wrapper>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      enterTouchDelay={0}
      leaveTouchDelay={6000}
      title={
        <MultipleGameWeeksWrapper>
          <MultipleGameWeeksTitles>
            <Text14>
              <FormattedMessage
                id="GameCompactInfo.doubleGameWeek"
                defaultMessage="Double gameweek"
              />
            </Text14>
            <Caption color="var(--c-neutral-500)">
              <FormattedMessage
                id="GameCompactInfo.takeHighestScore"
                defaultMessage="The players take the highest score"
              />
            </Caption>
          </MultipleGameWeeksTitles>
          {playingGames.map(game => (
            <TooltipGameDetails key={game.id} game={game} />
          ))}
        </MultipleGameWeeksWrapper>
      }
    >
      <Wrapper>
        <Button color="white" compact component="div">
          <FormattedMessage
            id="GameCompactInfo.multipleGames"
            defaultMessage="{nb} games"
            values={{ nb: games.length }}
          />
        </Button>
      </Wrapper>
    </Tooltip>
  );
};

GameCompactInfo.fragments = {
  game: gql`
    fragment GameCompactInfo_game on Game {
      id
      status
      date
      homeTeam {
        ... on TeamInterface {
          slug
          name
          code
          ...TeamAvatar_team
        }
      }
      awayTeam {
        ... on TeamInterface {
          slug
          name
          code
          ...TeamAvatar_team
        }
      }
    }
    ${TeamAvatar.fragments.team}
  `,
};

export default GameCompactInfo;

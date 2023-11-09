import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import { ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Caption, Title2, button12 } from '@sorare/core/src/atoms/typography';
import { Chip } from '@sorare/core/src/atoms/ui/Chip';
import { LiveIndicator } from '@sorare/core/src/atoms/ui/LiveIndicator';
import { useIntlContext } from '@sorare/core/src/contexts/intl';

import { SelectedTeam } from '@football/components/MatchView/types';
import { GameEventStatus, gameStatusMessages } from '@football/lib/so5';

import { Overview_game } from './__generated__/index.graphql';

const Root = styled.div`
  display: grid;
  grid-template-areas:
    'game_name game_name game_status'
    'home_flag home_name home_score'
    'away_flag away_name away_score';
  grid-template-columns: min-content 1fr min-content;
  align-items: center;
  justify-content: center;
  padding: var(--double-unit);
  column-gap: var(--double-unit);
  row-gap: var(--unit);
  width: 100%;

  &.desktop {
    grid-template-areas: 'game_name home_name home_flag home_score dash away_score away_flag away_name game_status';
    grid-template-columns: 200px 1fr min-content repeat(3, 18px) min-content 1fr 200px;
    justify-items: center;
    & > :first-child {
      justify-self: start;
    }
    & > :nth-child(2) {
      justify-self: end;
    }
    & > :nth-child(8) {
      justify-self: start;
    }
    & > :last-child {
      justify-self: end;
    }
  }
`;
const Block = styled.div`
  display: flex;
  align-items: center;
  color: var(--c-neutral-1000);
  &.grey {
    color: var(--c-neutral-600);
  }
`;
const FlexContainer = styled(Block)`
  gap: var(--unit);
`;
const FlexColContainer = styled(Block)`
  flex-direction: row;
  align-items: flex-start;
  gap: var(--unit);
  &.desktop {
    flex-direction: column;
    gap: 0;
  }
`;
const GreyCaption = styled(Caption)`
  color: var(--c-neutral-600);
`;
const TeamImage = styled.img`
  height: 16px;
  border-radius: 2px;
`;
const Dash = styled.div`
  grid-area: dash;
  display: none;
  text-align: center;
  &.desktop {
    display: block;
  }
`;
const BaseIcon = styled.div`
  ${button12};
`;
const GameName = styled(Block)`
  grid-area: game_name;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font: var(--t-12);
`;
const GameStatus = styled(Block)`
  grid-area: game_status;
  display: flex;
  gap: var(--unit);
`;
const AwayName = styled(Block)`
  grid-area: away_name;
  text-align: left;
`;
const HomeName = styled(Block)`
  grid-area: home_name;
`;
const AwayFlag = styled(Block)`
  grid-area: away_flag;
`;
const HomeFlag = styled(Block)`
  grid-area: home_flag;
`;
const HomeScore = styled(Block)`
  grid-area: home_score;
`;
const AwayScore = styled(Block)`
  grid-area: away_score;
`;
const Score = styled(Title2)`
  font-size: 18px;
  line-height: 18px;
  width: 100%;
  text-align: right;
`;

const normalCaseStatuses = [GameEventStatus.PLAYING, GameEventStatus.PLAYED];

const specialCaseStatuses = [
  GameEventStatus.SUSPENDED,
  GameEventStatus.POSTPONED,
  GameEventStatus.CANCELLED,
];

enum MatchStatuses {
  WIN,
  LOSE,
  DRAW,
}
const getMatchStatus = (
  isPlaying: boolean,
  game: Overview_game,
  selectedTeam: SelectedTeam
): MatchStatuses => {
  //TODO
  /*const { winner, homeTeam, awayTeam, awayGoals } = game;

  if (isPlaying) {
    if (homeGoals > (awayGoals || 0)) {
      return selectedTeam === SelectedTeam.HOME
        ? MatchStatuses.WIN
        : MatchStatuses.LOSE;
    }
    if ((awayGoals || 0) > homeGoals) {
      return selectedTeam === SelectedTeam.AWAY
        ? MatchStatuses.WIN
        : MatchStatuses.LOSE;
    }
    return MatchStatuses.DRAW;
  }
  if (winner) {
    if (winner.slug === homeTeam?.slug) {
      return selectedTeam === SelectedTeam.HOME
        ? MatchStatuses.WIN
        : MatchStatuses.LOSE;
    }
    if (winner.slug === awayTeam?.slug) {
      return selectedTeam === SelectedTeam.AWAY
        ? MatchStatuses.WIN
        : MatchStatuses.LOSE;
    }
  }*/
  return MatchStatuses.DRAW;
};

type Props = {
  game: Overview_game;
  selectedTeam: SelectedTeam;
  desktop?: boolean;
};
const Overview = ({ game, selectedTeam, desktop }: Props) => {
  const { formatMessage } = useIntl();
  const { formatDate } = useIntlContext();
  const { date, homeTeam, awayTeam, status, vicc5Fixture } = game;

  const isPlaying = status === GameEventStatus.PLAYING as any; //TODO
  const isNormalCase = normalCaseStatuses.includes(status as any as GameEventStatus);
  const isSpecialCase = specialCaseStatuses.includes(status as any as GameEventStatus);
  const isUpcoming = status === GameEventStatus.SCHEDULED as any;

  const fullDate = formatDate(date, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const gameDate = formatDate(date, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const matchStatus = getMatchStatus(isPlaying, game, selectedTeam);

  let ScoreIcon: {
    custom: { background: string; color: string };
    content: ReactNode;
  } | null = null;
  if (matchStatus === MatchStatuses.DRAW) {
    ScoreIcon = {
      custom: {
        background: 'var(--c-neutral-600)',
        color: 'var(--c-neutral-100)',
      },
      content: (
        <FormattedMessage id="MatchView.Overview.Draw" defaultMessage="D" />
      ),
    };
  } else if (matchStatus === MatchStatuses.WIN) {
    ScoreIcon = {
      custom: {
        background: 'var(--c-green-600)',
        color: 'var(--c-neutral-100)',
      },
      content: (
        <FormattedMessage id="MatchView.Overview.Win" defaultMessage="W" />
      ),
    };
  } else if (matchStatus === MatchStatuses.LOSE) {
    ScoreIcon = {
      custom: {
        background: 'var(--c-red-600)',
        color: 'var(--c-neutral-100)',
      },
      content: (
        <FormattedMessage id="MatchView.Overview.Lose" defaultMessage="L" />
      ),
    };
  }

  return (
    <Root className={classnames({ desktop })}>
      <GameName>
        {(isNormalCase || isUpcoming) && (
          <FlexColContainer className={classnames({ desktop })}>
            <Tooltip title={fullDate}>
              <FlexContainer>
                {isPlaying ? (
                  <>
                    <LiveIndicator /> <strong>{game.minute}&lsquo;</strong>
                  </>
                ) : (
                  <>
                    <span>
                      {isUpcoming
                        ? gameDate
                        : formatMessage(gameStatusMessages[status])}
                    </span>
                    {vicc5Fixture && (
                      <>
                        <span>-</span>
                        <span>{vicc5Fixture.shortDisplayName}</span>
                      </>
                    )}
                  </>
                )}
              </FlexContainer>
            </Tooltip>
            <GreyCaption>{game.competition?.displayName}</GreyCaption>
          </FlexColContainer>
        )}
      </GameName>
      {homeTeam && (
        <>
          <HomeName
            className={classnames({ grey: selectedTeam === SelectedTeam.AWAY })}
          >
            {homeTeam.name}
          </HomeName>
          <HomeFlag>
            <TeamImage src={homeTeam.pictureUrl || ''} />
          </HomeFlag>
          <HomeScore
            className={classnames({ grey: selectedTeam === SelectedTeam.AWAY })}
          >
            <Score>{isNormalCase ? 0 : '-'}</Score>
          </HomeScore>
        </>
      )}

      <Dash className={classnames({ desktop })}>{isNormalCase && '-'}</Dash>

      {awayTeam && (
        <>
          <AwayScore
            className={classnames({ grey: selectedTeam === SelectedTeam.HOME })}
          >
            <Score>{isNormalCase ? 0 : '-'}</Score>
          </AwayScore>
          <AwayFlag>
            <TeamImage src={awayTeam.pictureUrl || ''} />
          </AwayFlag>
          <AwayName
            className={classnames({ grey: selectedTeam === SelectedTeam.HOME })}
          >
            {awayTeam.name}
          </AwayName>
        </>
      )}

      <GameStatus>
        {isSpecialCase ? (
          <Chip
            size="smaller"
            color="red"
            outlined
            label={formatMessage(gameStatusMessages[status])}
          />
        ) : (
          !isUpcoming && (
            <Chip
              size="smaller"
              custom={ScoreIcon?.custom}
              label={Label => (
                <Label>
                  <BaseIcon>{ScoreIcon?.content}</BaseIcon>
                </Label>
              )}
            />
          )
        )}
      </GameStatus>
    </Root>
  );
};

Overview.fragments = {
  game: gql`
    fragment Overview_game on Game {
      id
      date
      # minute
      status
      winner {
        ... on TeamInterface {
          slug
        }
      }
      awayTeam {
        ... on TeamInterface {
          slug
          name
          pictureUrl(derivative: "avatar")
        }
      }
      homeTeam {
        ... on TeamInterface {
          slug
          name
          pictureUrl(derivative: "avatar")
        }
      }
      vicc5Fixture {
        slug
        shortDisplayName
      }
      competition {
        slug
        displayName
      }
    }
  ` as TypedDocumentNode<Overview_game>,
};

export default Overview;

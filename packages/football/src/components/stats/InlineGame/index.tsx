import { TypedDocumentNode, gql } from '@apollo/client';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { glossary } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { InlineGame_game } from './__generated__/index.graphql';

interface Props {
  game: InlineGame_game | null;
  team: { slug: string };
}

const Game = styled.div`
  display: flex;
  align-items: center;
  color: var(--c-neutral-600);
  gap: var(--half-unit);
  @media ${tabletAndAbove} {
    gap: var(--unit);
  }
`;
const TeamCode = styled.span`
  &.highlighted {
    color: var(--c-neutral-800);
  }
`;
const TeamLogo = styled.img`
  width: 20px;
  border-radius: var(--half-unit);
`;

export const InlineGame = ({ game, team }: Props) => {
  return (
    <>
      {game ? (
        <Game>
          <TeamCode
            className={classNames({
              highlighted: game?.homeTeam?.slug === team.slug,
            })}
          >
            {game?.homeTeam?.code}
          </TeamCode>
          {game?.homeTeam?.pictureUrl && (
            <TeamLogo src={game?.homeTeam.pictureUrl} alt="" />
          )}
          {' - '}
          {game?.awayTeam?.pictureUrl && (
            <TeamLogo src={game?.awayTeam.pictureUrl} alt="" />
          )}
          <TeamCode
            className={classNames({
              highlighted: game?.awayTeam?.slug === team.slug,
            })}
          >
            {game?.awayTeam?.code}
          </TeamCode>
        </Game>
      ) : (
        <FormattedMessage {...glossary.noGame} />
      )}
    </>
  );
};

InlineGame.fragments = {
  game: gql`
    fragment InlineGame_game on Game {
      id
      date
      awayTeam {
        ... on TeamInterface {
          slug
          code
          pictureUrl
        }
      }
      homeTeam {
        ... on TeamInterface {
          slug
          code
          pictureUrl
        }
      }
    }
  ` as TypedDocumentNode<InlineGame_game>,
};

export default InlineGame;

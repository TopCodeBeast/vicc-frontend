import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import Blockquote from '@sorare/core/src/atoms/layout/Blockquote';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_PLAYER_SHOW } from '@sorare/core/src/constants/routes';

import PlayerAvatar from '@football/components/player/PlayerAvatar';
import RepresentedPlayerAvatar from '@football/components/player/RepresentedPlayerAvatar';
import AppearanceDetails from '@football/components/so5/AppearanceDetails';
import PlayerScore from '@football/components/stats/PlayerScore';
import ScoreFrom from '@football/components/stats/ScoreFrom';
import { getPlayerScore } from '@football/lib/so5';

import {
  PlayerGameScorePage_player,
  PlayerGameScorePage_representativePlayer,
  PlayerGameScorePage_so5Score,
} from './__generated__/index.graphql';

type SharedPlayerProps = {
  player: PlayerGameScorePage_player;
};

type SharedProps = SharedPlayerProps & {
  so5Score?: PlayerGameScorePage_so5Score;
  team: string;
};

type IRLPlayerProps = SharedPlayerProps & {
  representativePlayer?: never;
};

type VirtualPlayerProps = SharedPlayerProps & {
  representativePlayer: PlayerGameScorePage_representativePlayer;
};

type Props = IRLPlayerProps | VirtualPlayerProps;

const isVirtualPlayerProps = (
  player: Props['player'],
  representativePlayer: Props['representativePlayer']
): representativePlayer is VirtualPlayerProps['representativePlayer'] =>
  !!representativePlayer && representativePlayer.slug !== player.slug;

const SharedPlayerBlock = ({
  player,
  team,
}: {
  player: {
    slug: string;
    displayName: string;
  };
  team: string;
}) => {
  return (
    <div>
      <Link to={generatePath(FOOTBALL_PLAYER_SHOW, { slug: player.slug })}>
        <Text16 bold>{player.displayName}</Text16>
      </Link>
      <Text16 color="var(--c-neutral-600)">{team}</Text16>
    </div>
  );
};

type PlayerBlockProps = {
  team: string;
  player: PlayerGameScorePage_player;
  children: React.ReactNode;
  representativePlayer?: PlayerGameScorePage_representativePlayer;
};

const Root = styled(Container)`
  display: grid;
  row-gap: var(--triple-unit);
  padding: var(--triple-unit) 0;
`;
const VirtualBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Player = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const Avatar = styled(PlayerAvatar)`
  height: 80px;
  width: 80px;
`;

const PlayerBlock = ({
  player,
  representativePlayer,
  team,
  children,
}: PlayerBlockProps) => {
  const isRepresented = isVirtualPlayerProps(player, representativePlayer);
  return (
    <VirtualBlock>
      <Header>
        <Player>
          {isRepresented ? (
            <RepresentedPlayerAvatar
              player={player}
              representativePlayer={representativePlayer}
            />
          ) : (
            <Avatar player={player} />
          )}
          <SharedPlayerBlock player={player} team={team} />
        </Player>
        {children}
      </Header>
      {isRepresented ? <ScoreFrom player={representativePlayer} /> : null}
    </VirtualBlock>
  );
};

const ScoreBlock = ({
  so5Score,
}: {
  so5Score?: PlayerGameScorePage_so5Score;
}) => {
  const { score, status } = getPlayerScore(so5Score);

  return <PlayerScore score={score} status={status} showReviewing />;
};

const PlayerGameScorePage = ({
  so5Score,
  team,
  ...otherProps
}: Props & SharedProps) => {
  return (
    <Root>
      <PlayerBlock {...otherProps} team={team}>
        <ScoreBlock so5Score={so5Score} />
      </PlayerBlock>
      {so5Score ? (
        <AppearanceDetails so5Score={so5Score} withDetails />
      ) : (
        <Blockquote>
          <FormattedMessage
            id="PlayerGameScorePage.noGame"
            defaultMessage="No game"
          />
        </Blockquote>
      )}
    </Root>
  );
};

PlayerGameScorePage.fragments = {
  so5Score: gql`
    fragment PlayerGameScorePage_so5Score on So5Score {
      id
      ...AppearanceDetails_so5Score
      ...getPlayerScore_so5Score
    }
    ${AppearanceDetails.fragments.so5Score}
    ${getPlayerScore.fragments.so5Score}
  `,
  player: gql`
    fragment PlayerGameScorePage_player on Player {
      slug
      ...PlayerAvatar_player
      ...RepresentedPlayerAvatar_player
    }
    ${PlayerAvatar.fragments.player}
    ${RepresentedPlayerAvatar.fragments.player}
  `,
  representativePlayer: gql`
    fragment PlayerGameScorePage_representativePlayer on Player {
      slug
      ...RepresentedPlayerAvatar_representativePlayer
    }
    ${RepresentedPlayerAvatar.fragments.representativePlayer}
  `,
};

export default PlayerGameScorePage;

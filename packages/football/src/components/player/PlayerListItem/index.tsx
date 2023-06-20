import { gql } from '@apollo/client';
import { ReactElement } from 'react';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Block from '@sorare/core/src/atoms/layout/Block';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_PLAYER_SHOW } from '@sorare/core/src/constants/routes';

import PlayerAvatar from '@sorare/football/src/components/player/PlayerAvatar';

import { PlayerListItem_player } from './__generated__/index.graphql';

export interface Props {
  player: PlayerListItem_player;
  subtitle?: string;
  children?: ReactElement;
}

const Root = styled(Block)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
`;
const Avatar = styled(PlayerAvatar)`
  height: 60px;
  width: 60px;
`;
const Text = styled.div`
  margin-left: 20px;
`;

export const PlayerListItem = ({ player, subtitle, children }: Props) => {
  const { slug, displayName } = player;

  return (
    <Root
      to={generatePath(FOOTBALL_PLAYER_SHOW, {
        slug,
      })}
    >
      <Left>
        <Avatar contained player={player} />
        <Text>
          <Text16 bold>{displayName}</Text16>
          <Text16 color="var(--c-neutral-600)">{subtitle}</Text16>
        </Text>
      </Left>
      <div>{children}</div>
    </Root>
  );
};

PlayerListItem.fragments = {
  player: gql`
    fragment PlayerListItem_player on Player {
      slug
      displayName
      ...PlayerAvatar_player
    }
    ${PlayerAvatar.fragments.player}
  `,
};

export default PlayerListItem;

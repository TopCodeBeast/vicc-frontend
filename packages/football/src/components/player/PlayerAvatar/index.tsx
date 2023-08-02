import { TypedDocumentNode, gql } from '@apollo/client';

import DumbPlayerAvatar from '@sorare/core/src/components/player/DumbPlayerAvatar';

import { FootballPlayerAvatar_player } from './__generated__/index.graphql';

interface Props {
  player: FootballPlayerAvatar_player;
  contained?: boolean;
  className?: string;
}

export const PlayerAvatar = ({ player, className }: Props) => {
  return (
    <DumbPlayerAvatar
      name={player.displayName}
      avatarUrl={player.avatarPictureUrl}
      className={className}
    />
  );
};

PlayerAvatar.fragments = {
  player: gql`
    fragment FootballPlayerAvatar_player on Player {
      slug
      displayName
      avatarPictureUrl: pictureUrl(derivative: "avatar")
    }
  ` as TypedDocumentNode<FootballPlayerAvatar_player>,
};

export default PlayerAvatar;

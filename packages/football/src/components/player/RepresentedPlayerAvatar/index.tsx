import { gql } from '@apollo/client';
import styled from 'styled-components';

import DumbPlayerAvatar from '@sorare/core/src/components/player/DumbPlayerAvatar';

type Props = {
  player: {
    displayName: string;
    squaredPictureUrl: string | null;
  };
  representativePlayer: {
    displayName: string;
    avatarPictureUrl: string | null;
  };
};

const Root = styled.div`
  height: 80px;
  width: 80px;
`;
const Represented = styled(DumbPlayerAvatar)`
  height: 80px;
  width: 80px;
`;
const As = styled(DumbPlayerAvatar)`
  z-index: 2;
  position: relative;
  border-color: var(--c-neutral-100);
  height: 40px;
  width: 40px;
  top: -36px;
  left: 43px;
`;

const RepresentedPlayerAvatar = ({ player, representativePlayer }: Props) => {
  const { displayName, squaredPictureUrl } = player;
  const {
    displayName: representingPlayerName,
    avatarPictureUrl: representingPictureUrl,
  } = representativePlayer;

  return (
    <Root>
      <Represented name={displayName} avatarUrl={squaredPictureUrl} />
      <As
        name={representingPlayerName}
        avatarUrl={representingPictureUrl}
        variant="medallion"
      />
    </Root>
  );
};

RepresentedPlayerAvatar.fragments = {
  player: gql`
    fragment RepresentedPlayerAvatar_player on Player {
      slug
      displayName
      squaredPictureUrl: pictureUrl(derivative: "squared")
    }
  `,
  representativePlayer: gql`
    fragment RepresentedPlayerAvatar_representativePlayer on Player {
      slug
      displayName
      avatarPictureUrl: pictureUrl(derivative: "avatar")
    }
  `,
};

export default RepresentedPlayerAvatar;

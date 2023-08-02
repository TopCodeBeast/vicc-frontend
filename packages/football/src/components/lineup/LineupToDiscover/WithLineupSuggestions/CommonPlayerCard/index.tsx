import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { CardImg } from '@sorare/core/src/components/card/CardImg';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';

import { CommonPlayerCard_draftablePlayer } from './__generated__/index.graphql';

const Img = styled(CardImg)`
  width: 100%;
  aspect-ratio: var(--card-aspect-ratio);
  object-fit: contain;
  opacity: 0.5;
`;

type Props = {
  draftablePlayer: CommonPlayerCard_draftablePlayer | undefined;
};

export const CommonPlayerCard = ({ draftablePlayer }: Props) => {
  const { pictureUrl } = draftablePlayer || {};

  return (
    <div>
      <Img
        src={pictureUrl || `${FRONTEND_ASSET_HOST}/cards/back/common.svg`}
        alt=""
        width={80}
      />
    </div>
  );
};

CommonPlayerCard.fragments = {
  draftablePlayer: gql`
    fragment CommonPlayerCard_draftablePlayer on DraftablePlayer {
      id
      pictureUrl
    }
  ` as TypedDocumentNode<CommonPlayerCard_draftablePlayer>,
};

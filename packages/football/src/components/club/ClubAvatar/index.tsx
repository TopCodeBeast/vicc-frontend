import { TypedDocumentNode, gql } from '@apollo/client';
import { ComponentProps } from 'react';

import DumbClubAvatar from '@sorare/core/src/components/club/DumbClubAvatar';

import { ClubAvatar_club } from './__generated__/index.graphql';

type Props = Pick<
  ComponentProps<typeof DumbClubAvatar>,
  'withTooltip' | 'size'
> & {
  club: ClubAvatar_club;
  className?: string;
};

export const ClubAvatar = (props: Props) => {
  return <DumbClubAvatar {...props} />;
};

ClubAvatar.fragments = {
  club: gql`
    fragment ClubAvatar_club on Club {
      slug
      name
      avatarUrl: pictureUrl(derivative: "avatar")
    }
  ` as TypedDocumentNode<ClubAvatar_club>,
};

export default ClubAvatar;

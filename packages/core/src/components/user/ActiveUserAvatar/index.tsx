import { gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import Dialog from '@core/components/dialog';
import UpdateProfile from '@core/components/settings/UpdateProfile';
import ActivityIndicator from '@core/components/user/ActivityIndicator';
import Avatar from '@core/components/user/Avatar';
import { useCurrentUserContext } from '@core/contexts/currentUser';

import { ActiveUserAvatar_user } from './__generated__/index.graphql';

export interface Props {
  user: ActiveUserAvatar_user;
  variant: 'extraSmall' | 'small' | 'medium' | 'large';
  placeholderUrl?: string;
}

const UpdateProfileWrapper = styled.div`
  height: 100%;
  padding: 0 var(--triple-unit) var(--triple-unit);
`;

const extraSmallActivityIndicatorStyle = {
  '--radius': '3px',
  '--offset-right': '2px',
  '--offset-bottom': '4px',
  '--gap': '1px',
} as React.CSSProperties;

const ActiveUserAvatar = ({ user, variant, placeholderUrl }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const [openUpdatingPicture, setOpenUpdatingPicture] = useState(false);

  const otherUser = currentUser?.slug !== user.slug;

  // disable edit mode on those extraSmall avatars
  const withoutEdit = variant === 'extraSmall';

  // only support touch delay when we're not opening the edit modal
  const enterTouchDelay = withoutEdit || otherUser ? 0 : undefined;

  const avatar = (
    <ActivityIndicator
      user={user}
      enterTouchDelay={enterTouchDelay}
      style={
        variant === 'extraSmall' ? extraSmallActivityIndicatorStyle : undefined
      }
    >
      <Avatar user={user} variant={variant} placeholderUrl={placeholderUrl} />
    </ActivityIndicator>
  );

  if (otherUser || withoutEdit) {
    return avatar;
  }

  return (
    <>
      <button type="button" onClick={() => setOpenUpdatingPicture(true)}>
        {avatar}
      </button>
      <Dialog
        maxWidth="sm"
        open={openUpdatingPicture}
        onClose={() => setOpenUpdatingPicture(false)}
        body={
          <UpdateProfileWrapper>
            <UpdateProfile onSubmit={() => setOpenUpdatingPicture(false)} />
          </UpdateProfileWrapper>
        }
      />
    </>
  );
};

ActiveUserAvatar.fragments = {
  user: gql`
    fragment ActiveUserAvatar_user on PublicUserInfoInterface {
      slug
      ...ActivityIndicator_user
      ...Avatar_publicUserInfoInterface
    }
    ${ActivityIndicator.fragments.user}
    ${Avatar.fragments.publicUserInfoInterface}
  `,
};

export default ActiveUserAvatar;

import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import DeleteButton from '@sorare/core/src/atoms/buttons/DeleteButton';
import {
  LinkBox,
  LinkOther,
  LinkOverlay,
} from '@sorare/core/src/atoms/navigation/Box';
import { Text16 } from '@sorare/core/src/atoms/typography';
import Avatar from '@sorare/core/src/components/user/Avatar';
import { GalleryLink } from '@sorare/core/src/components/user/GalleryLink';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { MemberRow_user } from './__generated__/index.graphql';

const ClickableRow = styled(LinkBox).attrs(
  ({ $highlight }: { $highlight: boolean }) => ({
    className: $highlight ? 'highlight' : '',
  })
)<{ $highlight: boolean }>`
  padding: var(--unit);
  display: grid;
  grid: repeat(2, 1fr) / 44px 10fr 1fr;
  column-gap: var(--unit);
  align-items: center;
  width: 100%;
  grid-template-areas:
    'avatar name remove'
    'avatar joined remove';
  background-color: var(--c-neutral-300);
  border-radius: var(--double-unit);
  text-align: left;
  color: inherit;
  &:hover,
  &:focus {
    color: inherit;
    background-color: rgba(var(--c-rgb-neutral-300), 0.8);
    &.highlight {
      background-color: rgba(var(--c-rgb-brand-600), 0.35);
    }
  }
  &.highlight {
    outline: 2px solid var(--c-brand-600);
    background-color: rgba(var(--c-rgb-brand-600), 0.4);
  }
  @media ${tabletAndAbove} {
    padding: var(--double-unit);
  }
`;

const ClickableAvatarWrapper = styled(LinkOverlay)`
  grid-area: avatar;
`;

const AvatarLink = ClickableAvatarWrapper.withComponent(Link);

const SuspendedAvatar = ClickableAvatarWrapper.withComponent('span');

const NameWrapper = styled.div`
  grid-area: name;
  display: inline-flex;
  gap: var(--unit);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Joined = styled(Text16)`
  grid-area: joined;
  color: var(--c-neutral-600);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RoleWrapper = styled.div`
  grid-area: joined;
`;

const DeleteWrapper = styled(LinkOther)`
  grid-area: remove;
  justify-self: flex-end;
`;

type Props = {
  user: MemberRow_user;
  admin?: boolean;
  isAdmin?: boolean;
  isMe?: boolean;
  date?: string;
  onDeleteButtonClick?: () => void;
};

const MemberRow = ({
  user,
  admin,
  isAdmin,
  isMe,
  date,
  onDeleteButtonClick,
}: Props) => {
  return (
    <ClickableRow $highlight={!!isMe}>
      <GalleryLink
        user={user}
        Link={AvatarLink}
        WhenSuspended={SuspendedAvatar}
      >
        <Avatar user={user} variant="medium" />
      </GalleryLink>
      <NameWrapper>
        <Text16>
          <strong>
            <Nickname user={user} />
          </strong>
        </Text16>

        {isMe && (
          <Text16>
            <FormattedMessage
              id="UserGroupDetails.Members.You"
              defaultMessage="(You)"
            />
          </Text16>
        )}
      </NameWrapper>
      {admin ? (
        <RoleWrapper>
          <Text16>
            <FormattedMessage
              id="UserGroupDetails.Members.Administrator"
              defaultMessage="Administrator"
            />
          </Text16>
        </RoleWrapper>
      ) : (
        <Joined>
          <FormattedMessage
            id="UserGroupDetails.Members.Joined"
            defaultMessage="Joined {date}"
            values={{ date }}
          />
        </Joined>
      )}
      {isAdmin && !isMe && (
        <DeleteWrapper>
          <DeleteButton color="transparent" onClick={onDeleteButtonClick} />
        </DeleteWrapper>
      )}
    </ClickableRow>
  );
};

MemberRow.fragments = {
  user: gql`
    fragment MemberRow_user on User {
      slug
      id
      ...Avatar_publicUserInfoInterface
    }
    ${Avatar.fragments.publicUserInfoInterface}
  `,
};

export default MemberRow;

import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import CopyToClipboardButton from '@sorare/core/src/atoms/buttons/CopyToClipboardButton';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useEvents from '@sorare/core/src/lib/events/useEvents';

import { generateUserGroupInviteLink } from '@football/lib/so5';
import Field from '@football/pages/Lobby/Components/UserGroup/UserGroupInvitation/Field';

const Root = styled.div`
  width: 100%;
`;
const FlexContainerWithMargin = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--half-unit);
`;

type Props = {
  joinSecret: string;
  so5UserGroupId: string;
  so5LeaderboardType?: string;
};
const ShareUserGroupWithLink = ({
  joinSecret,
  so5UserGroupId,
  so5LeaderboardType,
}: Props) => {
  const { currentUser } = useCurrentUserContext();
  const track = useEvents();

  const currentUserSlug = currentUser?.slug;
  const inviteLink = useMemo(
    () =>
      generateUserGroupInviteLink(
        joinSecret,
        currentUserSlug,
        so5LeaderboardType
      ),
    [joinSecret, currentUserSlug, so5LeaderboardType]
  );

  return (
    <Root>
      <FlexContainerWithMargin>
        <FormattedMessage
          id="UserGroupDialog.Congrats.ShareUserGroupWithLink.WithLink"
          defaultMessage="With a link"
        />
        <CopyToClipboardButton
          textToCopy={inviteLink}
          alignRight
          onClick={() => {
            track('Click Copy', {
              so5UserGroupId: idFromObject(so5UserGroupId),
              type: 'link',
            });
          }}
        />
      </FlexContainerWithMargin>
      <Field
        inviteLink={inviteLink}
        onClick={() => {
          track('Click Share', {
            so5UserGroupId: idFromObject(so5UserGroupId),
          });
        }}
        so5LeaderboardType={so5LeaderboardType}
      />
    </Root>
  );
};

export default ShareUserGroupWithLink;

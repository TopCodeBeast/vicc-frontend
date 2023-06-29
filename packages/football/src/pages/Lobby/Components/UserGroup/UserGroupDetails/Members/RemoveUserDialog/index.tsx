import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import ConfirmDialog from '@sorare/core/src/components/form/ConfirmDialog';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { glossary } from '@sorare/core/src/lib/glossary';

import { GetUserGroupMembersTabQuery } from '@football/pages/Lobby/Components/UserGroup/UserGroupDetails/Members/__generated__/index.graphql';

type User =
  GetUserGroupMembersTabQuery['football']['so5']['so5UserGroup']['membershipsPaginated']['memberships'][number]['user'];

const ConfirmSubtitle = styled(Text16)`
  white-space: pre-line;
`;

type Props = {
  userToRemove: User | null;
  groupName: string;
  onConfirm: () => void;
  onClose: () => void;
};
const RemoveUserDialog = ({
  userToRemove,
  groupName,
  onConfirm,
  onClose,
}: Props) => (
  <ConfirmDialog
    open={!!userToRemove}
    onConfirm={onConfirm}
    onClose={onClose}
    title={
      <Title3 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="UserGroupDetails.Members.Remove.confirm.title"
          defaultMessage="Remove {nickname}"
          values={{
            nickname: userToRemove && <Nickname user={userToRemove} />,
          }}
        />
      </Title3>
    }
    message={
      <ConfirmSubtitle color="var(--c-neutral-600)">
        <FormattedMessage
          id="UserGroupDetails.Members.Remove.confirm.subtitle"
          defaultMessage={`Are you sure you want to remove {nickname} from {group}?\nThis action can't be undone.`}
          values={{
            nickname: userToRemove && <Nickname user={userToRemove} />,
            group: groupName,
          }}
        />
      </ConfirmSubtitle>
    }
    cta={<FormattedMessage {...glossary.remove} />}
    ctaProps={{ color: 'red' }}
  />
);

export default RemoveUserDialog;

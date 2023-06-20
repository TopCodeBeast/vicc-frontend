import { gql } from '@apollo/client';
import { useIntl } from 'react-intl';

import { So5UserGroupStatus } from '@sorare/core/src/__generated__/globalTypes';

import UserGroupsStatus from '@sorare/football/src/components/userGroup/UserGroupStatus';

import { GroupStatus_userGroup } from './__generated__/index.graphql';

type Props = { group: GroupStatus_userGroup };

export const useGroupStatusLabel = (group: GroupStatus_userGroup) => {
  const { formatMessage } = useIntl();

  const getLabel = () => {
    if (group.status === So5UserGroupStatus.ENDED) {
      return formatMessage({
        id: 'UserGroup.GroupStatusEnded',
        defaultMessage: 'League ended',
      });
    }

    if (group.status === So5UserGroupStatus.TO_START) {
      return formatMessage(
        {
          id: 'UserGroup.GroupStatusToStart',
          defaultMessage: 'Starts on GW {gw}',
        },
        {
          gw: group.startGameWeek,
        }
      );
    }
    return undefined;
  };
  return getLabel();
};

export const GroupStatus = ({ group }: Props) => {
  const label = useGroupStatusLabel(group);

  if (!label) {
    return null;
  }
  return <UserGroupsStatus status={group.status} label={label} />;
};

GroupStatus.fragments = {
  userGroup: gql`
    fragment GroupStatus_userGroup on So5UserGroup {
      slug
      startGameWeek
      status
    }
  `,
};

export default GroupStatus;

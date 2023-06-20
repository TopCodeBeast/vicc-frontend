import { So5UserGroupStatus } from '@sorare/core/src/__generated__/globalTypes';
import { Chip } from '@sorare/core/src/atoms/ui/Chip';

type Props = {
  status: So5UserGroupStatus;
  label: string;
};

const CHIP_COLORS = {
  [So5UserGroupStatus.ENDED]: 'gray',
  [So5UserGroupStatus.STARTED]: 'green',
  [So5UserGroupStatus.TO_START]: 'yellow',
} as const;

export const UserGroupsStatus = ({ status, label }: Props) => {
  const chipColor = CHIP_COLORS[status];
  if (!chipColor) {
    return null;
  }
  return <Chip label={label} size="smaller" color={chipColor} />;
};

export default UserGroupsStatus;

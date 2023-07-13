import { CSSProperties } from 'react';
import styled from 'styled-components';

import blazon from '@core/assets/club/blazon_none.png';
import Tooltip from '@core/atoms/tooltip/Tooltip';
import ContainedAvatar from '@core/atoms/ui/ContainedAvatar';
import { CLUB_PLACEHOLDER } from '@core/constants/assets';

type Props = {
  club: {
    slug: string;
    name?: string;
    avatarUrl?: string | null;
  };
  withTooltip?: boolean;
  className?: string;
  size?: number;
};

const Root = styled(ContainedAvatar)`
  border-radius: 0;
  width: var(--size, calc(var(--unit) * 5));
  height: var(--size, calc(var(--unit) * 5));
`;

export const DumbClubAvatar = (props: Props) => {
  const { club, withTooltip = false, className, size } = props;

  const avatar = (
    <Root
      className={className}
      alt={club.name}
      src={club.avatarUrl || blazon}
      onError={e => {
        (e.target as any).src = CLUB_PLACEHOLDER;
      }}
      style={size ? ({ '--size': `${size}px` } as CSSProperties) : undefined}
    />
  );

  if (withTooltip && club.name) {
    return (
      <Tooltip title={club.name}>
        <div>{avatar}</div>
      </Tooltip>
    );
  }
  return avatar;
};

export default DumbClubAvatar;

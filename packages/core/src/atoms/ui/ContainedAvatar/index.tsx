import { AvatarProps, Avatar as MuiAvatar } from '@material-ui/core';
import styled from 'styled-components';

type Props = Omit<AvatarProps, 'classes'>;

const Avatar = styled(MuiAvatar)`
  .MuiAvatar-img {
    object-fit: contain;
  }
`;

export const ContainedAvatar = (props: Props) => {
  return <Avatar {...props} />;
};

export default ContainedAvatar;

// eslint-disable-next-line sorare/no-unrendered-component-imports
import { AvatarProps } from '@material-ui/core';

import ContainedAvatar from '@sorare/core/src/atoms/ui/ContainedAvatar';

import { VariantStyle } from './types';

export interface Props {
  name: string;
  avatarUrl: string | null;
  variant?: VariantStyle;
  className?: string;
}

const variantMapping: { [key in VariantStyle]: AvatarProps['variant'] } = {
  medallion: 'circular',
  rounded: 'rounded',
};

export const DumbPlayerAvatar = (props: Props) => {
  const { name, avatarUrl, variant = 'rounded', className } = props;

  const avatarVariant: AvatarProps['variant'] = variantMapping[variant];

  return (
    <ContainedAvatar
      variant={avatarVariant}
      alt={name}
      src={avatarUrl || ''}
      className={className}
    />
  );
};

export default DumbPlayerAvatar;

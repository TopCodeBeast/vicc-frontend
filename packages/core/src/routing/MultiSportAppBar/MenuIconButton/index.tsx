import classNames from 'classnames';

import IconButton, { Props as IconButtonProps } from '@sorare/core/src/atoms/buttons/IconButton';
import { useConfigContext } from 'contexts/config';
import { useAppBarContext } from 'routing/MultiSportAppBar/context';

interface Props extends IconButtonProps {
  active?: boolean;
}
export const MenuIconButton = (props: Props) => {
  const { active, className, ...rest } = props;
  const { small } = useAppBarContext();
  const { currentUser } = useConfigContext();

  const forceNoBackground = small || !currentUser?.id;

  return (
    <IconButton
      {...rest}
      color={forceNoBackground ? 'transparent' : 'dark'}
      className={classNames('light-theme', className)}
    />
  );
};

export default MenuIconButton;

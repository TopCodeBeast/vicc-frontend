import classNames from 'classnames';

import IconButton, { Props as IconButtonProps } from '@core/atoms/buttons/IconButton';
import { useConfigContext } from '@core/contexts/config';
import useIsReorgApp from '@core/hooks/ui/useIsReorgApp';
import { useAppBarContext } from '@core/routing/MultiSportAppBar/context';

interface Props extends IconButtonProps {
  active?: boolean;
}
export const MenuIconButton = (props: Props) => {
  const { active, className, ...rest } = props;
  const { small } = useAppBarContext();
  const { currentUser } = useConfigContext();
  const isReorgApp = useIsReorgApp();
  const forceNoBackground = isReorgApp || small || !currentUser?.id;

  return (
    <IconButton
      {...rest}
      color={forceNoBackground ? 'transparent' : 'dark'}
      className={classNames('light-theme', className)}
    />
  );
};

export default MenuIconButton;

import { faFilter } from '@fortawesome/pro-solid-svg-icons';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';

type Props = { onClick: () => void };

export const FilterIconButton = ({ onClick }: Props) => {
  return (
    <IconButton
      onClick={onClick}
      small
      color="white"
      disableDebounce
      icon={faFilter}
    />
  );
};

import { faTrashAlt } from '@fortawesome/pro-solid-svg-icons';

import IconButton, { Props } from '@core/atoms/buttons/IconButton';

export const DeleteButton = (props: Props) => {
  return <IconButton color="white" icon={faTrashAlt} {...props} />;
};

export default DeleteButton;

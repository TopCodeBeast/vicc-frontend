import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { useIntl } from 'react-intl';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { glossary } from '@sorare/core/src/lib/glossary';

type Props = {
  onClose: () => void;
};
const CloseButton = ({ onClose }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <IconButton
      onClick={onClose}
      icon={faTimes}
      color="white"
      aria-label={formatMessage(glossary.close)}
    />
  );
};

export default CloseButton;

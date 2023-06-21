import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { useIntl } from 'react-intl';

import IconButton from '@core/atoms/buttons/IconButton';
import { glossary } from '@core/lib/glossary';

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

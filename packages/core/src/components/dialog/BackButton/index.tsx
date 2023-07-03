import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { useIntl } from 'react-intl';

import IconButton from '@core/atoms/buttons/IconButton';
import { glossary } from '@core/lib/glossary';

type Props = {
  onBack: () => void;
};
const BackButton = ({ onBack }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <IconButton
      onClick={onBack}
      icon={faChevronLeft}
      color="white"
      aria-label={formatMessage(glossary.back)}
    />
  );
};

export default BackButton;

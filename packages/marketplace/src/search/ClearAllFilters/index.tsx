import { FormattedMessage } from 'react-intl';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { filters } from '@sorare/core/src/lib/glossary';

export const ClearAllFilters = () => {
  const onClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button onClick={onClick} medium color="darkGray">
      <FormattedMessage {...filters.clearAll} />
    </Button>
  );
};

export default ClearAllFilters;

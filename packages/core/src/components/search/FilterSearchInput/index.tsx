import { useIntl } from 'react-intl';

import SearchInput from '@sorare/core/src/atoms/inputs/SearchInput';
import { glossary } from '@sorare/core/src/lib/glossary';

type Props = {
  handleChange: (event: {
    target: {
      value: string;
    };
  }) => void;
  value: string;
};

export const FilterSearchInput = ({ handleChange, value }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <SearchInput
      fullWidth
      rounded
      small
      withIcon
      onChange={handleChange}
      value={value}
      placeholder={formatMessage(glossary.search)}
    />
  );
};

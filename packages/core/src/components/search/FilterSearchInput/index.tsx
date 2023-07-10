import { useIntl } from 'react-intl';

import SearchInput from '@core/atoms/inputs/SearchInput';
import { glossary } from '@core/lib/glossary';

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

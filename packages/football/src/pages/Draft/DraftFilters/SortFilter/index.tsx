import { useIntl } from 'react-intl';

import RadioGroup from '@sorare/core/src/atoms/inputs/RadioGroup';

import { sortOptions } from '@football/pages/Draft/DraftFilters/draftFilters';

type Props = {
  initiallySelectedValue?: string;
  rounded?: boolean;
  onChange: (value: string) => void;
};

export const SortFilter = ({
  initiallySelectedValue,
  rounded,
  onChange,
}: Props) => {
  const { formatMessage } = useIntl();

  const translatedSortOptions = sortOptions.map(option => {
    return { ...option, label: formatMessage(option.label) };
  });

  return (
    <RadioGroup
      options={translatedSortOptions}
      rounded={rounded}
      initiallySelectedValue={initiallySelectedValue}
      name="draft-sort-type"
      onChange={onChange}
    />
  );
};

export default SortFilter;

import { FormattedMessage, defineMessages } from 'react-intl';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import CheckboxGroup from '@sorare/core/src/atoms/inputs/CheckboxGroup';
import FilterInDropdown from '@sorare/core/src/components/FilterInDropdown';

const messages = defineMessages({
  [ShopItemType.BANNER]: {
    id: 'ShopitemPicker.FilterBy.Banner',
    defaultMessage: 'Banner',
  },
  [ShopItemType.EXTRA_SWAP]: {
    id: 'ShopitemPicker.FilterBy.ExtraSwap',
    defaultMessage: 'Extra swap',
  },
  [ShopItemType.EXTRA_TEAMS_CAP]: {
    id: 'ShopitemPicker.FilterBy.ExtraTeamsCap',
    defaultMessage: 'Extra training team',
  },
  [ShopItemType.LEVEL_UP]: {
    id: 'ShopitemPicker.FilterBy.LevelUp',
    defaultMessage: 'Level up',
  },
  [ShopItemType.LOGO]: {
    id: 'ShopitemPicker.FilterBy.Logo',
    defaultMessage: 'Logo',
  },
  [ShopItemType.SHIELD]: {
    id: 'ShopitemPicker.FilterBy.Shield',
    defaultMessage: 'Badges',
  },
  [ShopItemType.XP_RESTORE]: {
    id: 'ShopitemPicker.FilterBy.XpRestore',
    defaultMessage: 'XP restore',
  },
  [ShopItemType.JERSEY]: {
    id: 'ShopitemPicker.FilterBy.Jersey',
    defaultMessage: 'Jersey',
  },
});

type Props = {
  types: ShopItemType[];
  values: ShopItemType[];
  onChange: (v: ShopItemType[]) => void;
};
const FilterBy = ({
  types = Object.values(ShopItemType),
  values,
  onChange,
}: Props) => {
  return (
    <FilterInDropdown
      darkTheme
      buttonLabel={
        <FormattedMessage
          id="ShopItemPicker.FilterBy.label"
          defaultMessage="Filter by"
        />
      }
    >
      <CheckboxGroup
        options={types.map(type => ({
          label: <FormattedMessage {...messages[type]} />,
          value: type,
        }))}
        selectedValues={values}
        onChange={onChange}
      />
    </FilterInDropdown>
  );
};

export default FilterBy;

import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import RadioGroup from '@sorare/core/src/atoms/inputs/RadioGroup';
import FilterInDropdown from '@sorare/core/src/components/FilterInDropdown';

const messages = defineMessages({
  newest: {
    id: 'SortBy.Newest',
    defaultMessage: 'Newest',
  },
  priceLowHigh: {
    id: 'SortBy.PriceLowHigh',
    defaultMessage: 'Price: Low-High',
  },
  priceHighLow: {
    id: 'SortBy.PriceHighLow',
    defaultMessage: 'Price: High-Low',
  },
});

export enum SortValues {
  NEWEST = 'NEWEST',
  PRICE_LOW_HIGH = 'PRICE_LOW_HIGH',
  PRICE_HIGH_LOW = 'PRICE_HIGH_LOW',
}
type Props = { onChange: (v: SortValues) => void };
const SortBy = ({ onChange }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <FilterInDropdown
      darkTheme
      buttonLabel={
        <FormattedMessage
          id="ShopItemPicker.SortBy.label"
          defaultMessage="Sort by"
        />
      }
    >
      <RadioGroup
        options={[
          {
            label: formatMessage(messages.newest),
            value: SortValues.NEWEST,
          },
          {
            label: formatMessage(messages.priceLowHigh),
            value: SortValues.PRICE_LOW_HIGH,
          },
          {
            label: formatMessage(messages.priceHighLow),
            value: SortValues.PRICE_HIGH_LOW,
          },
        ]}
        initiallySelectedValue={SortValues.NEWEST}
        name="club-shop-sort-type"
        onChange={onChange}
      />
    </FilterInDropdown>
  );
};

export default SortBy;

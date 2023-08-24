import Big from 'bignumber.js';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { Caption, Text20 } from '@sorare/core/src/atoms/typography';
import FilterTitle from '@sorare/core/src/components/search/FilterTitle';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';
import { LEVEL_MAX, LEVEL_MIN } from '@sorare/core/src/lib/cards';
import { FILTERS, Filter, FilterWidget } from '@sorare/core/src/lib/filters';
import { powerAlgorithm } from '@sorare/core/src/lib/slider';
import { toWei } from '@sorare/core/src/lib/wei';

import useFormatFilters from '@marketplace/hooks/filters/useFormatFilters';

import RangeSlider from '../../search/RangeSlider';

interface TitleProps {
  name: MessageDescriptor;
  attribute: string;
}

const Title = ({ name, attribute }: TitleProps) => {
  const { indexUiState } = useInstantSearch();

  const selected = !!indexUiState.range?.[attribute];

  return <FilterTitle name={name} selected={selected} />;
};

export const makeRangeFilter = (
  Component: () => React.JSX.Element,
  filter: Filter,
  {
    startsOpen = false,
  }: {
    startsOpen?: boolean;
  } = {}
): FilterWidget => ({
  key: filter.attribute,
  type: 'range',
  attribute: filter.attribute,
  component: <Component />,
  title: <Title name={filter.title} attribute={filter.attribute} />,
  accordionOptions: { startsOpen },
});

export const RefineCardLevel = makeRangeFilter(() => {
  return (
    <RangeSlider
      attribute={FILTERS.cardLevel.attribute}
      minForced={LEVEL_MIN}
      maxForced={LEVEL_MAX}
    />
  );
}, FILTERS.cardLevel);

const refinePriceAlgorithm = powerAlgorithm({ power: 20 });

const REFINE_PRICE_MAX_FIAT = 150000;
const REFINE_PRICE_MAX_ETH = 100;

const StyledText20 = styled(Text20)`
  align-self: center;
`;
const StyledCaption = styled(Caption)`
  align-self: flex-end;
`;

const PriceRangeSlider = () => {
  const { algoliaWeiFactor, sliderToPrice, priceToSlider } = useFormatFilters();
  const { currency, fiatCurrency } = useCurrentUserContext();
  const { convertToWei } = useCurrencyConverters();

  let maxForced = 1000; //TODO*****
  /*if (currency === Currency.FIAT) {
    maxForced = convertToWei(
      REFINE_PRICE_MAX_FIAT.toString(),
      fiatCurrency.code
    )
      .dividedBy(algoliaWeiFactor)
      .toNumber();
  } else {
    maxForced = new Big(toWei(REFINE_PRICE_MAX_ETH.toString()))
      .dividedBy(algoliaWeiFactor)
      .toNumber();
  }*/

  return (
    <RangeSlider
      attribute={FILTERS.price.attribute}
      algorithm={refinePriceAlgorithm}
      fromInput={priceToSlider}
      toInput={sliderToPrice}
      maxForced={maxForced}
      greaterThanMode
      icon={
        currency === Currency.FIAT ? (
          <StyledText20 bold color="var(--c-neutral-1000)">
            {fiatCurrency.symbol}
          </StyledText20>
        ) : (
          <StyledCaption bold color="var(--c-neutral-1000)">
            ETH
          </StyledCaption>
        )
      }
    />
  );
};

export const RefinePrice = ({
  startsOpen = false,
}: {
  startsOpen?: boolean;
} = {}) => makeRangeFilter(PriceRangeSlider, FILTERS.price, { startsOpen });

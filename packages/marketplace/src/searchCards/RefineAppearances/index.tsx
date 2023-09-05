import { faPercent } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
import FilterTitle from '@sorare/core/src/components/search/FilterTitle';
import {
  APPEARANCES_15_MAX,
  APPEARANCES_5_MAX,
  APPEARANCES_MIN,
} from '@sorare/core/src/lib/cards';
import { FILTERS, FilterWidget } from '@sorare/core/src/lib/filters';
import { filters } from '@sorare/core/src/lib/glossary';

import { makeRangeFilter } from '@marketplace/searchCards/RangeSlider';

import RangeSlider from '../../search/RangeSlider';

const AppearancesTitle = () => {
  const { indexUiState } = useInstantSearch();

  const vicc5L5App = indexUiState.range?.[FILTERS.lastFiveAppearances.attribute];
  const vicc5L15App =
    indexUiState.range?.[FILTERS.lastFifteenAppearances.attribute];

  const selected =
    (vicc5L5App && vicc5L5App !== `${APPEARANCES_MIN}:${APPEARANCES_5_MAX}`
      ? 1
      : 0) +
    (vicc5L15App && vicc5L15App !== `${APPEARANCES_MIN}:${APPEARANCES_15_MAX}`
      ? 1
      : 0);

  return <FilterTitle name={filters.appearances} selected={selected} />;
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);

  &:not(:has(.FilterWidget.visible)) {
    display: none;
  }
`;

const AppearancesComponent = ({
  fiveAppearancesWidget,
  fifteenAppearancesWidget,
}: {
  fiveAppearancesWidget: FilterWidget;
  fifteenAppearancesWidget: FilterWidget;
}) => {
  return (
    <Root>
      <Section>
        <Text14 color="var(--c-neutral-600)">
          <FormattedMessage {...FILTERS.lastFiveAppearances.title} />
        </Text14>
        {fiveAppearancesWidget.component}
      </Section>
      <Section>
        <Text14 color="var(--c-neutral-600)">
          <FormattedMessage {...FILTERS.lastFifteenAppearances.title} />
        </Text14>
        {fifteenAppearancesWidget.component}
      </Section>
    </Root>
  );
};

export const RefineAppearances = (): FilterWidget => {
  const interval5 = 100 / APPEARANCES_5_MAX;
  const interval15 = 100 / APPEARANCES_15_MAX;

  const fiveAppearancesWidget = makeRangeFilter(
    () => (
      <RangeSlider
        attribute={FILTERS.lastFiveAppearances.attribute}
        minForced={APPEARANCES_MIN}
        maxForced={APPEARANCES_5_MAX}
        toInput={v => Math.round(v * interval5).toString()}
        fromInput={v => v / interval5}
        icon={<FontAwesomeIcon icon={faPercent} />}
      />
    ),
    FILTERS.lastFiveAppearances
  );

  const fifteenAppearancesWidget = makeRangeFilter(
    () => (
      <RangeSlider
        attribute={FILTERS.lastFifteenAppearances.attribute}
        minForced={APPEARANCES_MIN}
        maxForced={APPEARANCES_15_MAX}
        toInput={v => Math.round(v * interval15).toString()}
        fromInput={v => v / interval15}
        icon={<FontAwesomeIcon icon={faPercent} />}
      />
    ),
    FILTERS.lastFifteenAppearances
  );

  return {
    key: FILTERS.appearances.attribute,
    type: 'range',
    attribute: FILTERS.appearances.attribute,
    title: <AppearancesTitle />,
    component: (
      <AppearancesComponent
        fiveAppearancesWidget={fiveAppearancesWidget}
        fifteenAppearancesWidget={fifteenAppearancesWidget}
      />
    ),
  };
};

import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
import FilterTitle from '@sorare/core/src/components/search/FilterTitle';
import { FILTERS, FilterWidget } from '@sorare/core/src/lib/filters';
import { filters } from '@sorare/core/src/lib/glossary';

import { makeRangeFilter } from '@marketplace/searchCards/RangeSlider';

import RangeSlider from '../../search/RangeSlider';

const AverageScoreTitle = () => {
  const { indexUiState } = useInstantSearch();

  const selected =
    (indexUiState.range?.[FILTERS.lastFiveAverageScore.attribute] ? 1 : 0) +
    (indexUiState.range?.[FILTERS.lastFifteenAverageScore.attribute] ? 1 : 0);

  return <FilterTitle name={filters.averageScore} selected={selected} />;
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

const AverageScoreComponent = ({
  fiveAverageScoreWidget,
  fifteenAverageScoreWidget,
}: {
  fiveAverageScoreWidget: FilterWidget;
  fifteenAverageScoreWidget: FilterWidget;
}) => {
  return (
    <Root>
      <Section>
        <Text14 color="var(--c-neutral-600)">
          <FormattedMessage {...FILTERS.lastFiveAverageScore.title} />
        </Text14>
        {fiveAverageScoreWidget.component}
      </Section>
      <Section>
        <Text14 color="var(--c-neutral-600)">
          <FormattedMessage {...FILTERS.lastFifteenAverageScore.title} />
        </Text14>
        {fifteenAverageScoreWidget.component}
      </Section>
    </Root>
  );
};

export const RefineAverageScore = (): FilterWidget => {
  const fiveAverageScoreWidget = makeRangeFilter(
    () => <RangeSlider attribute={FILTERS.lastFiveAverageScore.attribute} />,
    FILTERS.lastFiveAverageScore
  );

  const fifteenAverageScoreWidget = makeRangeFilter(
    () => <RangeSlider attribute={FILTERS.lastFifteenAverageScore.attribute} />,
    FILTERS.lastFifteenAverageScore
  );

  return {
    key: FILTERS.averageScore.attribute,
    type: 'range',
    attribute: FILTERS.averageScore.attribute,
    title: <AverageScoreTitle />,
    component: (
      <AverageScoreComponent
        fiveAverageScoreWidget={fiveAverageScoreWidget}
        fifteenAverageScoreWidget={fifteenAverageScoreWidget}
      />
    ),
  };
};

import { useContext, useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Switch from '@sorare/core/src/atoms/inputs/Switch';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import ScarcityBall from '@sorare/core/src/components/card/ScarcityBall';
import { Scarcity } from '@sorare/core/src/lib/cards';

import Context from '@football/components/so5/ComposeTeam/Context';
import { PointsFilter } from '@football/components/so5/ComposeTeam/responsive/BenchFilter/PointsFilter';
import { ScarcityFilter } from '@football/components/so5/ComposeTeam/responsive/BenchFilter/ScarcityFilter';
import useShortcut from '@football/hooks/useShortcut';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--c-neutral-1000);
  gap: var(--triple-unit);
`;
const ShowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--intermediate-unit);
`;

const ShowInputRow = styled.div`
  display: flex;
  align-items: center;
`;

const ShowInputLabel = styled(Text14)`
  flex: 1;
  color: var(--c-neutral-600);
`;

const messages = defineMessages({
  statsView: {
    id: 'BenchFilterDropdown.StatsView',
    defaultMessage: 'Player stats {shortcut}',
  },
  used: {
    id: 'BenchFilterDropdown.UsedCardFilter',
    defaultMessage: 'Used in another lineup {shortcut}',
  },
  noGame: {
    id: 'BenchFilterDropdown.NoGameFilter',
    defaultMessage: 'No game this week {shortcut}',
  },
  affordableOnly: {
    id: 'BenchFilterDropdown.AffordableOnly',
    defaultMessage: 'Affordable only {shortcut}',
  },
});

export const MAX_CARD_VALUE = 100;

const FilterContent = () => {
  const {
    leaderboardRarities,
    cardsScarcities,
    setCardsScarcities,
    setFilters,
    filters,
    showAffordableOnly,
    setShowAffordableOnly,
    statsView,
    toggleStatsView,
    isCappedMode,
  } = useContext(Context)!;
  const { includeNoGameCards, includeUsedCards } = filters;
  const { Icon: StatsViewShortcutIcon } = useShortcut('s', toggleStatsView);
  const { Icon: AffordableOnlyShortcutIcon } = useShortcut('a', () =>
    setShowAffordableOnly(a => !a)
  );
  const { Icon: UsedShortcutIcon } = useShortcut(
    'u',
    () => setFilters({ ...filters, includeUsedCards: !includeUsedCards }),
    [filters]
  );
  const { Icon: NoGameShortcutIcon } = useShortcut(
    'n',
    () => setFilters({ ...filters, includeNoGameCards: !includeNoGameCards }),
    [filters]
  );

  const showFilters = [
    {
      id: 'statsView',
      value: statsView,
      label: (
        <FormattedMessage
          {...messages.statsView}
          values={{
            shortcut: StatsViewShortcutIcon,
          }}
        />
      ),
      onChange: toggleStatsView,
    },
    {
      id: 'used',
      value: includeUsedCards,
      label: (
        <FormattedMessage
          {...messages.used}
          values={{
            shortcut: UsedShortcutIcon,
          }}
        />
      ),
      onChange: (value: boolean) =>
        setFilters({ ...filters, includeUsedCards: value }),
    },
    {
      id: 'nogame',
      value: includeNoGameCards,
      label: (
        <FormattedMessage
          {...messages.noGame}
          values={{
            shortcut: NoGameShortcutIcon,
          }}
        />
      ),
      onChange: (value: boolean) =>
        setFilters({ ...filters, includeNoGameCards: value }),
    },
    {
      id: 'affordableOnly',
      value: showAffordableOnly,
      label: (
        <FormattedMessage
          {...messages.affordableOnly}
          values={{ shortcut: AffordableOnlyShortcutIcon }}
        />
      ),
      onChange: setShowAffordableOnly,
      hide: !isCappedMode,
    },
  ];

  const scarcitiesOptions = useMemo(
    () =>
      leaderboardRarities.map(scarcity => ({
        label: <ScarcityBall scarcity={scarcity} />,
        value: scarcity,
      })),
    [leaderboardRarities]
  );
  const selectedScarcitiesOptions = useMemo(
    () =>
      scarcitiesOptions
        .filter(o => cardsScarcities.includes(o.value))
        .map(({ value }) => value),
    [scarcitiesOptions, cardsScarcities]
  );
  const showScarcitySelect = scarcitiesOptions.length > 1;
  const showableFilters = showFilters.filter(filter => !filter.hide);

  return (
    <Wrapper>
      {showScarcitySelect && (
        <ScarcityFilter
          onChange={selected => {
            if (selected) {
              setCardsScarcities(selected as Scarcity[]);
            }
          }}
          selectedValues={selectedScarcitiesOptions}
          scarcitiesOptions={leaderboardRarities}
        />
      )}
      <ShowWrapper>
        <Text16>
          <FormattedMessage
            id="BenchFilterDropdown.Show"
            defaultMessage="Show"
          />
        </Text16>
        {showableFilters.map(filter => (
          <ShowInputRow key={filter.id}>
            <ShowInputLabel as="label" htmlFor={filter.id}>
              {filter.label}
            </ShowInputLabel>
            <Switch
              checked={filter.value}
              onChange={e => filter.onChange(e.target.checked)}
              name={filter.id}
            />
          </ShowInputRow>
        ))}
      </ShowWrapper>
      {isCappedMode && (
        <PointsFilter
          disabled={showAffordableOnly}
          value={{
            min: filters.lastFifteenSo5AverageScore?.min || 0,
            max: filters.lastFifteenSo5AverageScore?.max || MAX_CARD_VALUE,
          }}
          onChange={value => {
            setFilters({
              ...filters,
              lastFifteenSo5AverageScore: value,
            });
          }}
          boundariesRange={{
            min: 0,
            max: MAX_CARD_VALUE,
          }}
        />
      )}
    </Wrapper>
  );
};

export default FilterContent;

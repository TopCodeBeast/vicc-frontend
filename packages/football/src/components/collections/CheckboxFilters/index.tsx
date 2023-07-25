import { gql } from '@apollo/client';
import { useIntl } from 'react-intl';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { FilterAccordion } from '@sorare/core/src/atoms/layout/Accordion';
import { FilterSection } from '@sorare/core/src/components/search/FilterSection';
import { FilterTitle } from '@sorare/core/src/components/search/FilterTitle';
import Option from '@sorare/core/src/components/search/Option';
import { cardAttributes } from '@sorare/core/src/lib/glossary';
import { scarcityMessages } from '@sorare/core/src/lib/scarcity';

import { CheckboxFilters_cardCollectionConnection } from './__generated__/index.graphql';

type Props = {
  collectionConnection: CheckboxFilters_cardCollectionConnection;
  rarities: Rarity[] | undefined;
  onRaritiesChange: (newRarities: Rarity[] | undefined) => void;
  seasonStartYears: number[] | undefined;
  onSeasonsChange: (newSeasons: number[] | undefined) => void;
};

export const CheckboxFilters = ({
  collectionConnection,
  rarities,
  onRaritiesChange,
  seasonStartYears,
  onSeasonsChange,
}: Props) => {
  const { formatMessage } = useIntl();

  const { seasonsCount, raritiesCount } = collectionConnection;
  const toggleItemInlist = <T,>(
    array: T[] | undefined,
    item: T,
    onChangeFunction: (newArray: T[] | undefined) => void
  ) => {
    if (array?.includes(item)) {
      const itemExcludedArray = array.filter(i => i !== item);
      onChangeFunction(
        itemExcludedArray.length ? itemExcludedArray : undefined
      );
    } else {
      onChangeFunction(array ? [...array, item] : [item]);
    }
  };

  const seasonsFilters = seasonsCount.map(({ season, count }) => ({
    value: season.startYear,
    label: season.name,
    count,
    active: !!seasonStartYears?.includes(season.startYear),
    onClick: () => {
      toggleItemInlist(seasonStartYears, season.startYear, onSeasonsChange);
    },
    before: null,
  }));

  const rarityFilters = raritiesCount.map(({ rarity, count }) => ({
    value: rarity,
    label: formatMessage(scarcityMessages[rarity]),
    count,
    active: !!rarities?.includes(rarity),
    onClick: () => {
      toggleItemInlist(rarities, rarity, onRaritiesChange);
    },
    before: <ScarcityIcon scarcity={rarity} size="md" />,
  }));

  const allFilters = [
    {
      id: 'scarcities',
      title: <FilterTitle name={cardAttributes.scarcity} />,
      filters: rarityFilters,
    },
    {
      id: 'seasons',
      title: <FilterTitle name={cardAttributes.season} />,
      filters: seasonsFilters,
    },
  ];
  return (
    <>
      {allFilters.map(({ title, filters, id }) => (
        <FilterAccordion startsOpen title={title} key={id}>
          <FilterSection>
            {filters.map(({ value, label, count, active, onClick, before }) => (
              <Option
                variant="checkbox"
                key={value}
                label={label}
                onClick={onClick}
                count={count}
                active={active}
                before={before}
              />
            ))}
          </FilterSection>
        </FilterAccordion>
      ))}
    </>
  );
};

CheckboxFilters.fragments = {
  cardCollectionConnection: gql`
    fragment CheckboxFilters_cardCollectionConnection on CardCollectionConnection {
      seasonsCount {
        count
        season {
          startYear
          name
        }
      }
      raritiesCount {
        count
        rarity
      }
    }
  `,
};

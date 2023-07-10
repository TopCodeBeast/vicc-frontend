import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { ScarcityType } from '@sorare/core/src/components/card/ScarcityBall';
import {
  sortHitByIsRefinedThenLabel,
  sortHitByLabel,
  sortHitByLabelReverse,
  sortHitByRarity,
} from '@sorare/core/src/lib/cards';
import { FILTERS, Filter, FilterWidget } from '@sorare/core/src/lib/filters';
import { transferMarket } from '@sorare/core/src/lib/glossary';
import { formatWord } from '@sorare/core/src/lib/humanize';
import { formatFilterOption as formatPlayerFilterOption } from '@sorare/core/src/lib/players';
import { formatFilter as formatSeasonFilter } from '@sorare/core/src/lib/seasons';

import RefineList, { RefineListProps } from '../../search/RefineList';
import RefineListTitle from '../../search/RefineListTitle';

export const makeFilter = (
  filter: Filter,
  options: Omit<RefineListProps, 'attribute'> & {
    startsOpen?: boolean;
  } = {}
): FilterWidget => {
  const {
    startsOpen = false,
    transformItems = sortHitByLabel,
    ...listProps
  } = options;
  return {
    key: filter.attribute,
    type: 'list',
    attribute: filter.attribute,
    component: (
      <RefineList
        attribute={filter.attribute}
        transformItems={transformItems}
        {...listProps}
      />
    ),
    title: <RefineListTitle attribute={filter.attribute} name={filter.title} />,
    accordionOptions: { startsOpen },
  };
};

export const RefineRarity = ({
  startsOpen = true,
}: {
  startsOpen?: boolean;
} = {}) =>
  makeFilter(FILTERS.rarity, {
    startsOpen,
    formatOption: formatWord,
    transformItems: sortHitByRarity,
    BeforeOption: ({ option }) => (
      <ScarcityIcon scarcity={option as ScarcityType} size="md" />
    ),
  });

export const RefineTeam = makeFilter(FILTERS.team, {
  searchable: true,
  transformItems: sortHitByIsRefinedThenLabel,
});
export const RefineActiveClub = makeFilter(FILTERS.activeClub, {
  searchable: true,
  transformItems: sortHitByIsRefinedThenLabel,
});
export const RefineActiveNationalTeam = makeFilter(FILTERS.activeNationalTeam, {
  searchable: true,
  transformItems: sortHitByIsRefinedThenLabel,
});
export const RefineNationality = makeFilter(FILTERS.nationality, {
  searchable: true,
  transformItems: sortHitByIsRefinedThenLabel,
});
export const RefinePlayer = makeFilter(FILTERS.player, {
  searchable: true,
  formatOption: formatPlayerFilterOption,
  transformItems: sortHitByIsRefinedThenLabel,
});
export const RefineSeason = makeFilter(FILTERS.season, {
  formatOption: formatSeasonFilter,
  transformItems: sortHitByLabelReverse,
  showMore: true,
});
export const RefineSingleYearSeason = makeFilter(FILTERS.season, {
  transformItems: sortHitByLabelReverse,
  showMore: true,
});

export const RefineLeague = makeFilter(FILTERS.league, {
  searchable: true,
  transformItems: sortHitByIsRefinedThenLabel,
});
export const RefineCardEdition = makeFilter(FILTERS.cardEdition, {
  searchable: true,
});

export const formatBundledOption: NonNullable<
  RefineListProps['formatOption']
> = (bundled, formatMessage) => {
  if (bundled === 'true') return formatMessage(transferMarket.bundles);

  return formatMessage(transferMarket.singleCards);
};
export const RefineBundledSale = makeFilter(FILTERS.bundledSale, {
  formatOption: formatBundledOption,
});
export const RefineCustomDeck = makeFilter(FILTERS.customDeck, {
  searchable: true,
});

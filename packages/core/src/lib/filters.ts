import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

import { cardAttributes, filters } from '@core/lib/glossary';
import { attributes as playerAttributes } from '@core/lib/players';

type RealFilterWidget = {
  attribute: string;
  type: 'list' | 'range' | 'toggle';
};

type SortFilterWidget = {
  type: 'sort';
};

type VirtualToggleFilterWidget = {
  filter: VirtualToggleFilter;
  type: 'virtualToggle';
};

export type FilterSeparator = {
  type: 'separator';
};

export type FilterWidget =
  | (RealFilterWidget | SortFilterWidget | VirtualToggleFilterWidget) & {
      key: string;
      title?: ReactNode;
      component: ReactNode;
      accordionOptions?: {
        startsOpen: boolean;
      };
    };

export type Filter = {
  attribute: string;
  title: MessageDescriptor;
  label?: MessageDescriptor;
  alias?: string;
};

export type VirtualToggleFilter = {
  name: string;
  trackingName: string;
  title?: MessageDescriptor;
  label?: MessageDescriptor;
  defaultValue?: boolean | string[];
  skipClear?: boolean;
};

export type ToggleFilter = {
  attribute: string;
  label: MessageDescriptor;
};

export const FILTERS = {
  rarity: {
    attribute: 'rarity',
    title: cardAttributes.scarcity,
  },
  position: {
    attribute: 'position',
    title: cardAttributes.position,
  },
  team: {
    attribute: 'team.long_name',
    title: cardAttributes.team,
  },
  cardTeam: {
    attribute: 'team.long_name',
    title: cardAttributes.cardTeam,
  },
  activeClub: {
    attribute: 'active_club.long_name',
    title: filters.activeClub,
  },
  activeTeam: {
    attribute: 'active_team.long_name',
    title: filters.activeTeam,
  },
  activeNationalTeam: {
    attribute: 'active_national_team.long_name',
    title: filters.activeNationalTeam,
  },
  nationality: {
    attribute: 'country.name_en',
    title: filters.nationality,
  },
  player: {
    attribute: 'player.display_name',
    title: cardAttributes.player,
  },
  season: {
    attribute: 'season',
    title: cardAttributes.season,
  },
  league: {
    attribute: 'active_league.display_name',
    title: filters.league,
  },
  cardEdition: {
    attribute: 'card_edition.display_name',
    title: filters.cardEdition,
  },
  bundledSale: {
    attribute: 'sale.bundled',
    title: filters.bundledSale,
  },
  customDeck: {
    attribute: 'custom_decks.name',
    title: filters.customDeck,
  },
  customList: {
    attribute: 'custom_decks.name',
    title: filters.customList,
  },
  cardLevel: {
    attribute: 'grade',
    title: filters.cardLevel,
  },
  averageScore: {
    attribute: 'average_score',
    title: filters.averageScore,
  },
  lastFiveAverageScore: {
    attribute: 'vicc5.last_five_vicc5_average_score',
    title: filters.lastFiveAverageScore,
    alias: 'L5',
  },
  lastFifteenAverageScore: {
    attribute: 'vicc5.last_fifteen_vicc5_average_score',
    title: filters.lastFifteenAverageScore,
    alias: 'L15',
  },
  appearances: {
    attribute: 'appearances',
    title: filters.appearances,
  },
  lastFiveAppearances: {
    attribute: 'vicc5.last_five_vicc5_appearances',
    title: filters.lastFiveAppearances,
  },
  lastFifteenAppearances: {
    attribute: 'vicc5.last_fifteen_vicc5_appearances',
    title: filters.lastFifteenAppearances,
  },
  price: {
    attribute: 'sale.price',
    title: filters.price,
  },
  serialNumber: {
    attribute: 'serial_number',
    title: cardAttributes.serialNumber,
  },
  age: { attribute: 'player.birth_date_i', title: playerAttributes.age },
  nbaTenGameAverageScore: {
    attribute: 'nba_stats.ten_game_average',
    title: filters.nbaTenGameAverageScore,
  },
  mlbLastFifteenAverageScore: {
    attribute: 'baseball_stats.last_fifteen_average_score',
    title: filters.mlbLastFifteenAverageScore,
  },
  mlbSeasonAverageScore: {
    attribute: 'season_average_score',
    title: filters.mlbSeasonAverageScore,
  },
  mlbEligibleLeaderboards: {
    attribute: 'eligible_leaderboards',
    title: filters.mlbEligibleLeaderboards,
  },
} satisfies { [key: string]: Filter };

export const VIRTUAL_TOGGLE_FILTERS = {
  playingNextGameweekFilter: {
    name: 'pn',
    trackingName: 'teamHasGame',
    label: filters.playingNextGameweekFilterLabel,
    defaultValue: false,
  },
  promotedCardsFilter: {
    name: 'promo',
    trackingName: 'promotion',
    title: filters.promotedCardsFilterTitle,
    defaultValue: false,
  },
  favoriteFilter: {
    name: 'ff',
    trackingName: 'favorite',
    label: filters.favoriteFilterLabel,
    defaultValue: false,
  },
  nonPlayableCardsFilter: {
    name: 'co',
    trackingName: 'nonPlayableCards',
    label: filters.nonPlayableCardsFilterLabel,
    defaultValue: false,
  },
  legendFilter: {
    name: 'legend',
    trackingName: 'legend',
    label: filters.legendFilterLabel,
    defaultValue: false,
  },
  leagueFilter: {
    name: 'lf',
    trackingName: 'league',
    title: filters.leagueFilterTitle,
    defaultValue: false,
  },
  customDecksFilter: {
    name: 'deck',
    trackingName: 'customDecksFilter',
    title: filters.customList,
    defaultValue: false,
  },
  notInLineupFilter: {
    name: 'nl',
    trackingName: 'notInLineup',
    label: filters.notInLineupFilterLabel,
    defaultValue: false,
  },
  unstackedFilter: {
    name: 'unstacked',
    trackingName: 'unstacked',
    defaultValue: false,
    skipClear: true,
  },
} satisfies {
  [key: string]: VirtualToggleFilter;
};

export const TOGGLE_FILTERS = {
  showDetails: {
    attribute: 'showDetails',
    label: filters.showDetailsLabel,
  },
  onSaleFilter: {
    attribute: 'on_sale',
    label: filters.onSaleFilterLabel,
  },
  latestSeasonFilter: {
    attribute: 'latest_season',
    label: filters.latestSeasonLabel,
  },
  jerseySerialFilter: {
    attribute: 'jersey_serial',
    label: filters.jerseySerialLabel,
  },
} satisfies { [key: string]: ToggleFilter };

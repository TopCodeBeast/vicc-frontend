import React, { ReactNode } from 'react';

import { AlgoliaCardIndexesNames, AlgoliaIndexes } from '@core/contexts/config';
import { FilterSeparator, FilterWidget } from '@sorare/core/src/lib/filters';
import { ExtendedIndexUIState } from '@sorare/core/src/components/search/InstantSearch/types';

export type SearchTopic = {
  type: 'player' | 'team' | 'league' | 'country' | 'stack' | 'favoriteCards';
  label: string;
};

export interface Props {
  children?: ReactNode;
  title: React.ReactNode;
  topic?: SearchTopic;
  subtitle?: React.ReactNode;
  toggleDesktopFilter?: boolean;
  hideSavedFilters?: boolean;
  banner: React.ReactNode;
  CardResultsComponent: any;
  defaultSort?: keyof AlgoliaIndexes;
  sorts: AlgoliaCardIndexesNames;
  cardFilters: (FilterWidget | FilterSeparator)[];
  hideOwner?: boolean;
  galleryOwnerSlug?: string;
  alwaysShowFavoriteButton?: boolean;
  filtersTour?: any;  //TODO
  cardsTour?: any;  //TODO
  removeFinishedAuctions?: boolean;
  removeEndedSingleSaleOffers?: boolean;
  advancedCardFilters?: (FilterWidget | FilterSeparator)[];
  stackable?: boolean;
  attributesToRetrieve?: string[];
  hideSorareUser?: boolean;
  favPlayerHit?: {
    display_name: string;
  };
  initialIndexUIState?: ExtendedIndexUIState;
}

export type CardResultsProps = {
  hideOwner: boolean;
  galleryOwnerSlug: string;
  removeFinishedAuctions: boolean;
  removeEndedSingleSaleOffers: any;
  topic: SearchTopic;
  hideSorareUser: boolean;
  stackable: any;
};

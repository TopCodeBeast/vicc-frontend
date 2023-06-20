import React, { ReactElement, ReactNode } from 'react';

import { FilterSeparator, FilterWidget } from '@sorare/core/src/lib/filters';

export type Props = {
  children?: ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  stackable: boolean;
  toggleDesktopFilter?: boolean;
  hideSavedFilters?: boolean;
  banner: React.ReactNode;
  cardFilters: (FilterWidget | FilterSeparator)[];
  CardResultsComponent: any;
};

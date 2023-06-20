import React, { ReactNode } from 'react';

export type Props = {
  children?: ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  stackable: boolean;
  toggleDesktopFilter?: boolean;
  hideSavedFilters?: boolean;
  banner: React.ReactNode;
};

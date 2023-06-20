import React, { ReactNode } from 'react';

export type Props = {
  children?: ReactNode;
  title: React.ReactNode;
  stackable: boolean;
  banner: React.ReactNode;
};

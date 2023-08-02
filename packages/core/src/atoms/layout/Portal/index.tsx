import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import usePortal from '@core/hooks/usePortal';

export const Portal: FC<{
  id:
    | 'substicky-bar-portal'
    | 'dropdown'
    | 'drawer'
    | 'above-bottom-bar-portal'
    | 'page-header-title';
  children: ReactNode;
}> = ({ id, children }) => {
  const target = usePortal(id);
  return createPortal(children, target);
};

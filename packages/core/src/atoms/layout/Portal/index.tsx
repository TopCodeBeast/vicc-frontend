import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import usePortal from '@sorare/core/src/hooks/usePortal';

export const Portal = ({
  id,
  children,
}: {
  id:
    | 'substicky-bar-portal'
    | 'dropdown'
    | 'drawer'
    | 'above-bottom-bar-portal';
  children: ReactNode;
}) => {
  const target = usePortal(id);
  return createPortal(children, target);
};

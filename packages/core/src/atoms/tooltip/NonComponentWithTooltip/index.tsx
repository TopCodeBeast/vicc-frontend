import { ReactNode } from 'react';

import { Tooltip } from '@sorare/core/src/atoms/tooltip/Tooltip';

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
};

export const NonComponentWithTooltip = ({
  title,
  children,
  className,
}: Props) => {
  return (
    <Tooltip title={title}>
      <span role="img" aria-label={title} className={className}>
        {children}
      </span>
    </Tooltip>
  );
};

export default NonComponentWithTooltip;

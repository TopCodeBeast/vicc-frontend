import { ReactElement, ReactNode } from 'react';

import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Chip } from '@sorare/core/src/atoms/ui/Chip';

type Props = {
  value: string | number | ReactElement;
  title?: NonNullable<ReactNode>;
  large?: boolean;
  outlined?: boolean;
};

export const Item = (props: Props) => {
  const { value, outlined, title, large } = props;

  if (!title) {
    return (
      <Chip
        outlined={outlined}
        size={large ? 'small' : 'smaller'}
        label={Label => <Label>{value}</Label>}
        custom={{
          color: 'var(--c-neutral-1000)',
          background: 'var(--c-neutral-300)',
        }}
      />
    );
  }

  return (
    <Tooltip title={title}>
      <Chip
        outlined={outlined}
        size={large ? 'small' : 'smaller'}
        label={Label => <Label>{value}</Label>}
        custom={{
          color: 'var(--c-neutral-1000)',
          background: 'var(--c-neutral-400)',
        }}
      />
    </Tooltip>
  );
};

export default Item;

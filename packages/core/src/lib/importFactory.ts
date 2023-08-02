import { ComponentType } from 'react';

import retry from './retry';

export const importFactory = <
  T extends { default: ComponentType<React.PropsWithChildren<any>> }
>(
  importFunction: () => Promise<T>
) => {
  let bundle: any;

  return async () => {
    if (bundle) {
      return Promise.resolve(bundle);
    }
    bundle = await retry(importFunction);
    return Promise.resolve(bundle);
  };
};

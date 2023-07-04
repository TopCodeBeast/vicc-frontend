import { Suspense } from 'react';

import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { lazy } from '@core/lib/retry';

import type { Props as ContentProps } from './Content';

const Content = lazy(async () => import('./Content'));

export interface Props extends Omit<ContentProps, 'children'> {
  data?: string | null;
  inModal?: boolean;
}

export const LazyMarkdown = ({ data, inModal, ...rest }: Props) => {
  return data ? (
    <Suspense fallback={<LoadingIndicator />}>
      <Content {...rest}>{data}</Content>
    </Suspense>
  ) : (
    <LoadingIndicator fullHeight={!inModal} />
  );
};

export default LazyMarkdown;

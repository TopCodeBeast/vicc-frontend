import { FC, Suspense } from 'react';

import Backdrop from '@core/atoms/loader/Backdrop';
import { lazy } from '@core/lib/retry';

const ItemDialog = lazy(
  async () => import('@sorare/core/src/components/cards/ItemDialog')
);

type Props = {
  isDialog: boolean;
  Component: FC<React.PropsWithChildren<{ inDialog?: boolean }>>;
  Layout: FC<React.PropsWithChildren<any>>;
};
const WithItemDialog = ({ isDialog, Layout, Component }: Props) => {
  return isDialog ? (
    <Suspense fallback={<Backdrop />}>
      <ItemDialog>
        <Component inDialog />
      </ItemDialog>
    </Suspense>
  ) : (
    <Layout>
      <Component />
    </Layout>
  );
};
export default WithItemDialog;

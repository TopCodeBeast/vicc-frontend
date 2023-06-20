import { FC, Suspense } from 'react';

import Backdrop from '@sorare/core/src/atoms/loader/Backdrop';
import { lazy } from '@sorare/core/src/lib/retry';

const ItemDialog = lazy(
  async () => import('@sorare/core/src/components/cards/ItemDialog')
);

type Props = {
  isDialog: boolean;
  Component: FC;
  Layout: FC<any>;
};
const WithItemDialog = ({ isDialog, Layout, Component }: Props) => {
  return isDialog ? (
    <Suspense fallback={<Backdrop />}>
      <ItemDialog>
        <Component />
      </ItemDialog>
    </Suspense>
  ) : (
    <Layout>
      <Component />
    </Layout>
  );
};
export default WithItemDialog;

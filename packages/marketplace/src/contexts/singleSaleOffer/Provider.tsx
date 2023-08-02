import { ReactNode, Suspense, useState } from 'react';

import { lazy } from '@sorare/core/src/lib/retry';

import SingleSaleOfferContextProvider, { SingleSaleOfferPopinInfo } from '.';

const CancelSalePopin = lazy(
  async () => import('components/offer/CancelSalePopin')
);

interface Props {
  children: ReactNode;
}

const SingleSaleOfferProvider = ({ children }: Props) => {
  const [popinInfo, setPopinInfo] = useState<SingleSaleOfferPopinInfo | null>(
    null
  );

  return (
    <SingleSaleOfferContextProvider
      value={{
        showPopin: setPopinInfo,
      }}
    >
      {popinInfo && (
        <Suspense fallback={null}>
          <CancelSalePopin
            assetId={popinInfo.assetId}
            onClose={() => setPopinInfo(null)}
          />
        </Suspense>
      )}
      {children}
    </SingleSaleOfferContextProvider>
  );
};

export default SingleSaleOfferProvider;

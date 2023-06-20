import { ReactNode, Suspense, useEffect, useState } from 'react';

import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { useLocationChanged } from '@sorare/core/src/hooks/useLocationChanged';

import BuyTokenConfirmationById from 'components/buyActions/BuyTokenConfirmationById';
import BuyPrimaryOfferConfirmationById from 'components/primaryOffer/BuyPrimaryOfferConfirmationById';

import BuyConfirmationContextProvider, {
  BuyConfirmationProviderStateProps,
} from '.';

interface Props {
  children: ReactNode;
}

const BuyConfirmationProvider = ({ children }: Props) => {
  const [buyConfirmationProps, setBuyConfirmationProps] =
    useState<BuyConfirmationProviderStateProps | null>(null);
  const { up: upTablet } = useScreenSize('tablet');
  const locationChanged = useLocationChanged();
  const [showBuyingConfirmation, setShowBuyingConfirmation] =
    useState<boolean>(false);

  const onClose = () => {
    setBuyConfirmationProps(null);
    setShowBuyingConfirmation(false);
  };

  useEffect(() => {
    onClose();
  }, [locationChanged]);

  const { tokenOfferId, primaryOfferId, payment, customAmountDisplay } =
    buyConfirmationProps || {};

  return (
    <BuyConfirmationContextProvider
      value={{
        setBuyConfirmationProps,
        setShowBuyingConfirmation,
      }}
    >
      <Suspense fallback={null}>
        <Dialog
          open={showBuyingConfirmation}
          onClose={onClose}
          fullScreen={!upTablet}
          disablePortal
          scroll="body"
        >
          {payment && tokenOfferId && (
            <BuyTokenConfirmationById
              tokenOfferId={tokenOfferId}
              payment={payment}
            />
          )}
          {payment && primaryOfferId && (
            <BuyPrimaryOfferConfirmationById
              primaryOfferId={primaryOfferId}
              payment={payment}
              customAmountDisplay={customAmountDisplay}
            />
          )}
        </Dialog>
      </Suspense>
      {children}
    </BuyConfirmationContextProvider>
  );
};

export default BuyConfirmationProvider;

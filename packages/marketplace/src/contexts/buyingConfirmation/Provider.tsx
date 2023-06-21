import { ReactNode, Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';

import Dialog from '@sorare/core/src/components/dialog';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { useLocationChanged } from '@sorare/core/src/hooks/useLocationChanged';

import BuyTokenConfirmationById from '@marketplace/components/buyActions/BuyTokenConfirmationById';
import BuyPrimaryOfferConfirmationById from '@marketplace/components/primaryOffer/BuyPrimaryOfferConfirmationById';

import BuyConfirmationContextProvider, {
  BuyConfirmationProviderStateProps,
} from '.';

const Body = styled.div`
  padding: var(--triple-unit);
`;

type Props = {
  children?: ReactNode;
};
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
          maxWidth="sm"
          fullWidth
          onClose={onClose}
          fullScreen={!upTablet}
          disablePortal
          body={
            <Body>
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
            </Body>
          }
        />
      </Suspense>
      {children}
    </BuyConfirmationContextProvider>
  );
};

export default BuyConfirmationProvider;

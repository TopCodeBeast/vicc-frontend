import { gql } from '@apollo/client';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { Props as ButtonProps } from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Title5 } from '@sorare/core/src/atoms/typography';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useEventContext } from '@sorare/core/src/contexts/event';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';
import useLoggedCallback from '@sorare/core/src/hooks/useLoggedCallback';
import { Currency } from '@sorare/core/src/lib/currency';
import { glossary, payment } from '@sorare/core/src/lib/glossary';

import LazyPaymentProvider from '@marketplace/components/buyActions/LazyPaymentProvider';
import PrimaryOfferTokensSummary from '@marketplace/components/primaryOffer/PrimaryOfferTokensSummary';
import { useMarketplaceContext } from '@marketplace/contexts/Marketplace';
import { useBuyConfirmationContext } from '@marketplace/contexts/buyingConfirmation';
import useAcceptOffer from '@marketplace/hooks/offers/useAcceptOffer';
import { useMarketplaceEvents } from '@marketplace/lib/events';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import BuyPrimaryOfferConfirmation from '../BuyPrimaryOfferConfirmation';
import { PrimaryOfferBuyField_primaryOffer } from './__generated__/index.graphql';

interface Props {
  primaryOffer: PrimaryOfferBuyField_primaryOffer;
}

const PriceWrapper = styled.div`
  text-align: right;
`;

export const PrimaryOfferBuyField = ({
  primaryOffer,
  ...rest
}: Props & ButtonProps) => {
  const { id, nfts, priceFiat, priceWei } = primaryOffer;
  const [paymentStarted, setPaymentStarted] = useState(false);
  const track = useMarketplaceEvents();
  const { setShowBuyingConfirmation } = useBuyConfirmationContext();
  const acceptOffer = useAcceptOffer();
  const { trackClickBuy } = useMarketplaceContext();
  const { convertFromWei } = useCurrencyConverters();
  const trackingContext = useEventContext();

  const {
    currency,
    fiatCurrency: { code },
  } = useCurrentUserContext();

  const onPaymentSuccess = useCallback(() => {
    setShowBuyingConfirmation(true);
  }, [setShowBuyingConfirmation]);

  const buyWithEth = async ({
    conversionCreditId,
    supportedCurrency,
  }: {
    conversionCreditId?: string;
    supportedCurrency: SupportedCurrency;
  }) => {
    const errors = await acceptOffer({
      offerId: id,
      receiveTokens: nfts,
      conversionCreditId,
      supportedCurrency,
    });
    if (!errors || errors.length === 0) {
      return onPaymentSuccess();
    }
    return { err: errors };
  };

  const onBuyButtonClick = useLoggedCallback(() => {
    setPaymentStarted(true);
    trackClickBuy(
      id,
      priceWei,
      convertFromWei(priceWei, 'EUR'),
      nfts.map(nft => nft.assetId),
      nfts[0].sport,
      trackingContext?.subPath
    );
  });

  const onPaymentSuccessWithTracking = () => {
    track('Starter Bundles Payment successful');
    setPaymentStarted(false);
    onPaymentSuccess();
  };

  const referenceCurrency =
    currency === Currency.ETH
      ? SupportedCurrency.WEI
      : (code as SupportedCurrency);

  const OrderSummaryComponent = useCallback(
    ({ isFiat }: { isFiat: boolean }) => (
      <PrimaryOfferTokensSummary
        tokens={nfts}
        price={
          <PriceWrapper>
            <AmountWithConversion
              monetaryAmount={{
                wei: priceWei,
                ...priceFiat,
                referenceCurrency,
              }}
              primaryCurrency={isFiat ? Currency.FIAT : Currency.ETH}
              hideExponent
              column
            />
          </PriceWrapper>
        }
      />
    ),
    [nfts, priceFiat, priceWei, referenceCurrency]
  );

  return (
    <>
      <LoadingButton
        color="blue"
        onClick={() => {
          onBuyButtonClick(null);
        }}
        loading={paymentStarted}
        {...rest}
      >
        <FormattedMessage {...glossary.buy} />
      </LoadingButton>
      {paymentStarted && (
        <LazyPaymentProvider
          paymentProps={{
            canChangeRefCurrency: true,
            objectId: id,
            onSuccess: onPaymentSuccessWithTracking,
            onSubmit: buyWithEth,
            price: {
              referenceCurrency,
              wei: priceWei,
              ...priceFiat,
            },
            cta: payment.confirmAndPay,
            canUseConversionCredit: true,
            currencies: [Currency.FIAT, Currency.ETH],
            sport: nfts[0].sport,
          }}
          paymentBoxProps={{
            onClose: () => setPaymentStarted(false),
            hideFees: true,
            hideSubtotal: true,
            title: (
              <Title5>
                <FormattedMessage {...payment.paymentBoxTitle} />
              </Title5>
            ),
            OrderSummary: OrderSummaryComponent,
            customAmountDisplay: null,
            confirmationProviderStateProps: {
              primaryOfferId: id,
            },
          }}
        />
      )}
    </>
  );
};

PrimaryOfferBuyField.fragments = {
  primaryOffer: gql`
    fragment PrimaryOfferBuyField_primaryOffer on TokenPrimaryOffer {
      id
      priceWei
      priceFiat {
        eur
        usd
        gbp
      }
      nfts {
        assetId
        slug
        sport
        ...useAcceptOffer_token
        ...PrimaryOfferTokensSummary_token
      }
      ...BuyPrimaryOfferConfirmation_primaryOffer
    }
    ${useAcceptOffer.fragments.token}
    ${PrimaryOfferTokensSummary.fragments.token}
    ${BuyPrimaryOfferConfirmation.fragments.primaryOffer}
  `,
};

export default PrimaryOfferBuyField;

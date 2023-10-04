import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { Props as ButtonProps } from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Title5 } from '@sorare/core/src/atoms/typography';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { useEventContext } from '@sorare/core/src/contexts/event';
import useLoggedCallback from '@sorare/core/src/hooks/useLoggedCallback';
import useMangopayCreditCardsEnabled from '@sorare/core/src/hooks/useMangopayCreditCardsEnabled';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import { Currency } from '@sorare/core/src/lib/currency';
import { glossary, payment } from '@sorare/core/src/lib/glossary';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import LazyPaymentProvider from '@marketplace/components/buyActions/LazyPaymentProvider';
import PrimaryOfferTokensSummary from '@marketplace/components/primaryOffer/PrimaryOfferTokensSummary';
import { useMarketplaceContext } from '@marketplace/contexts/Marketplace';
import { useBuyConfirmationContext } from '@marketplace/contexts/buyingConfirmation';
import useAcceptOffer from '@marketplace/hooks/offers/useAcceptOffer';
import { useMarketplaceEvents } from '@marketplace/lib/events';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import BuyPrimaryOfferConfirmation from '../BuyPrimaryOfferConfirmation';
import { PrimaryOfferBuyField_primaryOffer } from './__generated__/index.graphql';
import usePollPrimaryOfferBuyer from './usePollPrimaryOfferBuyer';

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
  const { id, nfts, price } = primaryOffer;
  const { toMonetaryAmount } = useMonetaryAmount();
  const [paymentStarted, setPaymentStarted] = useState(false);
  const track = useMarketplaceEvents();
  const { setShowBuyingConfirmation } = useBuyConfirmationContext();
  const acceptOffer = useAcceptOffer();
  const { trackClickBuy } = useMarketplaceContext();
  const trackingContext = useEventContext();
  const [polling, setPolling] = useState(false);
  const [pollIsLoading, setPollIsLoading] = useState(false);
  const [timeoutPolling, setTimeoutPolling] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const onPaymentSuccess = useCallback(() => {
    setPaymentStarted(false);
    setShowBuyingConfirmation(true);
  }, [setShowBuyingConfirmation]);

  const onPaymentSuccessWithTracking = () => {
    track('Starter Bundles Payment successful');
    onPaymentSuccess();
  };

  const onPollingEnd = (success: boolean) => {
    setPolling(false);
    if (timeoutPolling) clearTimeout(timeoutPolling);
    if (success) onPaymentSuccessWithTracking();
    setPollIsLoading(false);
  };

  usePollPrimaryOfferBuyer(polling, primaryOffer, onPollingEnd);
  const useMangopayCreditCards = useMangopayCreditCardsEnabled();

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

  const priceMonetaryAmount = toMonetaryAmount(price);
  const onBuyButtonClick = useLoggedCallback(() => {
    setPaymentStarted(true);
    trackClickBuy(
      id,
      priceMonetaryAmount.wei,
      priceMonetaryAmount.eur / 100,
      nfts.map(nft => nft.assetId),
      nfts[0].sport,
      trackingContext?.subPath
    );
  });

  // For mangopay, we do not know if the 3DS has failed or not. We need to fetch the primary offer and check buyer
  const onPaymentSuccessWrapper = () => {
    if (useMangopayCreditCards) {
      setPollIsLoading(true);
      setPolling(true);
      setTimeoutPolling(
        setTimeout(() => {
          setPolling(false);
          setPollIsLoading(false);
        }, 10000)
      );
    } else {
      onPaymentSuccessWithTracking();
    }
  };

  const OrderSummaryComponent = useCallback(
    ({ isFiat }: { isFiat: boolean }) => (
      <PrimaryOfferTokensSummary
        tokens={nfts}
        price={
          <PriceWrapper>
            <AmountWithConversion
              monetaryAmount={price}
              primaryCurrency={isFiat ? Currency.FIAT : Currency.ETH}
              hideExponent
              column
            />
          </PriceWrapper>
        }
      />
    ),
    [nfts, price]
  );

  return (
    <>
      <LoadingButton
        color="blue"
        onClick={() => {
          onBuyButtonClick(null);
        }}
        loading={paymentStarted || pollIsLoading}
        {...rest}
      >
        <FormattedMessage {...glossary.buy} />
      </LoadingButton>
      {paymentStarted && (
        <LazyPaymentProvider
          paymentProps={{
            canChangeRefCurrency: true,
            objectId: id,
            onSuccess: onPaymentSuccessWrapper,
            onSubmit: buyWithEth,
            price,
            cta: payment.confirmAndPay,
            canUseConversionCredit: true,
            currencies: [Currency.FIAT, Currency.ETH],
            sport: nfts[0].sport,
          }}
          paymentBoxProps={{
            loadingPolling: polling,
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
    fragment PrimaryOfferBuyField_primaryOffer on Offer {
      id
      price {
        ...MonetaryAmountFragment_monetaryAmount
      }
      nfts {
        assetId
        slug
        sport
        ...useAcceptOffer_token
        ...PrimaryOfferTokensSummary_token
      }
      ...BuyPrimaryOfferConfirmation_primaryOffer
      ...usePollPrimaryOfferBuyer_primaryOffer
    }
    ${monetaryAmountFragment}
    ${useAcceptOffer.fragments.token}
    ${PrimaryOfferTokensSummary.fragments.token}
    ${BuyPrimaryOfferConfirmation.fragments.primaryOffer}
    ${usePollPrimaryOfferBuyer.fragments.primaryOffer}
  ` as TypedDocumentNode<PrimaryOfferBuyField_primaryOffer>,
};

export default PrimaryOfferBuyField;

import { gql } from '@apollo/client';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { Props as ButtonProps } from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Text14, Text16, Title5 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useEventContext } from '@sorare/core/src/contexts/event';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';
import useLoggedCallback from '@sorare/core/src/hooks/useLoggedCallback';
import { Currency } from '@sorare/core/src/lib/currency';
import { glossary, payment } from '@sorare/core/src/lib/glossary';

import LazyPaymentProvider from 'components/buyActions/LazyPaymentProvider';
import PrimaryOfferTokensSummary from 'components/primaryOffer/PrimaryOfferTokensSummary';
import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';
import { useBuyConfirmationContext } from '@sorare/marketplace/src/contexts/buyingConfirmation';
import useAcceptOffer from 'hooks/offers/useAcceptOffer';
import { useMarketplaceEvents } from '@sorare/marketplace/src/lib/events';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import BuyPrimaryOfferConfirmation from '../BuyPrimaryOfferConfirmation';
import { PrimaryOfferBuyField_primaryOffer } from './__generated__/index.graphql';

type PrimaryOfferBuyField_primaryOffer_priceFiat =
  PrimaryOfferBuyField_primaryOffer['priceFiat'];

interface Props {
  primaryOffer: PrimaryOfferBuyField_primaryOffer;
}

type LowercaseCurrencyCode = keyof Omit<
  PrimaryOfferBuyField_primaryOffer_priceFiat,
  '__typename'
>;

const PriceWrapper = styled.div`
  text-align: right;
`;

export const PrimaryOfferBuyField = ({
  primaryOffer,
  ...rest
}: Props & ButtonProps) => {
  const { id, nfts, priceFiat, priceWei } = primaryOffer;
  const [paymentStarted, setPaymentStarted] = useState(false);
  const { formatNumber, formatWei } = useIntlContext();
  const track = useMarketplaceEvents();
  const {
    fiatCurrency: { code: preferredCurrencyCode },
  } = useCurrentUserContext();
  const { setShowBuyingConfirmation } = useBuyConfirmationContext();
  const acceptOffer = useAcceptOffer();
  const { trackClickBuy } = useMarketplaceContext();
  const { convertFromWei } = useCurrencyConverters();
  const trackingContext = useEventContext();

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

  const price = formatNumber(
    priceFiat[preferredCurrencyCode.toLowerCase() as LowercaseCurrencyCode] /
      100,
    {
      style: 'currency',
      currency: preferredCurrencyCode,
    }
  );

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

  const ethAmount = formatWei(priceWei);

  const customAmountDisplay = (
    <PriceWrapper>
      <Text16 bold color="var(--c-neutral-1000)">
        {price}
      </Text16>
      <Text14 color="var(--c-neutral-600)">{ethAmount}</Text14>
    </PriceWrapper>
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
            objectId: id,
            onSuccess: onPaymentSuccessWithTracking,
            onSubmit: buyWithEth,
            priceInWei: priceWei,
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
            orderSummary: (
              <PrimaryOfferTokensSummary
                tokens={nfts}
                price={customAmountDisplay}
              />
            ),
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

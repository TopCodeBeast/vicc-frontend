import { gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';
import { ReactElement, ReactNode, useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import LoadingButton, {
  Props as LoadingButtonProps,
} from '@sorare/core/src/atoms/buttons/LoadingButton';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Title5 } from '@sorare/core/src/atoms/typography';
import { useEventContext } from '@sorare/core/src/contexts/event';
import { fragments as analyticsFragments } from '@sorare/core/src/contexts/events/types';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';
import useLoggedCallback from '@sorare/core/src/hooks/useLoggedCallback';
import useTokenOfferBelongsToUser from '@sorare/core/src/hooks/useTokenOfferBelongsToUser';
import { Currency } from '@sorare/core/src/lib/currency';
import { glossary, payment } from '@sorare/core/src/lib/glossary';

import BuyOnAuctionPoweredByAlgolia from 'components/buyActions/BuyOnAuction';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import BuyTokenConfirmation from 'components/buyActions/BuyTokenConfirmation';
import BuyTokenSummary from 'components/buyActions/BuyTokenSummary';
import CancelOffer from 'components/buyActions/CancelOffer';
import LazyPaymentProvider from 'components/buyActions/LazyPaymentProvider';
import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';
import { useBuyConfirmationContext } from '@sorare/marketplace/src/contexts/buyingConfirmation';
import useAcceptOffer from 'hooks/offers/useAcceptOffer';
import useCannotBuy from 'hooks/offers/useCannotBuy';

import { BuyField_token } from './__generated__/index.graphql';

export interface Props {
  color?: LoadingButtonProps['color'];
  cancelColor?: LoadingButtonProps['color'];
  token: BuyField_token;
  stroke?: boolean;
  medium?: boolean;
  small?: boolean;
  cancelStroke?: boolean;
  buttonLabel?: ReactNode;
  onSuccess?: (token: BuyField_token) => void;
  renderButton?: (props: Partial<LoadingButtonProps>) => ReactElement;
}

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  overflow: visible;
`;
const Buy = styled(LoadingButton)`
  flex-shrink: 0;
  width: 100%;
`;
const BuyTooltip = styled(Tooltip)`
  width: 100%;
`;

const BuyField = ({
  token,
  medium,
  small,
  stroke,
  onSuccess,
  color = 'green',
  cancelStroke = true,
  buttonLabel = <FormattedMessage {...glossary.buy} />,
  renderButton,
}: Props) => {
  const { liveSingleSaleOffer, myMintedSingleSaleOffer } = token;
  const { convertFromWei } = useCurrencyConverters();
  const { setShowBuyingConfirmation } = useBuyConfirmationContext();
  const belongsToUser = useTokenOfferBelongsToUser();
  const acceptOffer = useAcceptOffer();
  const cannotBuy = useCannotBuy();
  const cannotBuyToken = cannotBuy(token);
  const { formatMessage } = useIntl();

  const [paymentStarted, setPaymentStarted] = useState<boolean>(false);
  const loggedTogglePaymentStarted = useLoggedCallback<boolean>(b =>
    setPaymentStarted(b)
  );
  const { trackClickBuy } = useMarketplaceContext();
  const trackingContext = useEventContext();
  const onPaymentSuccess = useCallback(() => {
    setPaymentStarted(false);
    setShowBuyingConfirmation(true);
    if (onSuccess) {
      onSuccess(token);
    }
  }, [setShowBuyingConfirmation, onSuccess, token]);

  // Give the possibility for owner of the card to cancel his offer before it is live
  if (myMintedSingleSaleOffer && belongsToUser(myMintedSingleSaleOffer))
    return (
      <Root>
        <CancelOffer
          color="red"
          medium={medium}
          small={small}
          token={token}
          stroke={cancelStroke}
        />
      </Root>
    );

  // Don't show the offer to users if it is not live yet
  if (!liveSingleSaleOffer?.blockchainId) return null;

  const { id, priceWei, creditCardFee, endDate } = liveSingleSaleOffer;

  // Don't show the button if the offer expired
  if (isPast(parseISO(endDate))) return null;

  const buyWithEth = async ({
    supportedCurrency,
  }: {
    supportedCurrency: SupportedCurrency;
  }) => {
    const errors = await acceptOffer({
      offerId: id,
      supportedCurrency,
      receiveTokens: [],
    });
    if (!errors || errors.length === 0) {
      return onPaymentSuccess();
    }
    return { err: errors };
  };

  const onClick = () => {
    trackClickBuy(
      id,
      priceWei,
      convertFromWei(priceWei, 'EUR'),
      [token.assetId],
      token.sport,
      trackingContext?.subPath
    );
    return loggedTogglePaymentStarted(true);
  };

  return (
    <>
      <Root>
        <BuyTooltip title={cannotBuyToken ? formatMessage(cannotBuyToken) : ''}>
          {renderButton ? (
            renderButton({
              onClick,
              loading: paymentStarted,
              disabled: Boolean(cannotBuyToken),
            })
          ) : (
            <Buy
              stroke={stroke}
              color={color}
              onClick={onClick}
              medium={medium}
              small={small}
              loading={paymentStarted}
              disabled={Boolean(cannotBuyToken)}
            >
              {buttonLabel}
            </Buy>
          )}
        </BuyTooltip>
      </Root>
      {paymentStarted && (
        <LazyPaymentProvider
          paymentProps={{
            objectId: id,
            onSuccess: onPaymentSuccess,
            onSubmit: buyWithEth,
            priceInWei: priceWei,
            cta: payment.confirmAndPay,
            creditCardFee,
            currencies: [Currency.ETH],
            buyOnAuctionPoweredByAlgolia: (
              <BuyOnAuctionPoweredByAlgolia
                sport={token.sport}
                playerSlug={token.metadata.playerSlug}
                rarity={token.metadata.rarity}
              />
            ),
            sport: token.sport,
          }}
          paymentBoxProps={{
            onClose: () => setPaymentStarted(false),
            title: (
              <Title5>
                <FormattedMessage {...payment.paymentBoxTitle} />
              </Title5>
            ),
            orderSummary: <BuyTokenSummary token={token} />,
            confirmationProviderStateProps: {
              tokenOfferId: token?.liveSingleSaleOffer?.id,
            },
          }}
        />
      )}
    </>
  );
};

BuyField.fragments = {
  token: gql`
    fragment BuyField_token on Token {
      assetId
      slug
      name
      sport
      ...Analytics_tokenInfo
      metadata {
        ... on TokenBaseballMetadata {
          id
        }
        ... on TokenFootballMetadata {
          id
        }
        ... on TokenCardMetadataInterface {
          rarity
          playerSlug
        }
      }
      liveSingleSaleOffer {
        id
        blockchainId
        priceWei
        creditCardFee
        endDate
        sender {
          ... on User {
            slug
            nickname
          }
        }
        ...BuyTokenConfirmation_tokenOffer
      }
      myMintedSingleSaleOffer {
        id
        ...useTokenOfferBelongsToUser_offer
      }
      ...CancelOffer_token
      ...BuyTokenSummary_token
      ...useCannotBuy_token
    }
    ${useTokenOfferBelongsToUser.fragments.offer}
    ${CancelOffer.fragments.token}
    ${analyticsFragments.tokenInfo}
    ${BuyTokenSummary.fragments.token}
    ${BuyTokenConfirmation.fragments.tokenOffer}
    ${useCannotBuy.fragments.token}
  `,
};

export default BuyField;

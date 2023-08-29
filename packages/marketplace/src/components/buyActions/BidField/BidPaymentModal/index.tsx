import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { Title5 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { Currency } from '@sorare/core/src/lib/currency';
import { isType } from '@sorare/core/src/lib/gql';
import { getMonetaryAmountIndex } from '@sorare/core/src/lib/monetaryAmount';

import BidBundleSummary from '@marketplace/components/buyActions/BidBundleSummary';
import BidTokenSummary from '@marketplace/components/buyActions/BidTokenSummary';
import LazyPaymentProvider from '@marketplace/components/buyActions/LazyPaymentProvider';
import { fragments as paymentProviderFragments } from '@marketplace/components/buyActions/PaymentProvider/fragments';
import useBestBidBelongsToUser from '@marketplace/hooks/auctions/useBestBidBelongsToUser';
import useBidWithWallet from '@marketplace/hooks/auctions/useBidWithWallet';
import { auctionMinNextBid } from '@marketplace/lib/auctions';

import {
  BidPaymentModal_auction,
  BidPaymentModal_token,
} from './__generated__/index.graphql';
import usePollAuctionBestBid from './usePollAuctionBestBid';

export const messages = defineMessages({
  bid: { id: 'BidField.bid', defaultMessage: 'Bid' },
  confirmBid: { id: 'BidField.confirmBid', defaultMessage: 'Confirm bid' },
  increaseBid: { id: 'BidField.increaseBid', defaultMessage: 'Increase bid' },
  autoBid: { id: 'BidPaymentModal.autoBid', defaultMessage: 'Set max bid' },
});

type Props = {
  auction: BidPaymentModal_auction;
  tokens: BidPaymentModal_token[];
  onSuccess: () => void;
  onClose: () => void;
};

const BidPaymentModal = ({ auction, tokens, onSuccess, onClose }: Props) => {
  const [polling, setPolling] = useState(false);
  const [outBidByAutoBid, setOutBidByAutoBid] = useState(false);
  const [outBidCallback, setOutBidCallback] =
    useState<(amount: string) => void>();

  const [fiatPaymentMonetaryAmount, setFiatPaymentMonetaryAmount] =
    useState<MonetaryAmountOutput | null>(null);
  const [timeoutPolling, setTimeoutPolling] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const {
    walletPreferences: { showEthWallet },
  } = useCurrentUserContext();

  const doesBestBidBelongsToUser = useBestBidBelongsToUser();
  const bidWithWallet = useBidWithWallet(auction);

  const onPollingEnd = (winning: boolean) => {
    setPolling(false);
    if (timeoutPolling) clearTimeout(timeoutPolling);

    if (!winning) {
      setOutBidByAutoBid(true);
      if (outBidCallback) outBidCallback(auction.minNextBid);
    } else {
      onSuccess();
    }
  };

  usePollAuctionBestBid(
    polling,
    auction,
    fiatPaymentMonetaryAmount,
    onPollingEnd
  );

  const onSuccessWithFiat = useCallback(
    (monetaryAmount?: MonetaryAmountOutput) => {
      if (auction.autoBid && monetaryAmount) {
        setFiatPaymentMonetaryAmount(monetaryAmount);
        setPolling(true);
        setTimeoutPolling(
          setTimeout(() => {
            setPolling(false);
            onSuccess();
          }, 10000)
        );
      } else {
        onSuccess();
      }
    },
    [auction, onSuccess]
  );

  const onSuccessWithWallet = useCallback(
    (updatedAuction: any) => {
      if (auction.autoBid) {
        const hasBeenOutBid =
          updatedAuction.bestBid &&
          !doesBestBidBelongsToUser(updatedAuction.bestBid);
        if (hasBeenOutBid) {
          setOutBidByAutoBid(true);
          if (outBidCallback) outBidCallback(updatedAuction.minNextBid);
          return;
        }
      }
      onSuccess();
    },
    [auction, outBidCallback, onSuccess, doesBestBidBelongsToUser]
  );

  const bid = useCallback(
    async ({
      supportedCurrency,
      monetaryAmount,
      conversionCreditId,
    }: {
      supportedCurrency: SupportedCurrency;
      monetaryAmount: MonetaryAmountOutput;
      conversionCreditId?: string;
    }) => {
      const monetaryAmountIndex = getMonetaryAmountIndex(supportedCurrency);
      const newBid: any = await bidWithWallet({
        supportedCurrency,
        bidAmountWei: monetaryAmount.wei,
        amount:
          supportedCurrency === SupportedCurrency.WEI
            ? monetaryAmount.wei
            : monetaryAmount[monetaryAmountIndex].toString(),
        conversionCreditId,
      });
      if (newBid && '__typename' in newBid && isType(newBid, 'TokenBid')) {
        onSuccessWithWallet(newBid?.auction);
      }
    },
    [bidWithWallet, onSuccessWithWallet]
  );

  const OrderSummaryComponent = useCallback(() => {
    if (tokens.length > 1) return <BidBundleSummary tokens={tokens} />;
    return <BidTokenSummary token={tokens[0]} />;
  }, [tokens]);

  const minNextBid = auctionMinNextBid(auction);

  const confirmMessage =
    auction?.bestBid && doesBestBidBelongsToUser(auction?.bestBid)
      ? messages.increaseBid
      : messages.confirmBid;

  return (
    <LazyPaymentProvider
      paymentProps={{
        auction,
        objectId: auction.id,
        onSuccess: onSuccessWithFiat,
        onSubmit: bid,
        price: {
          [auction.currency.toLowerCase()]: minNextBid,
          referenceCurrency: auction.currency,
        },
        cta: confirmMessage,
        creditCardFee: auction.creditCardFee,
        canUseConversionCredit: true,
        currencies: [Currency.FIAT, ...(showEthWallet ? [Currency.ETH] : [])],
        sport: tokens[0].sport,
      }}
      paymentBoxProps={{
        hideSummaryTable: true,
        onClose,
        title: (
          <Title5>
            <FormattedMessage
              id="BidPaymentModal.title"
              defaultMessage="Place your bid"
            />
          </Title5>
        ),
        OrderSummary: OrderSummaryComponent,
        loadingPolling: polling,
        outBidByAutoBid,
        setOutBidCallback,
      }}
    />
  );
};

BidPaymentModal.fragments = {
  token: gql`
    fragment BidPaymentModal_token on Token {
      assetId
      slug
      ...BidTokenSummary_token
      ...BidBundleSummary_token
    }
    ${BidTokenSummary.fragments.token}
    ${BidBundleSummary.fragments.token}
  ` as TypedDocumentNode<BidPaymentModal_token>,
  auction: gql`
    fragment BidPaymentModal_auction on TokenAuction {
      id
      autoBid
      open
      cancelled
      bidsCount
      minNextBid
      privateMinNextBid
      creditCardFee
      currency
      bestBid {
        id
        ...UseBestBidBelongsToUser_bestBid
      }
      ...useBidWithWallet_auction
      ...usePollAuctionBestBid_auction
      ...PaymentProvider_auction
    }
    ${useBidWithWallet.fragments.auction}
    ${useBestBidBelongsToUser.fragments.bestBid}
    ${usePollAuctionBestBid.fragments.auction}
    ${paymentProviderFragments.auction}
  ` as TypedDocumentNode<BidPaymentModal_auction>,
};
export default BidPaymentModal;

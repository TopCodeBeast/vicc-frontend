import { gql } from '@apollo/client';
import { useCallback, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { Title5 } from '@sorare/core/src/atoms/typography';
import { useWalletPreferences } from '@sorare/core/src/hooks/wallets/useWalletPreferences';
import { Currency } from '@sorare/core/src/lib/currency';
import { isA } from '@sorare/core/src/lib/gql';

import BidBundleSummary from 'components/buyActions/BidBundleSummary';
import BidTokenSummary from 'components/buyActions/BidTokenSummary';
import LazyPaymentProvider from 'components/buyActions/LazyPaymentProvider';
import { fragments as paymentProviderFragments } from 'components/buyActions/PaymentProvider/fragments';
import { BidWithWalletMutation } from 'hooks/auctions/__generated__/useBidWithWallet.graphql';
import useBestBidBelongsToUser from 'hooks/auctions/useBestBidBelongsToUser';
import useBidWithWallet from 'hooks/auctions/useBidWithWallet';
import { auctionMinNextBid } from '@sorare/marketplace/src/lib/auctions';

import {
  BidPaymentModal_auction,
  BidPaymentModal_token,
} from './__generated__/index.graphql';
import usePollAuctionBestBid from './usePollAuctionBestBid';

type BidWithWalletMutation_bid_tokenBid = NonNullable<
  NonNullable<BidWithWalletMutation['bid']>['tokenBid']
>;

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
  const [stripeWeiAmount, setStripeWeiAmount] = useState<string>('');
  const [timeoutPolling, setTimeoutPolling] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const { showEthWallet } = useWalletPreferences();
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

  usePollAuctionBestBid(polling, auction, stripeWeiAmount, onPollingEnd);

  const onSuccessWithFiat = useCallback(
    (weiAmount?: string) => {
      if (auction.autoBid && weiAmount) {
        setStripeWeiAmount(weiAmount);
        setPolling(true);
        setTimeoutPolling(
          setTimeout(() => {
            setPolling(false);
            onSuccess();
          }, 2000)
        );
      } else {
        onSuccess();
      }
    },
    [auction, onSuccess]
  );

  const onSuccessWithWallet = useCallback(
    updatedAuction => {
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
      weiAmount,
      totalFiatAmountInCents,
      conversionCreditId,
    }: {
      supportedCurrency: SupportedCurrency;
      weiAmount: string;
      totalFiatAmountInCents: string;
      conversionCreditId?: string;
    }) => {
      const newBid = await bidWithWallet({
        supportedCurrency,
        bidAmountWei: weiAmount,
        amount:
          supportedCurrency === SupportedCurrency.WEI
            ? weiAmount
            : totalFiatAmountInCents,
        conversionCreditId,
      });
      if (
        newBid &&
        '__typename' in newBid &&
        isA<BidWithWalletMutation_bid_tokenBid>('TokenBid', newBid)
      ) {
        onSuccessWithWallet(newBid?.auction);
      }
    },
    [bidWithWallet, onSuccessWithWallet]
  );

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
        priceInWei: minNextBid,
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
        orderSummary:
          tokens.length > 1 ? (
            <BidBundleSummary tokens={tokens} />
          ) : (
            <BidTokenSummary token={tokens[0]} />
          ),
        loadingBid: polling,
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
  `,
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
      autoBid
      bestBid {
        id
        amount
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
  `,
};
export default BidPaymentModal;

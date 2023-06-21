import { gql } from '@apollo/client';
import { useState } from 'react';
import { defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Color } from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { useEventContext } from '@sorare/core/src/contexts/event';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useLoggedCallback from '@sorare/core/src/hooks/useLoggedCallback';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';

import usePollAuction from '@marketplace/components/auction/usePollAuction';
import { useMarketplaceContext } from '@marketplace/contexts/Marketplace';
import useBestBidBelongsToUser from '@marketplace/hooks/auctions/useBestBidBelongsToUser';
import useCannotTrade from '@marketplace/hooks/offers/useCannotTrade';
import { auctionMinNextBid } from '@marketplace/lib/auctions';

import BidBundleSummary from '../BidBundleSummary';
import BidTokenSummary from '../BidTokenSummary';
import BidConfirmedDialog from './BidConfirmedDialog';
import BidPaymentModal from './BidPaymentModal';
import {
  BidField_auction,
  BidField_token,
} from './__generated__/index.graphql';

type BidFieldProps = {
  auction: BidField_auction;
  tokens: BidField_token[];
  medium?: boolean;
  small?: boolean;
  stroke?: boolean;
  color?: Color;
};

export const messages = defineMessages({
  increaseBid: { id: 'BidField.increase', defaultMessage: 'Increase bid' },
  placeBid: { id: 'BidField.placeBid', defaultMessage: 'Place bid' },
});

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  overflow: visible;
`;
const ActivateButton = styled(LoadingButton)`
  flex-shrink: 0;
  width: 100%;
`;
const ActivateButtonTooltip = styled(Tooltip)`
  width: 100%;
`;

const BidField = ({
  auction,
  tokens,
  medium,
  small,
  stroke,
  color = 'blue',
}: BidFieldProps) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  usePollAuction(auction);
  const [showBidConfirmationModal, setShowBidConfirmationModal] =
    useState(false);
  const { open, cancelled } = auction;
  const { trackClickBid } = useMarketplaceContext();
  const cannotTrade = useCannotTrade();
  const cannotTradeToken = cannotTrade();

  const { formatMessage } = useIntlContext();
  const doesBestBidBelongsToUser = useBestBidBelongsToUser();
  const [paymentStarted, setPaymentStarted] = useState(false);
  const trackingContext = useEventContext();

  const bestBidBelongsToUser =
    auction?.bestBid && doesBestBidBelongsToUser(auction.bestBid);

  const loggedTogglePaymentStarted = useLoggedCallback<boolean>(b =>
    setPaymentStarted(b)
  );

  if (!bestBidBelongsToUser && showBidConfirmationModal)
    setShowBidConfirmationModal(false);

  if (!open || cancelled) return null;

  const minNextBid = auctionMinNextBid(auction);

  const minNextBidMonetary = toMonetaryAmount({
    [auction.currency.toLowerCase()]: minNextBid,
    referenceCurrency: auction.currency,
  });

  return (
    <Root>
      <ActivateButtonTooltip
        title={cannotTradeToken ? formatMessage(cannotTradeToken) : ''}
      >
        <ActivateButton
          stroke={stroke}
          color={color}
          medium={medium}
          small={small}
          disabled={Boolean(cannotTradeToken)}
          onClick={() => {
            trackClickBid(
              auction,
              minNextBidMonetary,
              tokens.map(token => token.assetId),
              tokens[0].sport,
              trackingContext?.subPath
            );
            return loggedTogglePaymentStarted(true);
          }}
          loading={paymentStarted}
        >
          {formatMessage(
            bestBidBelongsToUser || auction.myLastBid
              ? messages.increaseBid
              : messages.placeBid
          )}
        </ActivateButton>
      </ActivateButtonTooltip>
      {paymentStarted && (
        <BidPaymentModal
          auction={auction}
          tokens={tokens}
          onSuccess={() => {
            setShowBidConfirmationModal(true);
            setPaymentStarted(false);
          }}
          onClose={() => setPaymentStarted(false)}
        />
      )}
      <BidConfirmedDialog
        onClose={() => {
          setShowBidConfirmationModal(false);
        }}
        assetsPreview={
          tokens.length > 1 ? (
            <BidBundleSummary tokens={tokens} />
          ) : (
            <BidTokenSummary withoutRecentSales token={tokens[0]} />
          )
        }
        auction={auction}
        open={showBidConfirmationModal}
      />
    </Root>
  );
};

BidField.fragments = {
  token: gql`
    fragment BidField_token on Token {
      assetId
      slug
      sport
      ...BidPaymentModal_token
      ...BidTokenSummary_token
      ...BidBundleSummary_token
    }
    ${BidPaymentModal.fragments.token}
    ${BidTokenSummary.fragments.token}
    ${BidBundleSummary.fragments.token}
  `,
  auction: gql`
    fragment BidField_auction on TokenAuction {
      id
      blockchainId
      open
      cancelled
      bidsCount
      minNextBid
      privateMinNextBid
      currency
      creditCardFee
      myLastBid {
        id
      }
      bestBid {
        id
        bidder {
          ... on User {
            slug
          }
        }
        ...UseBestBidBelongsToUser_bestBid
      }
      ...BidPaymentModal_auction
      ...UsePollAuction_auction
      ...BidConfirmedDialogContent_tokenAuction
    }
    ${useBestBidBelongsToUser.fragments.bestBid}
    ${BidConfirmedDialog.fragments.tokenAuction}
    ${BidPaymentModal.fragments.auction}
    ${usePollAuction.fragments.auction}
  `,
};

export default BidField;

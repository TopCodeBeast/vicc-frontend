import { TypedDocumentNode, gql } from '@apollo/client';
import Big from 'bignumber.js';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { MonetaryAmount } from '@sorare/core/src/__generated__/globalTypes';
import Block from '@sorare/core/src/atoms/layout/Block';
import ButtonWithConfirmDialog from '@sorare/core/src/components/form/ButtonWithConfirmDialog';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';
import { breakpoints, tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import BidInfos from '@marketplace/components/auction/BidInfos';
import BidField from '@marketplace/components/buyActions/BidField';
import useBestBidBelongsToUser from '@marketplace/hooks/auctions/useBestBidBelongsToUser';
import useStopAutoBid from '@marketplace/hooks/auctions/useStopAutoBid';
import useTokenTakesPartPromotionalEvent from '@marketplace/hooks/offers/useTokenTakesPartPromotionalEvent';

import { OpenAuction_auction } from './__generated__/index.graphql';

const Root = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);

  @media ${tabletAndAbove} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;
const ButtonsContainer = styled.div`
  display: flex;
  gap: var(--unit);

  @media (max-width: ${breakpoints.tablet}px) {
    flex-direction: column;
    justify-content: space-between;
  }
`;
const StopButton = styled(ButtonWithConfirmDialog)`
  @media (max-width: ${breakpoints.tablet}px) {
    order: 1;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;

const messages = defineMessages({
  stopAutoBidConfirm: {
    id: 'OpenAuction.stopAutoBidConfirm',
    defaultMessage:
      'Are you sure you want to stop bidding on the auction? Your current bid of {amount} will remain but you will not auto-bid further.',
  },
});

interface Props {
  auction: OpenAuction_auction;
}

const Price = ({ monetaryAmount }: { monetaryAmount: MonetaryAmount }) => {
  const { main } = useAmountWithConversion({
    monetaryAmount,
  });

  return <b>{main}</b>;
};

export const OpenAuction = ({ auction }: Props) => {
  const takesPartInEvent = useTokenTakesPartPromotionalEvent();

  const { formatMessage } = useIntl();
  const bestBidBelongsToUser = useBestBidBelongsToUser();
  const stopAutoBid = useStopAutoBid(auction.bestBid!);

  if (!auction) return null;

  const { autoBid, bestBid, myBestBid } = auction;

  const willAutoBid =
    autoBid &&
    bestBid &&
    myBestBid &&
    bestBidBelongsToUser(bestBid) &&
    new Big(myBestBid.maximumAmounts.wei || 0).gt(bestBid.amounts.wei || 0);

  const ConfirmMessage = () => (
    <div>
      {formatMessage(messages.stopAutoBidConfirm, {
        amount: bestBid && <Price monetaryAmount={bestBid.amounts} />,
      })}
    </div>
  );

  const promotionalEvent = takesPartInEvent(auction.nfts);

  return (
    <Root>
      <Column>
        <BidInfos auction={auction} promotionalEvent={promotionalEvent} />
      </Column>
      <ButtonsContainer>
        {willAutoBid && (
          <StopButton
            color="red"
            message={<ConfirmMessage />}
            onConfirm={() => {
              stopAutoBid();
            }}
          >
            <FormattedMessage
              id="OpenAuction.stopAutoBid"
              defaultMessage="Stop"
            />
          </StopButton>
        )}
        <BidField auction={auction} tokens={auction.nfts} />
      </ButtonsContainer>
    </Root>
  );
};

OpenAuction.fragments = {
  auction: gql`
    fragment OpenAuction_auction on Auction {
      id
      cancelled
      autoBid
      bestBid {
        id
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        ...useStopAutoBid_bid
        ...UseBestBidBelongsToUser_bestBid
      }
      myBestBid {
        id
        maximumAmounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
      }
      ...BidField_auction
      ...BidInfos_auction
      nfts {
        assetId
        slug
        ...BidField_token
        ...useTokenTakesPartPromotionalEvent_token
      }
    }
    ${monetaryAmountFragment}
    ${BidField.fragments.auction}
    ${BidInfos.fragments.auction}
    ${BidField.fragments.token}
    ${useStopAutoBid.fragments.bid}
    ${useBestBidBelongsToUser.fragments.bestBid}
    ${useTokenTakesPartPromotionalEvent.fragments.token}
  ` as TypedDocumentNode<OpenAuction_auction>,
};

export default OpenAuction;

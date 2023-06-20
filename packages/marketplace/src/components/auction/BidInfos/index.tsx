import { gql } from '@apollo/client';
import Big from 'bignumber.js';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { MarketplacePromotionalEvent } from '@sorare/core/src/__generated__/globalTypes';
import {
  Text14,
  Text16,
  Title3,
  Title4,
} from '@sorare/core/src/atoms/typography';
import { ConversionCreditTinyBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditTinyBanner';
import useAmountWithConversion, {
  Props as UseAmountWithConversionProps,
} from '@sorare/core/src/hooks/useAmountWithConversion';
import { glossary } from '@sorare/core/src/lib/glossary';

import { ItemSpecialRewardBadge } from '@sorare/marketplace/src/components/ItemPreview/ItemSpecialRewardBadge';
import useBestBidBelongsToUser from '@sorare/marketplace/src/hooks/auctions/useBestBidBelongsToUser';

import AuctionTimeLeft from '../AuctionTimeLeft';
import { BidInfos_auction } from './__generated__/index.graphql';

type Props = {
  auction: BidInfos_auction;
  promotionalEvent?: MarketplacePromotionalEvent;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Row = styled.div`
  display: flex;
  gap: var(--quadruple-unit);
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const Line = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: baseline;
`;

const StyledText14 = styled(Text14)`
  display: flex;
  gap: var(--half-unit);
`;

const AmountWithConversion = ({
  bigger = false,
  ...props
}: UseAmountWithConversionProps & { bigger?: boolean }) => {
  const { main, exponent } = useAmountWithConversion(props);
  if (bigger) {
    <Line>
      <Title3 color="var(--c-neutral-1000)">{main}</Title3>
      <Text16 color="var(--c-neutral-600)">{exponent}</Text16>
    </Line>;
  }
  return (
    <Line>
      <Title4 color="var(--c-neutral-1000)">{main}</Title4>
      <Text14 color="var(--c-neutral-600)">{exponent}</Text14>
    </Line>
  );
};

export const BidInfosTitle = ({ auction }: Pick<Props, 'auction'>) => {
  const bestBidBelongsToUser = useBestBidBelongsToUser();

  const { open, bestBid, myLastBid, cancelled } = auction;

  if (!open || !bestBid || cancelled || !myLastBid) return null;

  if (bestBidBelongsToUser(bestBid))
    return (
      <Title4 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="BestBid.highestBidder"
          defaultMessage="You are the highest bidder"
        />
      </Title4>
    );
  return (
    <Title4 color="var(--c-red-600)">
      <FormattedMessage
        id="BestBid.outbid"
        defaultMessage="You’ve been outbid"
      />
    </Title4>
  );
};

const BidInfos = ({ auction, promotionalEvent }: Props) => {
  const {
    autoBid,
    bestBid,
    bidsCount,
    cancelled,
    currentPrice,
    endDate,
    myBestBid,
    myLastBid,
  } = auction;

  const bestBidIsMaxBid =
    myBestBid?.maximumAmount &&
    bestBid?.amount &&
    new Big(myBestBid?.maximumAmount).eq(bestBid.amount);

  return (
    <Wrapper>
      <BidInfosTitle auction={auction} />
      <Row>
        <Column>
          {myLastBid && (
            <Text16 color="var(--c-neutral-600)">
              <FormattedMessage
                id="BidInfos.currentBid"
                defaultMessage="Current bid"
              />
            </Text16>
          )}
          {currentPrice && (
            <AmountWithConversion
              unit="wei"
              amount={currentPrice}
              context="Open auction currentBid"
              bigger={!myLastBid}
            />
          )}
        </Column>
        {autoBid && myBestBid?.maximumAmount && !bestBidIsMaxBid && (
          <Column>
            <Text16 color="var(--c-neutral-600)">
              <FormattedMessage
                id="BidInfos.maxBid"
                defaultMessage="Your max bid"
              />
            </Text16>
            {auction?.myBestBid?.maximumAmount && (
              <AmountWithConversion
                unit="wei"
                amount={auction.myBestBid.maximumAmount}
                context="Open auction currentBid"
              />
            )}
          </Column>
        )}
      </Row>
      {promotionalEvent && <ItemSpecialRewardBadge event={promotionalEvent} />}
      <StyledText14 as="div" color="var(--c-neutral-600)">
        {cancelled ? (
          <FormattedMessage {...glossary.canceled} />
        ) : (
          <FormattedMessage
            id="BidInfos.timeleft"
            defaultMessage="{bidsCount, plural, =0 {# bid • } one { # bid • } other {# bids • }}{timeleft}"
            values={{
              bidsCount,
              timeleft: <AuctionTimeLeft endDate={endDate} forceInlineLayout />,
            }}
          />
        )}
      </StyledText14>
      <ConversionCreditTinyBanner sport={auction.nfts[0]?.sport} />
    </Wrapper>
  );
};

BidInfos.fragments = {
  auction: gql`
    fragment BidInfos_auction on TokenAuction {
      id
      bidsCount
      open
      endDate
      cancelled
      bidsCount
      autoBid
      currentPrice
      privateCurrentPrice
      nfts {
        assetId
        slug
        sport
      }
      bestBid {
        id
        amount
        ...UseBestBidBelongsToUser_bestBid
      }
      myBestBid {
        id
        maximumAmount
      }
      myLastBid {
        id
      }
    }
    ${useBestBidBelongsToUser.fragments.bestBid}
  `,
};

export default BidInfos;

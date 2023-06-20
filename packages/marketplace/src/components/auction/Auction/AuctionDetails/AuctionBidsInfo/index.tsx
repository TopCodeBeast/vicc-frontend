import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';

import { BidsCount } from '@sorare/marketplace/src/components/auction/BidsCount';
import useBestBidBelongsToUser from '@sorare/marketplace/src/hooks/auctions/useBestBidBelongsToUser';

import { AuctionBidsInfo_auction } from './__generated__/index.graphql';

const Label = styled(Caption)`
  border: 1px solid currentColor;
  padding: 0 var(--half-unit);
  border-radius: var(--unit);
  font-weight: var(--t-bold);
`;

type Props = {
  auction: AuctionBidsInfo_auction;
};

export const AuctionBidsInfo = ({ auction }: Props) => {
  const doesBestBidBelongsToUser = useBestBidBelongsToUser();
  const bestBidBelongsToUser =
    auction.bestBid && doesBestBidBelongsToUser(auction.bestBid);

  if (bestBidBelongsToUser) {
    return (
      <Label color="var(--c-green-800)">
        <FormattedMessage id="WinningLabel.label" defaultMessage="Winning" />
      </Label>
    );
  }

  if (auction.myLastBid) {
    return (
      <Label color="var(--c-red-800)">
        <FormattedMessage id="OutbidLabel.label" defaultMessage="Outbid" />
      </Label>
    );
  }

  return <BidsCount auction={auction} />;
};

AuctionBidsInfo.fragments = {
  auction: gql`
    fragment AuctionBidsInfo_auction on TokenAuction {
      id
      endDate
      bestBid {
        id
        ...UseBestBidBelongsToUser_bestBid
      }
      myLastBid {
        id
      }
      ...BidsCount_auction
    }
    ${useBestBidBelongsToUser.fragments.bestBid}
    ${BidsCount.fragments.auction}
  `,
};

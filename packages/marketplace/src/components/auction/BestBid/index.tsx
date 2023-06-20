import { gql } from '@apollo/client';
import BigNumber from 'bignumber.js';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import useBestBidBelongsToUser from 'hooks/auctions/useBestBidBelongsToUser';

import { BestBid_auction } from './__generated__/index.graphql';

const YellowCaption = styled.p<{ $small?: boolean }>`
  text-transform: uppercase;
  color: var(--c-yellow-600);
  ${({ $small }) => ($small ? `font: var(--t-12);` : `font: var(--t-16);`)}
  font-weight: 900;
`;

interface Props {
  auction: BestBid_auction;
  small?: boolean;
}

export const BestBid = ({ auction, small }: Props) => {
  const bestBidBelongsToUser = useBestBidBelongsToUser();

  const { open, bestBid, cancelled, autoBid, myBestBid } = auction;

  if (!open || !bestBid || cancelled) return null;
  if (!bestBidBelongsToUser(bestBid)) return null;

  if (
    myBestBid &&
    autoBid &&
    new BigNumber(myBestBid.maximumAmount!.toString()).gt(bestBid.amount)
  ) {
    return (
      <YellowCaption $small={small}>
        <FormattedMessage id="BestBid.maxBid" defaultMessage="Max Bid" />
      </YellowCaption>
    );
  }

  return (
    <YellowCaption $small={small}>
      <FormattedMessage id="BestBid.highest" defaultMessage="Highest" />
    </YellowCaption>
  );
};

BestBid.fragments = {
  auction: gql`
    fragment BestBid_auction on TokenAuction {
      id
      open
      autoBid
      cancelled
      bestBid {
        id
        amount
        ...UseBestBidBelongsToUser_bestBid
      }
      myBestBid {
        id
        maximumAmount
      }
    }
    ${useBestBidBelongsToUser.fragments.bestBid}
  `,
};

export default BestBid;

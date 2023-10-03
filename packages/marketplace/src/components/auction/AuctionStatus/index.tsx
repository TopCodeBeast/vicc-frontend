import { TypedDocumentNode, gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';
import styled from 'styled-components';

import DotsLoader from '@sorare/core/src/atoms/loader/DotsLoader';

import ItemEndDate from '@marketplace/components/ItemPreview/ItemEndDate';
import { AuctionBidsInfo } from '@marketplace/components/auction/Auction/AuctionDetails/AuctionBidsInfo';

import { AuctionStatus_auction } from './__generated__/index.graphql';

type Props = {
  auction: AuctionStatus_auction;
};

const Root = styled.div`
  display: flex;
  align-items: center;
  font: var(--t-12);
  gap: var(--half-unit);
  color: var(--c-neutral-600);
  width: 100%;
  height: var(--triple-unit);
`;

export const AuctionStatus = ({ auction }: Props) => {
  const endDate = parseISO(auction.endDate);
  const ended = isPast(endDate);
  return (
    <Root>
      <AuctionBidsInfo auction={auction} />
      {' • '}
      {ended ? <DotsLoader small /> : <ItemEndDate endDate={endDate} />}
    </Root>
  );
};

AuctionStatus.fragments = {
  auction: gql`
    fragment AuctionStatus_auction on Auction {
      id
      endDate
      ...AuctionBidsInfo_auction
    }
    ${AuctionBidsInfo.fragments.auction}
  ` as TypedDocumentNode<AuctionStatus_auction>,
};

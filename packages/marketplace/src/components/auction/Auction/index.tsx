import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';

import {
  ItemImgContainer,
  ItemInfosContainer,
  ItemPropertiesContainer,
} from '@marketplace/components/ItemPreview/ui';
import TokenDescription from '@marketplace/components/token/TokenDescription';

import Bundle from '../Bundle';
import { AuctionDetails } from './AuctionDetails';
import { AuctionImg } from './AuctionImg';
import { Auction_auction } from './__generated__/index.graphql';

type Props = {
  auction: Auction_auction;
};

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);
`;

export const Auction = ({ auction }: Props) => {
  return (
    <Root>
      <ItemImgContainer>
        <AuctionImg auction={auction} />
      </ItemImgContainer>
      <ItemInfosContainer>
        {auction.nfts.length > 1 && (
          <ItemPropertiesContainer>
            <Bundle />
          </ItemPropertiesContainer>
        )}
        {auction.nfts.length === 1 && (
          <TokenDescription
            token={auction.nfts[0]}
            Details={Text14}
            detailsColor="var(--c-neutral-600)"
            withDetails
            disableSportSpecific
          />
        )}
        <AuctionDetails
          auction={auction}
          isDesktopLayout={false}
          showWinnerWhenEnded
          allowColumnLayout
        />
      </ItemInfosContainer>
    </Root>
  );
};

Auction.fragments = {
  auction: gql`
    fragment Auction_auction on Auction {
      id
      blockchainId
      nfts {
        assetId
        slug
        ...TokenDescription_token
      }
      ...AuctionImg_auction
      ...AuctionDetails_auction
    }
    ${AuctionImg.fragments.auction}
    ${AuctionDetails.fragments.auction}
    ${TokenDescription.fragments.token}
  ` as TypedDocumentNode<Auction_auction>,
};

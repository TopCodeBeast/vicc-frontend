import { gql } from '@apollo/client';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import Since from '@sorare/core/src/contexts/intl/Since';
import { isType } from '@sorare/core/src/gql';

import { ItemOwner } from '@sorare/marketplace/src/components/ItemPreview/ItemOwner';

import { AuctionWinner_auction } from './__generated__/index.graphql';

const StyledCaption = styled(Caption)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

type Props = {
  auction: AuctionWinner_auction;
};

export const AuctionWinner = ({ auction }: Props) => {
  if (!auction.bestBid?.bidder || !isType(auction.bestBid?.bidder, 'User')) {
    return null;
  }

  return (
    <StyledCaption as="div" color="var(--c-neutral-600)">
      <ItemOwner
        variant="auction"
        user={auction.bestBid?.bidder}
        sport={auction.nfts[0].sport}
      />
      {' · '}
      <Since date={auction.endDate} />
    </StyledCaption>
  );
};

AuctionWinner.fragments = {
  auction: gql`
    fragment AuctionWinner_auction on TokenAuction {
      id
      endDate
      bestBid {
        bidder {
          ... on User {
            slug
            ...ItemOwner_user
          }
        }
      }
      nfts {
        assetId
        slug
        sport
      }
    }
    ${ItemOwner.fragments.user}
  `,
};

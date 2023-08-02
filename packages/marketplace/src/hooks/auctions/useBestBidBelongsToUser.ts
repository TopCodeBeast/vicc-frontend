import { TypedDocumentNode, gql } from '@apollo/client';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { isType } from '@sorare/core/src/lib/gql';

import { UseBestBidBelongsToUser_bestBid } from './__generated__/useBestBidBelongsToUser.graphql';

export const useBestBidBelongsToUser = () => {
  const { currentUser } = useCurrentUserContext();

  return (bestBid?: UseBestBidBelongsToUser_bestBid) => {
    return (
      currentUser &&
      bestBid?.bidder &&
      isType(bestBid.bidder, 'User') &&
      currentUser.slug === bestBid.bidder.slug
    );
  };
};

useBestBidBelongsToUser.fragments = {
  bestBid: gql`
    fragment UseBestBidBelongsToUser_bestBid on TokenBid {
      id
      bidder {
        ... on User {
          slug
        }
      }
    }
  ` as TypedDocumentNode<UseBestBidBelongsToUser_bestBid>,
};

export default useBestBidBelongsToUser;

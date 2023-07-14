import { gql } from '@apollo/client';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { isA } from '@sorare/core/src/lib/gql';

import { UseBestBidBelongsToUser_bestBid } from './__generated__/useBestBidBelongsToUser.graphql';

type UseBestBidBelongsToUser_bestBid_bidder =
  UseBestBidBelongsToUser_bestBid['bidder'];

type UseBestBidBelongsToUser_bestBid_bidder_User =
  UseBestBidBelongsToUser_bestBid_bidder & { __typename: 'User' };

export const useBestBidBelongsToUser = () => {
  const { currentUser } = useCurrentUserContext();

  return (bestBid?: UseBestBidBelongsToUser_bestBid) => {
    return (
      currentUser &&
      bestBid &&
      bestBid.bidder &&
      isA<UseBestBidBelongsToUser_bestBid_bidder_User>(
        'User',
        bestBid.bidder
      ) &&
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
  `,
};

export default useBestBidBelongsToUser;

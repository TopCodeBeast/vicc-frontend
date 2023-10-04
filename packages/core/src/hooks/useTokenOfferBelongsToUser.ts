import { TypedDocumentNode, gql } from '@apollo/client';

import { useCurrentUserContext } from '@core/contexts/currentUser';
import { isType } from '@core/lib/gql';

import { useTokenOfferBelongsToUser_offer } from './__generated__/useTokenOfferBelongsToUser.graphql';

const useTokenOfferBelongsToUser = () => {
  const { currentUser } = useCurrentUserContext();

  return (offer: useTokenOfferBelongsToUser_offer) => {
    return (
      currentUser &&
      isType(offer.sender, 'User') &&
      offer.sender?.slug === currentUser.slug
    );
  };
};

useTokenOfferBelongsToUser.fragments = {
  offer: gql`
    fragment useTokenOfferBelongsToUser_offer on Offer {
      sender {
        ... on User {
          slug
        }
      }
    }
  ` as TypedDocumentNode<useTokenOfferBelongsToUser_offer>,
};

export default useTokenOfferBelongsToUser;

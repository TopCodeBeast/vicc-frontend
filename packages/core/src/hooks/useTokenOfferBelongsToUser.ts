import { gql } from '@apollo/client';

import { User } from '__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { isA } from '@core/lib/gql';

import { useTokenOfferBelongsToUser_offer } from './__generated__/useTokenOfferBelongsToUser.graphql';

const useTokenOfferBelongsToUser = () => {
  const { currentUser } = useCurrentUserContext();

  return (offer: useTokenOfferBelongsToUser_offer) => {
    return (
      currentUser &&
      isA<User>('User', offer.sender) &&
      offer.sender?.slug === currentUser.slug
    );
  };
};

useTokenOfferBelongsToUser.fragments = {
  offer: gql`
    fragment useTokenOfferBelongsToUser_offer on TokenOffer {
      sender {
        ... on User {
          slug
        }
      }
    }
  `,
};

export default useTokenOfferBelongsToUser;

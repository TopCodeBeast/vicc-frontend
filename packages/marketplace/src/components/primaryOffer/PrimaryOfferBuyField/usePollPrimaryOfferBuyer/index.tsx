import { TypedDocumentNode, gql } from '@apollo/client';
import { useMemo } from 'react';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import {
  PrimaryOfferBuyerQuery,
  PrimaryOfferBuyerQueryVariables,
  usePollPrimaryOfferBuyer_primaryOffer,
} from './__generated__/index.graphql';

const PRIMARY_OFFER_BUYER_QUERY = gql`
  query PrimaryOfferBuyerQuery($id: String!) {
    tokens {
      primaryOffer(id: $id) {
        id
        buyer {
          slug
        }
      }
    }
  }
` as TypedDocumentNode<PrimaryOfferBuyerQuery, PrimaryOfferBuyerQueryVariables>;

const usePollPrimaryOfferBuyer = (
  enabled: boolean,
  primaryOffer: usePollPrimaryOfferBuyer_primaryOffer,
  cb: (winning: boolean) => void
) => {
  const { currentUser } = useCurrentUserContext();
  const primaryOfferId = idFromObject(primaryOffer?.id) || '';
  useQuery(PRIMARY_OFFER_BUYER_QUERY, {
    variables: {
      id: primaryOfferId,
    },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
    pollInterval: 1000,
    skip: !enabled,
  });

  const { buyer } = primaryOffer;

  const userIsBuyer = useMemo(
    () => buyer && currentUser && buyer.slug === currentUser.slug,
    [buyer, currentUser]
  );

  if (userIsBuyer && enabled) {
    cb(userIsBuyer);
  }
};

usePollPrimaryOfferBuyer.fragments = {
  primaryOffer: gql`
    fragment usePollPrimaryOfferBuyer_primaryOffer on Offer {
      id
      buyer {
        slug
      }
    }
  ` as TypedDocumentNode<usePollPrimaryOfferBuyer_primaryOffer>,
};

export default usePollPrimaryOfferBuyer;

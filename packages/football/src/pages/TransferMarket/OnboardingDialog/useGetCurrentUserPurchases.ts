import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import {
  CurrentUserPurchasesQuery,
  CurrentUserPurchasesQueryVariables,
} from './__generated__/useGetCurrentUserPurchases.graphql';

export const CURRENT_USER_PURCHASES = gql`
  query CurrentUserPurchasesQuery {
    currentUser {
      slug
      wonAuctions(first: 1, sport: CRICKET) {
        totalCount
      }
      boughtSingleSaleOffers(first: 1) {
        totalCount
      }
    }
  }
` as TypedDocumentNode<
  CurrentUserPurchasesQuery,
  CurrentUserPurchasesQueryVariables
>;

const useGetCurrentUserPurchases = () => {
  return useQuery(CURRENT_USER_PURCHASES);
};

export default useGetCurrentUserPurchases;

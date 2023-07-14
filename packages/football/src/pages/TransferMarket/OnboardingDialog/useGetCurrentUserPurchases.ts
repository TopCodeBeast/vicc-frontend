import { gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { CurrentUserPurchasesQuery } from './__generated__/useGetCurrentUserPurchases.graphql';

export const CURRENT_USER_PURCHASES = gql`
  query CurrentUserPurchasesQuery {
    currentUser {
      slug
      wonTokenAuctions(first: 1) {
        totalCount
      }
      boughtSingleSaleTokenOffers(first: 1) {
        totalCount
      }
    }
  }
`;

const useGetCurrentUserPurchases = () => {
  return useQuery<CurrentUserPurchasesQuery>(CURRENT_USER_PURCHASES);
};

export default useGetCurrentUserPurchases;

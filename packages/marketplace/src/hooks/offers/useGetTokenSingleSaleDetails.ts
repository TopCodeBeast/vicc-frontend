import { gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';

import useForceUpdateAfterEndDate from '@sorare/core/src/hooks/useForceUpdateAfterEndDate';

import { useGetTokenSingleSaleDetails_token } from './__generated__/useGetTokenSingleSaleDetails.graphql';

const useGetTokenSingleSaleDetails = (
  token: useGetTokenSingleSaleDetails_token
) => {
  const singleSaleOffer =
    token.liveSingleSaleOffer || token.myMintedSingleSaleOffer;
  const endDateString = singleSaleOffer?.endDate;
  const weiPrice = singleSaleOffer?.priceWei;

  const isOnSale = !!singleSaleOffer;

  const endDate = (endDateString && parseISO(endDateString)) as null | Date;

  useForceUpdateAfterEndDate(endDate);
  if (isOnSale && weiPrice && endDate) {
    const ended = isPast(endDate);
    return {
      endDate,
      ended,
      weiPrice,
    };
  }
  return undefined;
};

useGetTokenSingleSaleDetails.fragments = {
  token: gql`
    fragment useGetTokenSingleSaleDetails_token on Token {
      assetId
      slug
      myMintedSingleSaleOffer {
        id
        endDate
        priceWei: price ####################
      }
      liveSingleSaleOffer {
        id
        endDate
        priceWei: price ####################
      }
    }
  `,
};

export default useGetTokenSingleSaleDetails;

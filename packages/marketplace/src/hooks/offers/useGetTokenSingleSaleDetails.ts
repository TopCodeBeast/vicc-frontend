import { TypedDocumentNode, gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';

import useForceUpdateAfterEndDate from '@sorare/core/src/hooks/useForceUpdateAfterEndDate';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import { useGetTokenSingleSaleDetails_token } from './__generated__/useGetTokenSingleSaleDetails.graphql';

const useGetTokenSingleSaleDetails = (
  token: useGetTokenSingleSaleDetails_token
) => {
  const singleSaleOffer =
    token.liveSingleSaleOffer || token.myMintedSingleSaleOffer;
  const endDateString = singleSaleOffer?.endDate;
  const price = singleSaleOffer?.receiverSide?.amounts;

  const isOnSale = !!singleSaleOffer;

  const endDate = (endDateString && parseISO(endDateString)) as null | Date;

  useForceUpdateAfterEndDate(endDate);
  if (isOnSale && price && endDate) {
    const ended = isPast(endDate);
    return {
      endDate,
      ended,
      price,
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
        receiverSide {
          id
          amounts {
            ...MonetaryAmountFragment_monetaryAmount
          }
        }
      }
      liveSingleSaleOffer {
        id
        endDate
        receiverSide {
          id
          amounts {
            ...MonetaryAmountFragment_monetaryAmount
          }
        }
      }
    }
    ${monetaryAmountFragment}
  ` as TypedDocumentNode<useGetTokenSingleSaleDetails_token>,
};

export default useGetTokenSingleSaleDetails;

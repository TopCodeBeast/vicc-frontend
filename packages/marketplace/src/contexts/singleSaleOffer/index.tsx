import { gql } from '@apollo/client';
import { createContext, useContext } from 'react';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import CancelSalePopin from '@sorare/marketplace/src/components/offer/CancelSalePopin';

export interface SingleSaleOfferPopinInfo {
  assetId: string;
}

export interface SingleSaleOfferContext {
  showPopin: (singleSaleOfferPopinInfo: SingleSaleOfferPopinInfo) => void;
}

export const singleSaleOfferContext =
  createContext<SingleSaleOfferContext | null>(null);

export const useSingleSaleOfferContext = () =>
  useContext(singleSaleOfferContext)!;

export default singleSaleOfferContext.Provider;

export const singleSaleOfferContextFragments = {
  token: gql`
    fragment SingleSaleOfferContext_token on Token {
      assetId
      slug
      ...CancelSalePopin_token
    }
    ${CancelSalePopin.fragments.token}
  `,
};

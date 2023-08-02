import { TypedDocumentNode, gql } from '@apollo/client';
import { createContext, useContext } from 'react';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import CancelSalePopin from '@marketplace/components/offer/CancelSalePopin';

import { SingleSaleOfferContext_token } from './__generated__/index.graphql';

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
  ` as TypedDocumentNode<SingleSaleOfferContext_token>,
};

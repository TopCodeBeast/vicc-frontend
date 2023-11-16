import { TypedDocumentNode, gql } from '@apollo/client';

import Since from '@sorare/core/src/contexts/intl/Since';

import { ItemOwnerSince_token } from './__generated__/index.graphql';

interface Props {
  token: ItemOwnerSince_token;
}

export const ItemOwnerSince = ({ token }: Props) => {
  // if (!token.owner?.from) return null;
  // return <Since date={token.owner.from} />;
  return <></>; //TODO
};

ItemOwnerSince.fragments = {
  token: gql`
    fragment ItemOwnerSince_token on Token {
      assetId
      slug
      owner {
        id
        # from
        ownerSince
      }
    }
  ` as TypedDocumentNode<ItemOwnerSince_token>,
};

export default ItemOwnerSince;

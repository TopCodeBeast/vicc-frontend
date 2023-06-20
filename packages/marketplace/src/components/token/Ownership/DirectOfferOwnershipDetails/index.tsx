import { gql } from '@apollo/client';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import DirectOffer from '@sorare/marketplace/src/components/mySorare/common/DirectOffer';

import {
  DirectOfferOwnershipDetailsQuery,
  DirectOfferOwnershipDetailsQueryVariables,
} from './__generated__/index.graphql';

type Props = {
  offer: { id: string };
};

const DIRECT_OFFER_OWNERSHIP_DETAILS_QUERY = gql`
  query DirectOfferOwnershipDetailsQuery($id: String!) {
    tokens {
      offer(id: $id) {
        id
        ...MySorareDirectOffer_tokenOffer
      }
    }
  }
  ${DirectOffer.fragments.tokenOffer}
`;

export const DirectOfferOwnershipDetails = ({ offer }: Props) => {
  const { data } = useQuery<
    DirectOfferOwnershipDetailsQuery,
    DirectOfferOwnershipDetailsQueryVariables
  >(DIRECT_OFFER_OWNERSHIP_DETAILS_QUERY, {
    variables: {
      id: idFromObject(offer.id)!,
    },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  if (!data) return <LoadingIndicator />;

  return <DirectOffer offer={data.tokens.offer} inModale />;
};

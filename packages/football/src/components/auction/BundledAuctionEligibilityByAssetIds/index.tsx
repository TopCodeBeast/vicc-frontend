import { gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import ItemEligibility from '@football/components/card/ItemEligibility';

import { BundledAuctionEligibilityByAssetIdsQuery } from './__generated__/index.graphql';

interface Props {
  tokens: { assetId: string }[];
}

const cardFragment = gql`
  fragment BundledAuctionEligibilityByAssetIds_card on Card {
    slug
    assetId
    ...ItemEligibility_card
  }
  ${ItemEligibility.fragments.card}
`;

const BUNDLED_AUCTION_ELIGIBILITY_BY_ASSET_IDS_QUERY = gql`
  query BundledAuctionEligibilityByAssetIdsQuery($assetIds: [String!]!) {
    cards(assetIds: $assetIds) {
      slug
      assetId
      ...BundledAuctionEligibilityByAssetIds_card
    }
  }
  ${cardFragment}
`;

const BundledAuctionEligibilityByAssetIds = ({ tokens }: Props) => {
  const { loading, data } = useQuery<BundledAuctionEligibilityByAssetIdsQuery>(
    BUNDLED_AUCTION_ELIGIBILITY_BY_ASSET_IDS_QUERY,
    {
      variables: {
        assetIds: tokens.map(token => token.assetId),
      },
      fetchPolicy: 'cache-first',
    }
  );

  if (loading || !data) return null;

  const {
    cards, //TODO******
  } = data;
  return <ItemEligibility cards={cards} />;
};

BundledAuctionEligibilityByAssetIds.fragments = {
  card: cardFragment,
};

export default BundledAuctionEligibilityByAssetIds;

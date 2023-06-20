import { gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import CardProperties from '@sorare/football/src/components/so5/CardProperties';

import { CardPropertiesByAssetIdQuery } from './__generated__/index.graphql';

interface Props {
  assetId: string;
}

const cardFragment = gql`
  fragment CardPropertiesByAssetId_card on Card {
    slug
    assetId
    ...CardProperties_card
  }
  ${CardProperties.fragments.card}
`;

const CARD_PROPERTIES_BY_ASSET_ID_QUERY = gql`
  query CardPropertiesByAssetIdQuery($assetId: String!) {
    football {
      cardByAssetId(assetId: $assetId) {
        slug
        assetId
        ...CardPropertiesByAssetId_card
      }
    }
  }
  ${cardFragment}
`;

const CardPropertiesByAssetId = ({ assetId }: Props) => {
  const { loading, data } = useQuery<CardPropertiesByAssetIdQuery>(
    CARD_PROPERTIES_BY_ASSET_ID_QUERY,
    {
      variables: {
        assetId,
      },
      fetchPolicy: 'cache-first',
    }
  );

  if (loading || !data) return null;

  const card = data.football.cardByAssetId;
  return <CardProperties card={card} />;
};

CardPropertiesByAssetId.fragments = {
  card: cardFragment,
};

export default CardPropertiesByAssetId;

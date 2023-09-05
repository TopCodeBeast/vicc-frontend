import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import CardProperties from '@football/components/so5/CardProperties';

import {
  CardPropertiesByAssetIdQuery,
  CardPropertiesByAssetIdQueryVariables,
  CardPropertiesByAssetId_card,
} from './__generated__/index.graphql';

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
` as TypedDocumentNode<CardPropertiesByAssetId_card>;

const CARD_PROPERTIES_BY_ASSET_ID_QUERY = gql`
  query CardPropertiesByAssetIdQuery($assetId: String!) {
    #football {
      cardByAssetId(assetId: $assetId) {
        slug
        assetId
        ...CardPropertiesByAssetId_card
      }
    #}
  }
  ${cardFragment}
` as TypedDocumentNode<
  CardPropertiesByAssetIdQuery,
  CardPropertiesByAssetIdQueryVariables
>;

const CardPropertiesByAssetId = ({ assetId }: Props) => {
  const { loading, data } = useQuery(CARD_PROPERTIES_BY_ASSET_ID_QUERY, {
    variables: {
      assetId,
    },
    fetchPolicy: 'cache-first',
  });

  if (loading || !data) return null;

  const card = data.football.cardByAssetId;
  return <CardProperties card={card} />;
};

CardPropertiesByAssetId.fragments = {
  card: cardFragment,
};

export default CardPropertiesByAssetId;

import { gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import CardTeams from '@football/components/card/CardTeams';

import {
  CardTeamsByAssetIdQuery,
  CardTeamsByAssetIdQueryVariables,
} from './__generated__/index.graphql';

const fragment = gql`
  fragment CardTeamsByAssetId_card on Card {
    assetId
    slug
    ...CardTeams_card
  }

  ${CardTeams.fragments.card}
`;

const CARD_TEAMS_BY_ASSET_ID = gql`
  query CardTeamsByAssetIdQuery($assetId: String!) {
    football {
      cardByAssetId(assetId: $assetId) {
        assetId
        slug
        ...CardTeamsByAssetId_card
      }
    }
  }
  ${fragment}
`;

type Props = {
  assetId: string;
};

const CardTeamsByAssetId = ({ assetId }: Props) => {
  const { data, loading } = useQuery<
    CardTeamsByAssetIdQuery,
    CardTeamsByAssetIdQueryVariables
  >(CARD_TEAMS_BY_ASSET_ID, { variables: { assetId } });

  if (loading || !data) return null;

  const { cardByAssetId } = data.football;
  return <CardTeams card={cardByAssetId} />;
};

CardTeamsByAssetId.fragments = {
  card: fragment,
};

export default CardTeamsByAssetId;

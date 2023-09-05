import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import LoadingStarterBundlePreview from '@football/components/starterBundle/LoadingStarterBundlePreview';
import { StarterBundleLastFifteen } from '@football/components/starterBundle/StarterBundleLastFifteen';
import StarterBundlePreview from '@football/components/starterBundle/StarterBundlePreview';

import {
  CustomStarterBundlePreviewQuery,
  CustomStarterBundlePreviewQueryVariables,
  CustomStarterBundlePreview_card,
} from './__generated__/index.graphql';

const fragment = gql`
  fragment CustomStarterBundlePreview_card on Card {
    assetId
    slug
    ...StarterBundlePreview_card
    ...StarterBundleLastFifteen_card
  }
  ${StarterBundlePreview.fragments.card}
  ${StarterBundleLastFifteen.fragments.card}
` as TypedDocumentNode<CustomStarterBundlePreview_card>;
const CUSTOM_STARTER_BUNDLE_PREVIEW_QUERY = gql`
  query CustomStarterBundlePreviewQuery($assetIds: [String!]!) {
    #football {
      cards(assetIds: $assetIds) {
        slug
        assetId
        ...CustomStarterBundlePreview_card
      }
    #}
  }
  ${fragment}
` as TypedDocumentNode<
  CustomStarterBundlePreviewQuery,
  CustomStarterBundlePreviewQueryVariables
>;

type Props = { assetIds: string[]; to: string };
export const CustomStarterBundlePreview = ({ assetIds, to }: Props) => {
  const { data, loading } = useQuery(CUSTOM_STARTER_BUNDLE_PREVIEW_QUERY, {
    variables: {
      assetIds,
    },
    fetchPolicy: 'cache-only',
  });

  if (!data || loading) return <LoadingStarterBundlePreview light />;

  const { cards } = data;

  return (
    <>
      <StarterBundlePreview to={to} cards={cards} />
      <StarterBundleLastFifteen cards={cards} />
    </>
  );
};

CustomStarterBundlePreview.fragments = {
  card: fragment,
};

export default CustomStarterBundlePreview;

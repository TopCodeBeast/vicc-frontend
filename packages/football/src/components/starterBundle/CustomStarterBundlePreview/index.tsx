import { gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { StarterBundleLastFifteen } from '@football/components/starterBundle/StarterBundleLastFifteen';
import StarterBundlePreview from '@football/components/starterBundle/StarterBundlePreview';

import {
  CustomStarterBundlePreviewQuery,
  CustomStarterBundlePreviewQueryVariables,
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
`;
const CUSTOM_STARTER_BUNDLE_PREVIEW_QUERY = gql`
  query CustomStarterBundlePreviewQuery($assetIds: [String!]!) {
    football {
      cards(assetIds: $assetIds) {
        slug
        assetId
        ...CustomStarterBundlePreview_card
      }
    }
  }
  ${fragment}
`;

type Props = { assetIds: string[]; to: string };
export const CustomStarterBundlePreview = ({ assetIds, to }: Props) => {
  const { data, loading } = useQuery<
    CustomStarterBundlePreviewQuery,
    CustomStarterBundlePreviewQueryVariables
  >(CUSTOM_STARTER_BUNDLE_PREVIEW_QUERY, {
    variables: {
      assetIds,
    },
    fetchPolicy: 'cache-only',
  });

  if (!data || loading) return null;

  const {
    football: { cards },
  } = data;

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

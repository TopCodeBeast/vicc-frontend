import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import PrimaryOfferGrid from '@sorare/marketplace/src/components/primaryOffer/PrimaryOfferGrid';

import { CustomStarterBundlePreview } from '@football/components/starterBundle/CustomStarterBundlePreview';
import LoadingStarterBundlePreview from '@football/components/starterBundle/LoadingStarterBundlePreview';

import {
  BatchStarterBundlePreviewQuery,
  BatchStarterBundlePreviewQueryVariables,
} from './__generated__/index.graphql';

const BATCH_STARTER_BUNDLE_PREVIEW_QUERY = gql`
  query BatchStarterBundlePreviewQuery($assetIds: [String!]!) {
    football {
      cards(assetIds: $assetIds) {
        slug
        assetId
        ...CustomStarterBundlePreview_card
      }
    }
  }
  ${CustomStarterBundlePreview.fragments.card}
` as TypedDocumentNode<
  BatchStarterBundlePreviewQuery,
  BatchStarterBundlePreviewQueryVariables
>;

const BatchSO5Query = ({ assetIds }: { assetIds: string[] }) => {
  useQuery(BATCH_STARTER_BUNDLE_PREVIEW_QUERY, {
    variables: { assetIds },
    skip: !assetIds.length,
  });
  return null;
};

const PrimaryOfferResultsFromGraphQL = () => {
  const PrimaryOfferGridProps = {
    CustomPreview: CustomStarterBundlePreview,
    BatchSportSpecificQuery: BatchSO5Query,
    customLoadingPrimaryOfferPreview: <LoadingStarterBundlePreview />,
  };

  return <PrimaryOfferGrid {...PrimaryOfferGridProps} />;
};

export default PrimaryOfferResultsFromGraphQL;

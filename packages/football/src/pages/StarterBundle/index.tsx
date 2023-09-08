import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import ResponsiveRow from '@sorare/core/src/atoms/layout/ResponsiveRow';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import PrimaryOfferPageContent from '@sorare/marketplace/src/components/primaryOffer/PrimaryOfferPageContent';
import CardPreview from '@sorare/marketplace/src/components/starterbundle/CardPreview';
import { PRIMARY_OFFER_BY_ID_QUERY } from '@sorare/marketplace/src/lib/fragments';

import CardProperties from '@football/components/so5/CardProperties';
import UninteractiveStarterBundlePreview from '@football/components/starterBundle/UninteractiveStarterBundlePreview';

import {
  StarterBundlePageQuery,
  StarterBundlePageQueryVariables,
  StarterBundlePage_card,
} from './__generated__/index.graphql';

type StarterBundlePageQuery_cards =
  StarterBundlePageQuery['cards'][number];

const cardFragment = gql`
  fragment StarterBundlePage_card on Card {
    assetId
    slug
    ...CardProperties_card
    ...UninteractiveStarterBundlePreview_card
  }
  ${CardProperties.fragments.card}
  ${UninteractiveStarterBundlePreview.fragments.card}
` as TypedDocumentNode<StarterBundlePage_card>;

const STARTER_BUNDLE_PAGE_QUERY = gql`
  query StarterBundlePageQuery($assetIds: [String!]!) {
    #football {
      cards(assetIds: $assetIds) {
        slug
        assetId
        ...StarterBundlePage_card
      }
    #}
  }
  ${cardFragment}
` as TypedDocumentNode<StarterBundlePageQuery, StarterBundlePageQueryVariables>;

export const StarterBundlePage = () => {
  const { id } = useParams();
  const [assetIds, setAssetIds] = useState<string[]>([]);

  const { data, loading } = useQuery(PRIMARY_OFFER_BY_ID_QUERY, {
    variables: { id: id! },
    skip: !id,
  });

  const { data: starterBundleData, loading: starterBundleLoading } = useQuery(
    STARTER_BUNDLE_PAGE_QUERY,
    {
      variables: { assetIds },
      skip: assetIds.length === 0,
    }
  );

  if (loading || data === undefined) {
    return <LoadingIndicator fullHeight />;
  }
  const {
    tokens: { primaryOffer },
  } = data;

  if (assetIds.length === 0)
    setAssetIds(primaryOffer.nfts.map(nft => nft.assetId));

  if (starterBundleLoading || starterBundleData === undefined) {
    return <LoadingIndicator fullHeight />;
  }
  const { cards } = starterBundleData;

  const cardsBySlug: {
    [key: string]: StarterBundlePageQuery_cards;
  } = cards.reduce((acc, card) => ({ ...acc, [card.slug]: card }), {});

  return (
    <PrimaryOfferPageContent
      primaryOffer={primaryOffer}
      cardsPreview={
        <ResponsiveRow>
          {primaryOffer?.nfts.map(token => {
            const card = cardsBySlug[token.slug];
            if (!card) return null;
            return (
              <CardPreview
                key={token.assetId}
                token={token}
                cardProperties={<CardProperties card={card} />}
              />
            );
          })}
        </ResponsiveRow>
      }
      customPreview={<UninteractiveStarterBundlePreview bigger cards={cards} />}
    />
  );
};

export default StarterBundlePage;

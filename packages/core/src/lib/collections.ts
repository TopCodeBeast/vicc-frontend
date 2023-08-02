import { TypedDocumentNode, gql } from '@apollo/client';

import {
  getCollectionsShield_cardCollection,
  getShieldScoreRequirement_skinShopItem,
} from './__generated__/collections.graphql';
import { withFragments } from './gql';

export type CollectionsTeamShield = {
  score?: number | null;
  name?: string;
  pictureUrl?: string | null;
};

export const getShieldScoreRequirement = withFragments(
  (
    currentCollectionSlug?: string,
    skinShopItem?: getShieldScoreRequirement_skinShopItem | null
  ) => {
    if (!currentCollectionSlug || !skinShopItem) return null;

    return skinShopItem?.cardCollectionRequirements.find(
      req => req.cardCollection.slug === currentCollectionSlug
    )?.score;
  },
  {
    skinShopItem: gql`
      fragment getShieldScoreRequirement_skinShopItem on SkinShopItem {
        id
        cardCollectionRequirements {
          cardCollection {
            slug
          }
          score
        }
      }
    ` as TypedDocumentNode<getShieldScoreRequirement_skinShopItem>,
  }
);

export const getCollectionsTeamShield = withFragments(
  (
    cardCollection?: getCollectionsShield_cardCollection | null
  ): CollectionsTeamShield => {
    const { slug, relatedShield, team } = cardCollection || {};
    const { name, pictureUrl } = team || {};
    const score = getShieldScoreRequirement(slug, relatedShield);
    return { score, name, pictureUrl };
  },
  {
    cardCollection: gql`
      fragment getCollectionsShield_cardCollection on CardCollection {
        slug
        relatedShield {
          id
          ...getShieldScoreRequirement_skinShopItem
        }
        team {
          ... on TeamInterface {
            slug
            name
            pictureUrl
          }
        }
      }
      ${getShieldScoreRequirement.fragments.skinShopItem}
    ` as TypedDocumentNode<getCollectionsShield_cardCollection>,
  }
);

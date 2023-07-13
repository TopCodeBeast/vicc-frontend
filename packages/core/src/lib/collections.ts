import { gql } from '@apollo/client';

import { getShieldScoreRequirement_skinShopItem } from './__generated__/collections.graphql';
import { withFragments } from './gql';

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
        # cardCollectionRequirements {
        #   cardCollection {
        #     slug
        #   }
        #   score
        # }
      }
    `,
  }
);

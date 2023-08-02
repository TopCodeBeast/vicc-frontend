import { TypedDocumentNode, gql } from '@apollo/client';

import { CollectionRequirements } from './CollectionRequirements';
import { ItemRequirements } from './ItemRequirements';
import { Requirements_clubShopItem } from './__generated__/index.graphql';

type Props = { item: Requirements_clubShopItem };

export const Requirements = ({ item }: Props) => {
  const showCollectionRequirements =
    item.disabled && item.cardCollectionRequirements.length > 0;
  const showItemRequirements =
    item.disabled && item.shopItemsRequired.length > 0;
  return (
    <>
      {showItemRequirements && <ItemRequirements item={item} />}
      {showCollectionRequirements && <CollectionRequirements item={item} />}
    </>
  );
};

Requirements.fragments = {
  clubShopItem: gql`
    fragment Requirements_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        disabled
      }
      ...CollectionRequirements_shopItem
      ...ItemRequirements_clubShopItem
    }
    ${ItemRequirements.fragments.clubShopItem}
    ${CollectionRequirements.fragments.shopItem}
  ` as TypedDocumentNode<Requirements_clubShopItem>,
};

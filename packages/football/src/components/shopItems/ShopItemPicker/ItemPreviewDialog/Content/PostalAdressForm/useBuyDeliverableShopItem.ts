import { TypedDocumentNode, gql } from '@apollo/client';

import { buyDeliverableShopItemInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  BuyDeliverableShopItemMutation,
  BuyDeliverableShopItemMutationVariables,
} from './__generated__/useBuyDeliverableShopItem.graphql';

const BUY_DELIVERABLE_SHOP_ITEM_MUTATION = gql`
  mutation BuyDeliverableShopItemMutation(
    $input: buyDeliverableShopItemInput!
  ) {
    buyDeliverableShopItem(input: $input) {
      currentUser {
        slug
        coinBalance
      }
      shopItem {
        ... on ShopItemInterface {
          id
          myPurchasesCount
          myLimitResetAt
          myAvailableTotalPurchasesCount
          myAvailableUserShopItems {
            id
          }
        }
        ... on JerseyShopItem {
          id
          currentStockCount
          variantStockCounts {
            currentStockCount
            size
          }
        }
      }
      errors {
        path
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  BuyDeliverableShopItemMutation,
  BuyDeliverableShopItemMutationVariables
>;

export default () => {
  const [buyDeliverableShopItem] = useMutation(
    BUY_DELIVERABLE_SHOP_ITEM_MUTATION,
    {
      showErrorsWithSnackNotification: true,
    }
  );

  return async (input: buyDeliverableShopItemInput) =>
    buyDeliverableShopItem({
      variables: {
        input,
      },
    });
};

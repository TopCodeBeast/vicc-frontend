import { gql, useMutation } from '@apollo/client';

import {
  Level,
  useSnackNotificationContext,
} from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import {
  BuyClubShopItemMutation,
  BuyClubShopItemMutationVariables,
} from './__generated__/useBuyShopItem.graphql';

const BUY_CLUB_SHOP_ITEM_MUTATION = gql`
  mutation BuyClubShopItemMutation($input: buyShopItemInput!) {
    buyShopItem(input: $input) {
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
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

export default () => {
  const [buyShopItem] = useMutation<
    BuyClubShopItemMutation,
    BuyClubShopItemMutationVariables
  >(BUY_CLUB_SHOP_ITEM_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return async (shopItemId: string) => {
    const result = await buyShopItem({
      variables: {
        input: {
          shopItemId,
        },
      },
    });

    const errors = result.data?.buyShopItem?.errors || [];

    if (errors.length) {
      showNotification(
        'errors',
        { errors: formatGqlErrors(errors) },
        { level: Level.WARN }
      );
      return errors;
    }
    return null;
  };
};

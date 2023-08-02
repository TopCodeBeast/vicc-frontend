import { TypedDocumentNode, gql } from '@apollo/client';

import { consumeCardBoosterInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import CardProperties from '@football/components/so5/CardProperties';

import {
  ConsumeCardBoostMutation,
  ConsumeCardBoostMutationVariables,
} from './__generated__/useConsumeCardBoost.graphql';

const CONSUMER_CARD_BOOST_MUTATION = gql`
  mutation ConsumeCardBoostMutation($input: consumeCardBoosterInput!) {
    consumeCardBooster(input: $input) {
      card {
        assetId
        slug
        xp
        grade
        xpNeededForCurrentGrade
        xpNeededForNextGrade
        levelUpAppliedCount
        maxLevelUpAppliedCount
        availableCardBoosts {
          # shopItem does not expose an ID because it's a union type
          # eslint-disable-next-line sorare/enforce-apollo-typepolicies
          shopItem {
            ... on ShopItemInterface {
              id
              myAvailableTotalPurchasesCount
              myAvailableUserShopItems {
                id
              }
            }
          }
        }
        ...CardProperties_card
      }
      errors {
        message
        code
      }
    }
  }
  ${CardProperties.fragments.card}
` as TypedDocumentNode<
  ConsumeCardBoostMutation,
  ConsumeCardBoostMutationVariables
>;

const useConsumeCardBoost = () => {
  const [mutate] = useMutation(CONSUMER_CARD_BOOST_MUTATION, {
    showErrorsWithSnackNotification: true,
  });

  return async (input: consumeCardBoosterInput) =>
    mutate({
      variables: { input },
    });
};

export default useConsumeCardBoost;

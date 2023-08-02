import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

import {
  Level,
  useSnackNotificationContext,
} from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import {
  CancelOfferMutation,
  CancelOfferMutationVariables,
} from './__generated__/useCancelOffer.graphql';

const CANCEL_OFFER_MUTATION = gql`
  mutation CancelOfferMutation($input: cancelOfferInput!) {
    cancelOffer(input: $input) {
      tokenOffer {
        id
        status
        cancelledAt
        sender {
          ... on User {
            slug
          }
        }
        senderSide {
          id
          nfts {
            assetId
            slug
            liveSingleSaleOffer {
              id
              status
            }
            myMintedSingleSaleOffer {
              id
            }
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
` as TypedDocumentNode<CancelOfferMutation, CancelOfferMutationVariables>;

export default () => {
  const [cancelOffer] = useMutation(CANCEL_OFFER_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return async (blockchainId: string) => {
    const result = await cancelOffer({
      variables: {
        input: {
          blockchainId,
        },
      },
    });
    const errors = result.data?.cancelOffer?.errors || [];
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

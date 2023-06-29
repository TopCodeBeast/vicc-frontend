import { gql, useMutation } from '@apollo/client';

import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';

import {
  RejectOfferMutation,
  RejectOfferMutationVariables,
} from './__generated__/useRejectOffer.graphql';

export const REJECT_OFFER_MUTATION = gql`
  mutation RejectOfferMutation($input: rejectOfferInput!) {
    rejectOffer(input: $input) {
      tokenOffer {
        id
        status
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
  const [rejectOffer] = useMutation<
    RejectOfferMutation,
    RejectOfferMutationVariables
  >(REJECT_OFFER_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return async (blockchainId: string, { block }: { block: boolean }) => {
    const { errors } = await rejectOffer({
      variables: {
        input: {
          blockchainId,
          block,
        },
      },
    });
    if (errors) {
      showNotification('errors', { errors });
      return errors;
    }
    return null;
  };
};

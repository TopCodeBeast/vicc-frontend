import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

import { PaymentMethodProvider } from '__generated__/globalTypes';
import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';
import { formatGqlErrors } from '@core/lib/gql';

import {
  DetachPaymentMethodMutation,
  DetachPaymentMethodMutationVariables,
} from './__generated__/useDetachPaymentMethod.graphql';

const DETACH_PAYMENT_METHOD_MUTATION = gql`
  mutation DetachPaymentMethodMutation($input: detachPaymentMethodInput!) {
    detachPaymentMethod(input: $input) {
      currentUser {
        slug
        stripePaymentMethods: paymentMethods(provider: STRIPE) {
          id
        }
        mangopayPaymentMethods: paymentMethods(provider: MANGOPAY) {
          id
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
  DetachPaymentMethodMutation,
  DetachPaymentMethodMutationVariables
>;

export default () => {
  const [detachPaymentMethod] = useMutation(DETACH_PAYMENT_METHOD_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return async (paymentMethod: string, provider: PaymentMethodProvider) => {
    const result = await detachPaymentMethod({
      variables: { input: { paymentMethod, provider } },
    });

    const errors = result.data?.detachPaymentMethod?.errors || [];

    if (errors.length) {
      showNotification(
        'errors',
        { errors: formatGqlErrors(errors) },
        { level: Level.WARN }
      );
      return errors;
    }
    showNotification('paymentMethodDetached');
    return null;
  };
};

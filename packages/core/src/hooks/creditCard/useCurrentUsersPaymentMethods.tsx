import { TypedDocumentNode, gql } from '@apollo/client';

import { Maybe, PaymentMethodProvider } from '__generated__/globalTypes';
import { CurrentUserProvider_currentUser } from '@core/contexts/currentUser/__generated__/queries.graphql';
import useQuery from '@core/hooks/graphql/useQuery';
import useMangopayCreditCardsEnabled from '@core/hooks/useMangopayCreditCardsEnabled';

import {
  PaymentProvider_currentUserQuery,
  PaymentProvider_currentUserQueryVariables,
} from './__generated__/useCurrentUsersPaymentMethods.graphql';

const PAYMENT_PROVIDER_CURRENT_USER_QUERY = gql`
  query PaymentProvider_currentUserQuery($provider: PaymentMethodProvider) {
    currentUser {
      slug
      paymentMethods(provider: $provider) {
        id
        card {
          last4
          brand
        }
      }
    }
  }
` as TypedDocumentNode<
  PaymentProvider_currentUserQuery,
  PaymentProvider_currentUserQueryVariables
>;

type PaymentProvider_currentUserQuery_currentUser_paymentMethods = NonNullable<
  PaymentProvider_currentUserQuery['currentUser']
>['paymentMethods'][number];

export const useCurrentUsersPaymentMethods = (
  currentUser: Maybe<CurrentUserProvider_currentUser> | undefined
): [
  PaymentProvider_currentUserQuery_currentUser_paymentMethods[] | null,
  boolean,
  () => void
] => {
  const useMangopayCreditCards = useMangopayCreditCardsEnabled();
  const { data, loading, refetch } = useQuery(
    PAYMENT_PROVIDER_CURRENT_USER_QUERY,
    {
      variables: {
        provider: useMangopayCreditCards
          ? PaymentMethodProvider.MANGOPAY
          : PaymentMethodProvider.STRIPE,
      },
      skip: !currentUser,
    }
  );

  return [data?.currentUser?.paymentMethods || null, loading, refetch];
};

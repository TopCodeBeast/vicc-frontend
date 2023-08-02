import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { PaymentMethodProvider } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import CreditCard from '@core/components/buyActions/CreditCard';
import Warning from '@core/contexts/intl/Warning';
import useQuery from '@core/hooks/graphql/useQuery';
import useMangopayCreditCardsEnabled from '@core/hooks/useMangopayCreditCardsEnabled';

import SettingsSection from '../SettingsSection';
import {
  CurrentUserPaymentMethodsQuery,
  CurrentUserPaymentMethodsQueryVariables,
} from './__generated__/index.graphql';
import useDetachPaymentMethod from './useDetachPaymentMethod';

const CURRENT_USER_PAYMENT_METHODS_QUERY = gql`
  query CurrentUserPaymentMethodsQuery {
    currentUser {
      slug
      stripePaymentMethods: paymentMethods(provider: STRIPE) {
        id
        card {
          ...CreditCard_creditCard
        }
      }
      mangopayPaymentMethods: paymentMethods(provider: MANGOPAY) {
        id
        card {
          ...CreditCard_creditCard
        }
      }
    }
  }
  ${CreditCard.fragments.creditCard}
` as TypedDocumentNode<
  CurrentUserPaymentMethodsQuery,
  CurrentUserPaymentMethodsQueryVariables
>;
const messages = defineMessages({
  title: {
    id: 'Settings.paymentMethods.title',
    defaultMessage: 'Credit Cards',
  },
  empty: {
    id: 'Settings.paymentMethods.empty',
    defaultMessage: 'No credit card saved.',
  },
  remove: {
    id: 'Settings.paymentMethods.remove',
    defaultMessage: 'Remove',
  },
  disabled: {
    id: 'Settings.paymentMethods.disabled',
    defaultMessage: 'disabled',
  },
});

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--c-neutral-300);
  border-radius: 8px;
  padding: var(--double-unit);
  &:first-child {
    margin-top: 0;
  }
`;

export const PaymentMethods = () => {
  const detachPaymentMethod = useDetachPaymentMethod();
  const useMangopayCreditCards = useMangopayCreditCardsEnabled();

  const { data } = useQuery(CURRENT_USER_PAYMENT_METHODS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  if (!data?.currentUser) return <LoadingIndicator />;

  const {
    currentUser: { stripePaymentMethods, mangopayPaymentMethods },
  } = data;

  const paymentMethods = [
    ...stripePaymentMethods.map(m => ({
      provider: PaymentMethodProvider.STRIPE,
      disabled: useMangopayCreditCards,
      ...m,
    })),
    ...mangopayPaymentMethods.map(m => ({
      provider: PaymentMethodProvider.MANGOPAY,
      disabled: false,
      ...m,
    })),
  ];

  return (
    <SettingsSection title={messages.title}>
      {paymentMethods.length === 0 && (
        <Warning variant="grey" title={messages.empty} />
      )}
      {paymentMethods?.length > 0 && (
        <Cards>
          {paymentMethods.map(paymentMethod => (
            <Card key={paymentMethod.id}>
              <CreditCard
                creditCard={paymentMethod.card}
                selected={false}
                color={
                  paymentMethod.disabled ? 'var(--c-neutral-600)' : undefined
                }
                suffixText={
                  paymentMethod.disabled ? (
                    <>
                      (<FormattedMessage {...messages.disabled} />)
                    </>
                  ) : undefined
                }
              />
              <Button
                color="darkGray"
                small
                medium={false}
                onClick={() => {
                  detachPaymentMethod(paymentMethod.id, paymentMethod.provider);
                }}
              >
                <FormattedMessage {...messages.remove} />
              </Button>
            </Card>
          ))}
        </Cards>
      )}
    </SettingsSection>
  );
};

export default PaymentMethods;

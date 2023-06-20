import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import CreditCard from 'components/buyActions/CreditCard';
import Warning from 'contexts/intl/Warning';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import SettingsSection from '../SettingsSection';
import { CurrentUserPaymentMethodsQuery } from './__generated__/index.graphql';
import useDetachPaymentMethod from './useDetachPaymentMethod';

const CURRENT_USER_PAYMENT_METHODS_QUERY = gql`
  query CurrentUserPaymentMethodsQuery {
    currentUser {
      slug
      paymentMethods {
        id
        card {
          ...CreditCard_creditCard
        }
      }
    }
  }
  ${CreditCard.fragments.creditCard}
`;
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

  const { data } = useQuery<CurrentUserPaymentMethodsQuery>(
    CURRENT_USER_PAYMENT_METHODS_QUERY,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  if (!data?.currentUser) return <LoadingIndicator />;

  const {
    currentUser: { paymentMethods },
  } = data;

  return (
    <SettingsSection title={messages.title}>
      {paymentMethods.length === 0 && (
        <Warning variant="grey" title={messages.empty} />
      )}
      {paymentMethods?.length > 0 && (
        <Cards>
          {paymentMethods.map(paymentMethod => (
            <Card key={paymentMethod.id}>
              <CreditCard creditCard={paymentMethod.card} selected={false} />
              <Button
                color="darkGray"
                small
                medium={false}
                onClick={() => {
                  detachPaymentMethod(paymentMethod.id);
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

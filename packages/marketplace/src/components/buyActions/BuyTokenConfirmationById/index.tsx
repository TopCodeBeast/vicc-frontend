import { gql } from '@apollo/client';

import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import BuyTokenConfirmation from '@marketplace/components/buyActions/BuyTokenConfirmation';
import { Props as SelectedPaymentMethodForConfirmationProps } from '@marketplace/components/buyActions/PaymentBox/Methods/SelectedPaymentMethodForConfirmation';

import {
  BuyTokenConfirmationQueryById,
  BuyTokenConfirmationQueryByIdVariables,
} from './__generated__/index.graphql';

const BUY_TOKEN_CONFIRMATION_QUERY = gql`
  query BuyTokenConfirmationQueryById($id: String!) {
    tokens {
      offer(id: $id) {
        id
        ...BuyTokenConfirmation_tokenOffer
      }
    }
  }
  ${BuyTokenConfirmation.fragments.tokenOffer}
`;

export type Props = {
  tokenOfferId: string;
  payment: SelectedPaymentMethodForConfirmationProps;
};

export const BuyTokenConfirmationById = ({ tokenOfferId, payment }: Props) => {
  const { data, loading } = useQuery<
    BuyTokenConfirmationQueryById,
    BuyTokenConfirmationQueryByIdVariables
  >(BUY_TOKEN_CONFIRMATION_QUERY, {
    variables: {
      id: idFromObject(tokenOfferId)!,
    },
    fetchPolicy: 'cache-first',
    skip: !tokenOfferId,
  });

  if (loading || !data) return null;
  const {
    tokens: { offer },
  } = data;

  return <BuyTokenConfirmation offer={offer} payment={payment} />;
};

export default BuyTokenConfirmationById;

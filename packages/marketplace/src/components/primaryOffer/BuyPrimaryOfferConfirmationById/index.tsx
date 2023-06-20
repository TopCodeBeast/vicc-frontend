import { gql } from '@apollo/client';
import { ReactNode } from 'react';

import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { Props as SelectedPaymentMethodForConfirmationProps } from '@sorare/marketplace/src/components/buyActions/PaymentBox/Methods/SelectedPaymentMethodForConfirmation';
import BuyPrimaryOfferConfirmation from '@sorare/marketplace/src/components/primaryOffer/BuyPrimaryOfferConfirmation';

import {
  BuyPrimaryOfferConfirmationQueryById,
  BuyPrimaryOfferConfirmationQueryByIdVariables,
} from './__generated__/index.graphql';

const BUY_PRIMARY_OFFER_CONFIRMATION_QUERY = gql`
  query BuyPrimaryOfferConfirmationQueryById($id: String!) {
    tokens {
      primaryOffer(id: $id) {
        id
        ...BuyPrimaryOfferConfirmation_primaryOffer
      }
    }
  }
  ${BuyPrimaryOfferConfirmation.fragments.primaryOffer}
`;

export type Props = {
  primaryOfferId: string;
  customAmountDisplay?: ReactNode;
  payment: SelectedPaymentMethodForConfirmationProps;
};

export const BuyPrimaryOfferConfirmationById = ({
  primaryOfferId,
  customAmountDisplay,
  payment,
}: Props) => {
  const { data, loading } = useQuery<
    BuyPrimaryOfferConfirmationQueryById,
    BuyPrimaryOfferConfirmationQueryByIdVariables
  >(BUY_PRIMARY_OFFER_CONFIRMATION_QUERY, {
    variables: { id: idFromObject(primaryOfferId)! },
    fetchPolicy: 'cache-first',
    skip: !primaryOfferId,
  });

  if (!data || loading) return null;

  const {
    tokens: { primaryOffer },
  } = data;

  return (
    <BuyPrimaryOfferConfirmation
      primaryOffer={primaryOffer}
      customAmountDisplay={customAmountDisplay}
      payment={payment}
    />
  );
};

export default BuyPrimaryOfferConfirmationById;

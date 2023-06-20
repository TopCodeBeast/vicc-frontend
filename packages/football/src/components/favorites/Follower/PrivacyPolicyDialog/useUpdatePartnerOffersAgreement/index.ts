import { gql } from '@apollo/client';

import { updatePartnerOffersAgreementInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  UpdatePartnerOffersAgreementMutation,
  UpdatePartnerOffersAgreementMutationVariables,
} from './__generated__/index.graphql';

const UPDATE_PARTNER_OFFERS_AGREEMENT = gql`
  mutation UpdatePartnerOffersAgreementMutation(
    $input: updatePartnerOffersAgreementInput!
  ) {
    updatePartnerOffersAgreement(input: $input) {
      errors {
        message
        code
      }
    }
  }
`;

const useUpdatePartnerOffersAgreement = () => {
  const [mutate] = useMutation<
    UpdatePartnerOffersAgreementMutation,
    UpdatePartnerOffersAgreementMutationVariables
  >(UPDATE_PARTNER_OFFERS_AGREEMENT);

  return async (input: updatePartnerOffersAgreementInput) => {
    return mutate({
      variables: { input },
    });
  };
};

export default useUpdatePartnerOffersAgreement;

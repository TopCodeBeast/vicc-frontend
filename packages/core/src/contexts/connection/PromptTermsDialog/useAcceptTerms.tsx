import { gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { currentUser } from '@core/contexts/currentUser/queries';

import {
  AcceptTermsMutation,
  AcceptTermsMutationVariables,
} from './__generated__/useAcceptTerms.graphql';

type AcceptTermsMutation_acceptTerms = NonNullable<
  AcceptTermsMutation['acceptTerms']
>;

export interface AcceptTermsArgs {
  acceptTerms: boolean;
  acceptAgeLimit: boolean;
  acceptPrivacyPolicy: boolean;
  acceptGameRules: boolean;
  agreedToReceiveOffersFromPartners: boolean;
  tcuToken?: string | null;
}

const ACCEPT_TERMS_MUTATION = gql`
  mutation AcceptTermsMutation($input: acceptTermsInput!) {
    acceptTerms(input: $input) {
      result
      currentUser {
        slug
        mustAcceptTcus
        ...CurrentUserProvider_currentUser
      }
      errors {
        code
        message
        path
      }
    }
  }
  ${currentUser}
`;

export default (): [
  (
    args: AcceptTermsArgs
  ) => Promise<AcceptTermsMutation_acceptTerms | null | undefined>
] => {
  const [acceptTerms] = useMutation<
    AcceptTermsMutation,
    AcceptTermsMutationVariables
  >(ACCEPT_TERMS_MUTATION);

  return [
    useCallback(
      async (
        input: AcceptTermsArgs
      ): Promise<AcceptTermsMutation_acceptTerms | null | undefined> => {
        const result = await acceptTerms({
          variables: {
            input,
          },
        });
        return result.data?.acceptTerms;
      },
      [acceptTerms]
    ),
  ];
};

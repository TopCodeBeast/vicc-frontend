import { gql, useMutation } from '@apollo/client';

import { Maybe } from '__generated__/globalTypes';
import { Level, useSnackNotificationContext } from 'contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/lib/gql';

import {
  VerifyPhoneNumberMutation,
  VerifyPhoneNumberMutationVariables,
} from './__generated__/useVerifyPhoneNumber.graphql';

export const PHONE_NUMBER_ALREADY_USED = 10_004;

/**
 * Code of the error returned whenever there is already a pending phone number verification
 * request for that phone number.
 */
const PHONE_NUMBER_PENDING_VERIFICATION = 10_006;

export const canProceedToVerificationCodeInput = (
  errors: Maybe<
    NonNullable<VerifyPhoneNumberMutation['verifyPhoneNumber']>['errors']
  >
) => {
  return (
    !errors ||
    errors.length === 0 ||
    (errors.length === 1 &&
      errors[0].code === PHONE_NUMBER_PENDING_VERIFICATION)
  );
};

export const VERIFY_PHONE_NUMBER_MUTATION = gql`
  mutation VerifyPhoneNumberMutation($input: verifyPhoneNumberInput!) {
    verifyPhoneNumber(input: $input) {
      currentUser {
        slug
        phoneNumber
        phoneNumberVerificationRequested
        unverifiedPhoneNumber
      }
      errors {
        code
        path
        message
      }
    }
  }
`;

export default () => {
  const [verifyPhoneNumber] = useMutation<
    VerifyPhoneNumberMutation,
    VerifyPhoneNumberMutationVariables
  >(VERIFY_PHONE_NUMBER_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return async (phoneNumber: string) => {
    const result = await verifyPhoneNumber({
      variables: {
        input: {
          phoneNumber,
        },
      },
    });

    const errors = result.data?.verifyPhoneNumber?.errors || [];

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

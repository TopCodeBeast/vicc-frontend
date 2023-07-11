import { gql } from '@apollo/client';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  ResendConfirmationInstructionsMutation,
  ResendConfirmationInstructionsMutationVariables,
} from './__generated__/useResendConfirmationInstructions.graphql';

const RESEND_CONFIRMATION_INSTRUCTIONS = gql`
  mutation ResendConfirmationInstructionsMutation(
    $input: resendConfirmationInstructionsInput!
  ) {
    resendConfirmationInstructions(input: $input) {
      errors {
        message
        code
      }
    }
  }
`;

const useResendConfirmationInstructions = () => {
  const [mutate] = useMutation<
    ResendConfirmationInstructionsMutation,
    ResendConfirmationInstructionsMutationVariables
  >(RESEND_CONFIRMATION_INSTRUCTIONS, {
    showErrorsWithSnackNotification: true,
  });
  return mutate;
};

export default useResendConfirmationInstructions;

import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

import useQuery from '@core/hooks/graphql/useQuery';

import {
  Disable2FAMutation,
  Disable2FAMutationVariables,
  Enable2FAMutation,
  Enable2FAMutationVariables,
  GenerateOtpBackupCodesMutation,
  GenerateOtpBackupCodesMutationVariables,
  Update2FAQuery,
  Update2FAQueryVariables,
} from './__generated__/useUpdate2FA.graphql';

const ENABLE_2FA_MUTATION = gql`
  mutation Enable2FAMutation($input: enable2faInput!) {
    enable2Fa(input: $input) {
      currentUser {
        slug
        otpRequiredForLogin
      }
      otpBackupCodes
      errors {
        message
        code
      }
    }
  }
` as TypedDocumentNode<Enable2FAMutation, Enable2FAMutationVariables>;

const DISABLE_2FA_MUTATION = gql`
  mutation Disable2FAMutation($input: disable2faInput!) {
    disable2Fa(input: $input) {
      currentUser {
        slug
        otpRequiredForLogin
      }
      errors {
        message
        code
      }
    }
  }
` as TypedDocumentNode<Disable2FAMutation, Disable2FAMutationVariables>;

export const UPDATE_2FA_QUERY = gql`
  query Update2FAQuery {
    currentUser {
      slug
      otpProvisioningUri
    }
  }
` as TypedDocumentNode<Update2FAQuery, Update2FAQueryVariables>;

const GENERATE_OTP_BACKUP_CODES_MUTATION = gql`
  mutation GenerateOtpBackupCodesMutation(
    $input: generateOtpBackupCodesInput!
  ) {
    generateOtpBackupCodes(input: $input) {
      currentUser {
        slug
        otpRequiredForLogin
      }
      otpBackupCodes
      errors {
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  GenerateOtpBackupCodesMutation,
  GenerateOtpBackupCodesMutationVariables
>;

const useUpdate2FA = () => {
  const [enable2FAMutation] = useMutation(ENABLE_2FA_MUTATION, {
    refetchQueries: [{ query: UPDATE_2FA_QUERY }],
    awaitRefetchQueries: true,
  });
  const [disable2FAMutation] = useMutation(DISABLE_2FA_MUTATION, {
    refetchQueries: [{ query: UPDATE_2FA_QUERY }],
    awaitRefetchQueries: true,
  });
  const [generateRecoveryCodesMutation] = useMutation(
    GENERATE_OTP_BACKUP_CODES_MUTATION
  );

  const { loading, data } = useQuery(UPDATE_2FA_QUERY);

  return {
    enable2FAMutation,
    disable2FAMutation,
    generateRecoveryCodesMutation,
    update2FAQuery: { loading, data },
  };
};

export default useUpdate2FA;

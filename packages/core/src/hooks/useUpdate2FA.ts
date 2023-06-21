import { gql, useMutation } from '@apollo/client';

import useQuery from '@core/hooks/graphql/useQuery';

import {
  Disable2FAMutation,
  Disable2FAMutationVariables,
  Enable2FAMutation,
  Enable2FAMutationVariables,
  GenerateOtpBackupCodesMutation,
  GenerateOtpBackupCodesMutationVariables,
  Update2FAQuery,
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
`;

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
`;

export const UPDATE_2FA_QUERY = gql`
  query Update2FAQuery {
    currentUser {
      slug
      otpProvisioningUri
    }
  }
`;

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
`;

const useUpdate2FA = () => {
  const [enable2FAMutation] = useMutation<
    Enable2FAMutation,
    Enable2FAMutationVariables
  >(ENABLE_2FA_MUTATION, {
    refetchQueries: [{ query: UPDATE_2FA_QUERY }],
    awaitRefetchQueries: true,
  });
  const [disable2FAMutation] = useMutation<
    Disable2FAMutation,
    Disable2FAMutationVariables
  >(DISABLE_2FA_MUTATION, {
    refetchQueries: [{ query: UPDATE_2FA_QUERY }],
    awaitRefetchQueries: true,
  });
  const [generateRecoveryCodesMutation] = useMutation<
    GenerateOtpBackupCodesMutation,
    GenerateOtpBackupCodesMutationVariables
  >(GENERATE_OTP_BACKUP_CODES_MUTATION);

  const { loading, data } = useQuery<Update2FAQuery>(UPDATE_2FA_QUERY);

  return {
    enable2FAMutation,
    disable2FAMutation,
    generateRecoveryCodesMutation,
    update2FAQuery: { loading, data },
  };
};

export default useUpdate2FA;

import { TypedDocumentNode, gql } from '@apollo/client';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  LogOutAllDevicesMutation,
  LogOutAllDevicesMutationVariables,
} from './__generated__/useLogoutAllDevices.graphql';

const LOG_OUT_ALL_DEVICES_MUTATION = gql`
  mutation LogOutAllDevicesMutation($input: signOutFromAllDevicesInput!) {
    signOutFromAllDevices(input: $input) {
      errors {
        path
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  LogOutAllDevicesMutation,
  LogOutAllDevicesMutationVariables
>;

const useLogOutAllDevices = () => {
  const [logOutAllDevices] = useMutation(LOG_OUT_ALL_DEVICES_MUTATION);

  return { logOutAllDevices };
};

export default useLogOutAllDevices;

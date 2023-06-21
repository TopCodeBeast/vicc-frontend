import { gql } from '@apollo/client';
import { useCallback } from 'react';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  AddDeviceMutation,
  AddDeviceMutationVariables,
} from './__generated__/useAddDevice.graphql';

const addDeviceMutation = gql`
  mutation AddDeviceMutation($input: addDeviceInput!) {
    addDevice(input: $input) {
      currentUser {
        slug
        confirmedDevice
      }
      deliveryType
      errors {
        code
        message
        path
      }
    }
  }
`;

export const useAddDevice = () => {
  const [mutate] = useMutation<AddDeviceMutation, AddDeviceMutationVariables>(
    addDeviceMutation,
    {
      showErrorsWithSnackNotification: true,
    }
  );

  return useCallback(
    async () =>
      mutate({ variables: { input: {} } }).then(({ errors, data }) => {
        return {
          errors: errors || [],
          deliveryType: data?.addDevice?.deliveryType || [],
        };
      }),
    [mutate]
  );
};

export default useAddDevice;

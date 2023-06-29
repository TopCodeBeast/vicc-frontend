import { gql, useMutation } from '@apollo/client';

import { deleteSo5UserGroupInput } from '@sorare/core/src/__generated__/globalTypes';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import {
  DeleteSo5UserGroupMutation,
  DeleteSo5UserGroupMutationVariables,
} from './__generated__/useDeleteSo5UserGroup.graphql';

const DELETE_SO5USERGROUP_MUTATION = gql`
  mutation DeleteSo5UserGroupMutation($input: deleteSo5UserGroupInput!) {
    deleteSo5UserGroup(input: $input) {
      errors {
        message
        code
      }
    }
  }
`;

const useDeleteSo5UserGroup = () => {
  const [mutate] = useMutation<
    DeleteSo5UserGroupMutation,
    DeleteSo5UserGroupMutationVariables
  >(DELETE_SO5USERGROUP_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return async (input: deleteSo5UserGroupInput) => {
    const { data } = await mutate({
      variables: { input },
      refetchQueries: ['GetMyUserGroupsQuery'],
    });

    if (data) {
      const errors = data?.deleteSo5UserGroup?.errors || [];
      if (errors.length) {
        showNotification('errors', { errors: formatGqlErrors(errors) });
        return errors;
      }

      showNotification('so5UserGroupDeleted');
      return data;
    }
    return null;
  };
};

export default useDeleteSo5UserGroup;

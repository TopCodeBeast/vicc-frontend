import { gql, useMutation } from '@apollo/client';
import { useIntl } from 'react-intl';

import { removeUserFromVicc5UserGroupInput as removeUserFromSo5UserGroupInput } from '@sorare/core/src/__generated__/globalTypes';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import {
  RemoveSo5UserFromGroupMutation,
  RemoveSo5UserFromGroupMutationVariables,
} from './__generated__/useRemoveSo5UserFromGroup.graphql';

const REMOVE_SO5USER_FROM_USERGROUP_MUTATION = gql`
  mutation RemoveSo5UserFromGroupMutation(
    $input: removeUserFromVicc5UserGroupInput!
  ) {
    removeUserFromSo5UserGroup: removeUserFromVicc5UserGroup(input: $input) {
      so5UserGroup: vicc5UserGroup {
        slug
        displayName
      }
      errors {
        message
        code
      }
    }
  }
`;

const useRemoveSo5UserFromGroup = (refetch?: boolean) => {
  const [mutate] = useMutation<
    RemoveSo5UserFromGroupMutation,
    RemoveSo5UserFromGroupMutationVariables
  >(REMOVE_SO5USER_FROM_USERGROUP_MUTATION);
  const { showNotification } = useSnackNotificationContext();
  const { formatMessage } = useIntl();

  return async (
    input: removeUserFromSo5UserGroupInput,
    nickname: string | null
  ) => {
    const { data } = await mutate({
      variables: { input },
      refetchQueries: refetch ? ['GetMyUserGroupsQuery'] : [],
    });

    if (data) {
      const so5UserGroup = data?.removeUserFromSo5UserGroup?.so5UserGroup;
      const group = so5UserGroup?.displayName;
      const user =
        nickname ||
        formatMessage({
          id: 'RemoveSo5UserFromGroupNotification.Nickname.Unknown',
          defaultMessage: 'someone',
        });

      if (nickname === null) {
        showNotification('so5RemovedSelfFromGroup', {
          group,
        });
      } else {
        showNotification('so5RemovedUserFromGroup', {
          user,
          group,
        });
      }

      const errors = data?.removeUserFromSo5UserGroup?.errors || [];
      if (errors.length) {
        showNotification('errors', { errors: formatGqlErrors(errors) });
        return { errors, data: null };
      }

      return { data, errors: null };
    }
    return null;
  };
};

export default useRemoveSo5UserFromGroup;

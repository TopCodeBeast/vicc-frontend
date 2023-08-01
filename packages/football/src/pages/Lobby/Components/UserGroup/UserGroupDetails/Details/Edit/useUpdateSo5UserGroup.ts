import { gql } from '@apollo/client';

import { updateVicc5UserGroupInput as updateSo5UserGroupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  UpdateSo5UserGroup,
  UpdateSo5UserGroupVariables,
} from './__generated__/useUpdateSo5UserGroup.graphql';

export const UPDATE_SO5_USER_GROUP = gql`
  mutation UpdateSo5UserGroup($input: updateVicc5UserGroupInput!) {
    updateSo5UserGroup: updateVicc5UserGroup(input: $input) {
      errors {
        path
        message
        code
      }
    }
  }
`;

const useUpdateSo5UserGroup = () => {
  const [updateSo5UserGroup] = useMutation<
    UpdateSo5UserGroup,
    UpdateSo5UserGroupVariables
  >(UPDATE_SO5_USER_GROUP, {
    showErrorsInForm: true,
  });

  return async (input: updateSo5UserGroupInput) =>
    updateSo5UserGroup({
      variables: { input },
      refetchQueries: ['GetMyUserGroupsQuery', 'GetUserGroupDetailsTabQuery'],
    });
};

export default useUpdateSo5UserGroup;

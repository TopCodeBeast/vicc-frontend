import { gql, useMutation } from '@apollo/client';

import { createSo5UserGroupInput } from '@sorare/core/src/__generated__/globalTypes';

import {
  CreateSo5UserGroup,
  CreateSo5UserGroupVariables,
} from './__generated__/useCreateSo5UserGroup.graphql';

const CREATE_SO5_USER_GROUP = gql`
  mutation CreateSo5UserGroup($input: createSo5UserGroupInput!) {
    createSo5UserGroup(input: $input) {
      so5UserGroup {
        joinSecret
        description
        displayName
        logo {
          pictureUrl
        }
        slug
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

export default () => {
  const [createSo5UserGroup] = useMutation<
    CreateSo5UserGroup,
    CreateSo5UserGroupVariables
  >(CREATE_SO5_USER_GROUP);

  return async (input: createSo5UserGroupInput) =>
    createSo5UserGroup({
      variables: { input },
      refetchQueries: ['GetMyUserGroupsQuery'],
    });
};

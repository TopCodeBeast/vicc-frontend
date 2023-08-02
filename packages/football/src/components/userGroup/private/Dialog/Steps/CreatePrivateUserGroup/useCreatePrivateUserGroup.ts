import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

import { createSo5UserGroupInput } from '@sorare/core/src/__generated__/globalTypes';

import {
  CreatePrivateUserGroup,
  CreatePrivateUserGroupVariables,
} from './__generated__/useCreatePrivateUserGroup.graphql';

const CREATE_PRIVATE_USER_GROUP = gql`
  mutation CreatePrivateUserGroup($input: createSo5UserGroupInput!) {
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
` as TypedDocumentNode<CreatePrivateUserGroup, CreatePrivateUserGroupVariables>;

export default () => {
  const [createSo5UserGroup] = useMutation(CREATE_PRIVATE_USER_GROUP);

  return async (input: createSo5UserGroupInput) =>
    createSo5UserGroup({
      variables: { input },
      refetchQueries: ['GetMyPrivateUserGroupsQuery'],
    });
};

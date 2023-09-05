import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

import { createVicc5UserGroupInput } from '@sorare/core/src/__generated__/globalTypes';

import {
  CreatePrivateUserGroup,
  CreatePrivateUserGroupVariables,
} from './__generated__/useCreatePrivateUserGroup.graphql';

const CREATE_PRIVATE_USER_GROUP = gql`
  mutation CreatePrivateUserGroup($input: createVicc5UserGroupInput!) {
    createVicc5UserGroup(input: $input) {
      vicc5UserGroup {
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
  const [createVicc5UserGroup] = useMutation(CREATE_PRIVATE_USER_GROUP);

  return async (input: createVicc5UserGroupInput) =>
    createVicc5UserGroup({
      variables: { input },
      refetchQueries: ['GetMyPrivateUserGroupsQuery'],
    });
};

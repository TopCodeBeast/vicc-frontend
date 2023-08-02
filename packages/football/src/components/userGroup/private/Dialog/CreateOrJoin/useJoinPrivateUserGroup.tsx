import { TypedDocumentNode, gql } from '@apollo/client';

import { joinSo5UserGroupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import { fragments } from '@football/components/userGroup/private/Dialog/fragments';

import {
  JoinPrivateUserGroupMutation,
  JoinPrivateUserGroupMutationVariables,
} from './__generated__/useJoinPrivateUserGroup.graphql';

const JOIN_PRIVATE_USER_GROUP_MUTATION = gql`
  mutation JoinPrivateUserGroupMutation($input: joinSo5UserGroupInput!) {
    joinSo5UserGroup(input: $input) {
      so5UserGroup {
        slug
        administrator {
          slug
          nickname
        }
        myMembership {
          createdAt
        }
        ...so5UserGroup
      }
      errors {
        message
        code
      }
    }
  }
  ${fragments.so5UserGroup}
` as TypedDocumentNode<
  JoinPrivateUserGroupMutation,
  JoinPrivateUserGroupMutationVariables
>;

const useJoinPrivateUserGroup = (showErrorsInForm?: boolean) => {
  const [mutate] = useMutation(JOIN_PRIVATE_USER_GROUP_MUTATION, {
    showErrorsInForm,
  });

  return async (input: joinSo5UserGroupInput) => {
    return mutate({
      variables: { input },
      refetchQueries: ['GetMyPrivateUserGroupsQuery'],
    });
  };
};

export default useJoinPrivateUserGroup;

import { TypedDocumentNode, gql } from '@apollo/client';

import { joinVicc5UserGroupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import { fragments } from '@football/components/userGroup/private/Dialog/fragments';

import {
  JoinPrivateUserGroupMutation,
  JoinPrivateUserGroupMutationVariables,
} from './__generated__/useJoinPrivateUserGroup.graphql';

const JOIN_PRIVATE_USER_GROUP_MUTATION = gql`
  mutation JoinPrivateUserGroupMutation($input: joinVicc5UserGroupInput!) {
    joinVicc5UserGroup(input: $input) {
      vicc5UserGroup {
        slug
        administrator {
          slug
          nickname
        }
        myMembership {
          createdAt
        }
        ...vicc5UserGroup
      }
      errors {
        message
        code
      }
    }
  }
  ${fragments.vicc5UserGroup}
` as TypedDocumentNode<
  JoinPrivateUserGroupMutation,
  JoinPrivateUserGroupMutationVariables
>;

const useJoinPrivateUserGroup = (showErrorsInForm?: boolean) => {
  const [mutate] = useMutation(JOIN_PRIVATE_USER_GROUP_MUTATION, {
    showErrorsInForm,
  });

  return async (input: joinVicc5UserGroupInput) => {
    return mutate({
      variables: { input },
      refetchQueries: ['GetMyPrivateUserGroupsQuery'],
    });
  };
};

export default useJoinPrivateUserGroup;

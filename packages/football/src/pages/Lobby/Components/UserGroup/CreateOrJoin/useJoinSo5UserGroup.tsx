import { gql } from '@apollo/client';

import { joinVicc5UserGroupInput as joinSo5UserGroupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import { fragments } from '@football/pages/Lobby/Components/UserGroup/UserGroupDialog/fragments';

import {
  JoinSo5UserGroupMutation,
  JoinSo5UserGroupMutationVariables,
} from './__generated__/useJoinSo5UserGroup.graphql';

const JOIN_USERGROUP_MUTATION = gql`
  mutation JoinSo5UserGroupMutation($input: joinVicc5UserGroupInput!) {
    joinSo5UserGroup: joinVicc5UserGroup(input: $input) {
      so5UserGroup: vicc5UserGroup {
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
`;

const useJoinSo5UserGroup = (showErrorsInForm?: boolean) => {
  const [mutate] = useMutation<
    JoinSo5UserGroupMutation,
    JoinSo5UserGroupMutationVariables
  >(JOIN_USERGROUP_MUTATION, { showErrorsInForm });

  return async (input: joinSo5UserGroupInput) => {
    return mutate({
      variables: { input },
      refetchQueries: ['GetMyUserGroupsQuery'],
    });
  };
};

export default useJoinSo5UserGroup;

import { TypedDocumentNode, gql } from '@apollo/client';

import {
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
} from './__generated__/queries.graphql';

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePasswordMutation($input: changePasswordInput!) {
    changePassword(input: $input) {
      clientMutationId
      currentUser {
        slug
      }
      errors {
        path
        message
        code
      }
    }
  }
` as TypedDocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;

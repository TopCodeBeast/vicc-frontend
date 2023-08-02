import { TypedDocumentNode, gql } from '@apollo/client';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  CreateCardRegistration,
  CreateCardRegistrationVariables,
} from './__generated__/useCreateCardRegistration.graphql';

const CREATE_CARD_REGISTRATION = gql`
  mutation CreateCardRegistration($input: createCardRegistrationInput!) {
    createCardRegistration(input: $input) {
      preRegistrationData {
        accessKey
        cardRegistrationUrl
        data
        id
      }
      errors {
        message
        code
        path
      }
    }
  }
` as TypedDocumentNode<CreateCardRegistration, CreateCardRegistrationVariables>;

export const useCreateCardRegistration = () => {
  return useMutation<CreateCardRegistration, CreateCardRegistrationVariables>(
    CREATE_CARD_REGISTRATION
  );
};

import { TypedDocumentNode, gql } from '@apollo/client';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  FetchEncryptedPrivateKey,
  FetchEncryptedPrivateKeyVariables,
} from './__generated__/useFetchEncryptedPrivateKeyMutation.graphql';

const FETCH_ENCRYPTED_PRIVATE_KEY_MUTATION = gql`
  mutation FetchEncryptedPrivateKey($input: fetchEncryptedPrivateKeyInput!) {
    fetchEncryptedPrivateKey(input: $input) {
      sorarePrivateKey {
        encryptedPrivateKey
        iv
        salt
      }
      errors {
        path
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  FetchEncryptedPrivateKey,
  FetchEncryptedPrivateKeyVariables
>;

export const useFetchEncryptedPrivateKeyMutation = () =>
  useMutation<FetchEncryptedPrivateKey, FetchEncryptedPrivateKeyVariables>(
    FETCH_ENCRYPTED_PRIVATE_KEY_MUTATION,
    {
      showErrorsInForm: true,
    }
  );

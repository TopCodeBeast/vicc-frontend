import { TypedDocumentNode, gql } from '@apollo/client';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import PostalAddressForm from '@core/components/settings/PostalAddressForm';
import useMutation from '@core/hooks/graphql/useMutation';

import {
  DeletePostalAddressMutation,
  DeletePostalAddressMutationVariables,
} from './__generated__/useDeleteUserPostalAddress.graphql';

const QUERY = gql`
  mutation DeletePostalAddressMutation($input: deletePostalAddressInput!) {
    deletePostalAddress(input: $input) {
      currentUser {
        slug
        id
        userSettings {
          id
          ...PostalAddressForm_userSettings
        }
      }
      errors {
        message
        code
      }
    }
  }
  ${PostalAddressForm.fragments.userSettings}
` as TypedDocumentNode<
  DeletePostalAddressMutation,
  DeletePostalAddressMutationVariables
>;

export default () => {
  const [mutate, { loading }] = useMutation(QUERY, {
    showErrorsWithSnackNotification: true,
  });

  return {
    deleteUserPostalAddress: async () => mutate({ variables: { input: {} } }),
    loading,
  };
};

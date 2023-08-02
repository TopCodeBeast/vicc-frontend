import { TypedDocumentNode, gql } from '@apollo/client';

import { PostalAddressInput } from '__generated__/globalTypes';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import PostalAddressForm from '@core/components/settings/PostalAddressForm';
import useMutation from '@core/hooks/graphql/useMutation';

import {
  UpdateUserPostalAddressMutation,
  UpdateUserPostalAddressMutationVariables,
} from './__generated__/useUpdateUserPostalAddress.graphql';

const UPDATE_POSTAL_ADDRESS_MUTATION = gql`
  mutation UpdateUserPostalAddressMutation($input: updateUserSettingsInput!) {
    updateUserSettings(input: $input) {
      currentUser {
        slug
        userSettings {
          id
          ...PostalAddressForm_userSettings
        }
      }
      errors {
        path
        message
        code
      }
    }
  }
  ${PostalAddressForm.fragments.userSettings}
` as TypedDocumentNode<
  UpdateUserPostalAddressMutation,
  UpdateUserPostalAddressMutationVariables
>;

export default () => {
  const [mutate] = useMutation(UPDATE_POSTAL_ADDRESS_MUTATION);

  return async (postalAddress: PostalAddressInput) =>
    mutate({
      variables: {
        input: {
          postalAddress,
        },
      },
    });
};

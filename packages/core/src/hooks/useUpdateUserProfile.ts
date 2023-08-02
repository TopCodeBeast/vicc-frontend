import {
  FetchResult,
  TypedDocumentNode,
  gql,
  useMutation,
} from '@apollo/client';

// eslint-disable-next-line import/named
import { updateUserProfileInput } from '__generated__/globalTypes';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';

import {
  UpdateUserProfileMutation,
  UpdateUserProfileMutationVariables,
} from './__generated__/useUpdateUserProfile.graphql';

const UPDATE_USER_PROFILE_MUTATION = gql`
  mutation UpdateUserProfileMutation($input: updateUserProfileInput!) {
    updateUserProfile(input: $input) {
      userProfile {
        id
        status
        clubName
        pictureUrl
        clubShield {
          id
          pictureUrl
        }
        clubBanner {
          id
          pictureUrl
        }
        user {
          slug
          nickname
        }
        marketplacePreferences(sports: [FOOTBALL, NBA, BASEBALL]) {
          sport
          preferences {
            name
            value
          }
        }
      }
      errors {
        path
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  UpdateUserProfileMutation,
  UpdateUserProfileMutationVariables
>;

export default () => {
  const [mutate] = useMutation(UPDATE_USER_PROFILE_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return async (input: updateUserProfileInput) => {
    const { data, errors } = (await mutate({
      variables: {
        input,
      },
    })) as FetchResult<UpdateUserProfileMutation>;

    if (data) {
      return data.updateUserProfile!;
    }
    showNotification('errors', errors);
    return null;
  };
};

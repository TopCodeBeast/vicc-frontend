import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import Button from '@core/atoms/buttons/Button';
import useMutation from '@core/hooks/graphql/useMutation';

import {
  DisconnectOmniauthProviderMutation,
  DisconnectOmniauthProviderMutationVariables,
} from './__generated__/index.graphql';

const DISCONNECT_OMNIAUTH_PROVIDER_MUTATION = gql`
  mutation DisconnectOmniauthProviderMutation(
    $input: disconnectOmniauthProviderInput!
  ) {
    disconnectOmniauthProvider(input: $input) {
      userProfile {
        id
        discordUsername
        twitterUsername
      }
      currentUser {
        slug
        # connectedOauths {
        #   id
        #   email
        #   provider
        # }
      }
      errors {
        message
        code
      }
    }
  }
`;

type Props = {
  email: string | null;
  provider: 'discord' | 'twitter' | 'google_oauth2' | 'facebook';
};

export const Disconnect = ({ email, provider }: Props) => {
  const [disconnect] = useMutation<
    DisconnectOmniauthProviderMutation,
    DisconnectOmniauthProviderMutationVariables
  >(DISCONNECT_OMNIAUTH_PROVIDER_MUTATION, {
    showErrorsWithSnackNotification: true,
  });
  return (
    <Button
      type="button"
      onClick={() => {
        disconnect({
          variables: {
            input: {
              provider,
              email,
            },
          },
        });
      }}
      small
      color="darkGray"
    >
      <FormattedMessage id="OAuthAccount.unlink" defaultMessage="Unlink" />
    </Button>
  );
};
export default Disconnect;

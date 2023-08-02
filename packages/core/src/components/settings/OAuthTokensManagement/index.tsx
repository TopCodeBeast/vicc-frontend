import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';

import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Text16 } from '@core/atoms/typography';
import useQuery from '@core/hooks/graphql/useQuery';

import SettingsSection from '../SettingsSection';
import { OAuthToken } from './OAuthToken';
import {
  ConnectedOAuthAccessTokensQuery,
  ConnectedOAuthAccessTokensQueryVariables,
} from './__generated__/index.graphql';

const messages = defineMessages({
  title: {
    id: 'Settings.OAuthTokensManagement.applications',
    defaultMessage: 'Applications',
  },
  noTokens: {
    id: 'Settings.OAuthTokensManagement.noTokens',
    defaultMessage:
      'You are not currently connected to any third party applications.',
  },
  myConnectedOAuthTokens: {
    id: 'Settings.OAuthTokensManagement.myConnectedApplications',
    defaultMessage: 'My connected applications',
  },
});

const CONNECTED_O_AUTH_ACCESS_TOKENS_QUERY = gql`
  query ConnectedOAuthAccessTokensQuery {
    currentUser {
      id
      slug
      connectedOAuthAccessTokens {
        id
        ...OAuthToken_oAuthAccessToken
      }
    }
  }
  ${OAuthToken.fragments.oAuthAccessToken}
` as TypedDocumentNode<
  ConnectedOAuthAccessTokensQuery,
  ConnectedOAuthAccessTokensQueryVariables
>;

export const OAuthTokensManagement = () => {
  const { data, loading } = useQuery(CONNECTED_O_AUTH_ACCESS_TOKENS_QUERY);

  const accessTokens = data?.currentUser?.connectedOAuthAccessTokens;

  return (
    <SettingsSection title={messages.title}>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div>
          {accessTokens?.length ? (
            <>
              {accessTokens.map(accessToken => (
                <OAuthToken
                  key={accessToken.id}
                  oAuthAccessToken={accessToken}
                />
              ))}
            </>
          ) : (
            <Text16 color="var(--c-neutral-600)">
              <FormattedMessage {...messages.noTokens} />
            </Text16>
          )}
        </div>
      )}
    </SettingsSection>
  );
};

import { TypedDocumentNode, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { LANDING } from '@core/constants/routes';
import { useSentryContext } from '@core/contexts/sentry';
import useMutation from '@core/hooks/graphql/useMutation';
import { TOKEN_QUERY_PARAMETER } from '@core/lib/ephemeralLinks';

import {
  CreateEphemeralLinkMutation,
  CreateEphemeralLinkMutationVariables,
} from './__generated__/index.graphql';

const createEphemeralLinkMutation = gql`
  mutation CreateEphemeralLinkMutation($input: createEphemeralLinkInput!) {
    createEphemeralLink(input: $input) {
      url
      errors {
        code
        message
      }
    }
  }
` as TypedDocumentNode<
  CreateEphemeralLinkMutation,
  CreateEphemeralLinkMutationVariables
>;

const currentUrl = () => {
  const { location } = window;
  const baseUrl = `${location.protocol}//${location.hostname}`;
  if (location.port) {
    return `${baseUrl}:${location.port}/`;
  }
  return `${baseUrl}/`;
};

const V4Body = () => {
  const navigate = useNavigate();
  const [generatingToken, setGeneratingToken] = useState(false);
  const { sendSafeError } = useSentryContext();

  const [createEphemeralLink] = useMutation(createEphemeralLinkMutation, {
    showErrorsWithSnackNotification: true,
  });

  useEffect(() => {
    if (!generatingToken) {
      setGeneratingToken(true);
      createEphemeralLink({
        variables: {
          input: {
            url: currentUrl(),
          },
        },
      }).then(({ data }) => {
        if (data?.createEphemeralLink?.url) {
          const { url } = data.createEphemeralLink;
          const token = new URL(url).searchParams.get(TOKEN_QUERY_PARAMETER);
          if (!token) {
            sendSafeError('Invalid ephemeral link format returned.');
            return;
          }
          window.location.assign(
            `sorare://login?token=${encodeURIComponent(token)}`
          );
        } else {
          navigate(LANDING);
        }
      });
    }
  }, [sendSafeError, createEphemeralLink, generatingToken, navigate]);

  return <LoadingIndicator fullHeight />;
};

export default V4Body;

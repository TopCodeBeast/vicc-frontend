import { TypedDocumentNode, gql } from '@apollo/client';
import { faCircleQuestion } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import LoadingButton from '@core/atoms/buttons/LoadingButton';
import { Text14 } from '@core/atoms/typography';
import Bold from '@core/atoms/typography/Bold';
import ConfirmDialog from '@core/components/form/ConfirmDialog';
import { useIntlContext } from '@core/contexts/intl';
import useMutation from '@core/hooks/graphql/useMutation';
import useToggle from '@core/hooks/useToggle';

import {
  OAuthToken_oAuthAccessToken,
  RevokeOAuthAccessTokenMutation,
  RevokeOAuthAccessTokenMutationVariables,
} from './__generated__/index.graphql';

type Props = {
  oAuthAccessToken: OAuthToken_oAuthAccessToken;
};

const fragment = gql`
  fragment OAuthToken_oAuthAccessToken on OAuthAccessToken {
    id
    createdAt
    expiresAt
    application {
      name
      pictureUrl
      scopes
    }
    scopes
  }
` as TypedDocumentNode<OAuthToken_oAuthAccessToken>;

const REVOKE_O_AUTH_ACCESS_TOKEN_MUTATION = gql`
  mutation RevokeOAuthAccessTokenMutation(
    $input: revokeOAuthAccessTokenInput!
  ) {
    revokeOAuthAccessToken(input: $input) {
      currentUser {
        id
        slug
        connectedOAuthAccessTokens {
          id
          ...OAuthToken_oAuthAccessToken
        }
      }
    }
  }
  ${fragment}
` as TypedDocumentNode<
  RevokeOAuthAccessTokenMutation,
  RevokeOAuthAccessTokenMutationVariables
>;

const Root = styled.div`
  padding: var(--unit) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:last-child) {
    border-bottom: 1px solid var(--c-neutral-300);
  }

  button {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  &:hover {
    button {
      opacity: 1;
    }
  }
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const ImgContainer = styled.div`
  width: 40px;
  text-align: center;
`;
const Img = styled.img`
  width: 100%;
  border-radius: 100%;
`;

export const OAuthToken = ({ oAuthAccessToken }: Props) => {
  const [showConfirmationDialog, toggleShowConfirmationDialog] =
    useToggle(false);

  const { formatDate } = useIntlContext();
  const [revoke, { loading }] = useMutation(
    REVOKE_O_AUTH_ACCESS_TOKEN_MUTATION
  );

  const onConfirm = useCallback(async () => {
    revoke({ variables: { input: { id: oAuthAccessToken.id } } });
  }, [oAuthAccessToken.id, revoke]);

  return (
    <Root>
      <Details>
        <ImgContainer>
          {oAuthAccessToken.application.pictureUrl ? (
            <Img
              src={oAuthAccessToken.application.pictureUrl}
              alt={oAuthAccessToken.application.name}
            />
          ) : (
            <FontAwesomeIcon icon={faCircleQuestion} size="2x" />
          )}
        </ImgContainer>
        <div>
          <Text14>{oAuthAccessToken.application.name}</Text14>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="Settings.OAuthTokensManagement.OAuthToken.createdOn"
              defaultMessage="Created on {createdAt}"
              values={{
                createdAt: formatDate(oAuthAccessToken.createdAt, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }),
              }}
            />
            {oAuthAccessToken.expiresAt && (
              <>
                {' – '}
                <FormattedMessage
                  id="Settings.OAuthTokensManagement.OAuthToken.expiresOn"
                  defaultMessage="Expiring on {expiresAt}"
                  values={{
                    expiresAt: formatDate(oAuthAccessToken.expiresAt, {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }),
                  }}
                />
              </>
            )}
          </Text14>
        </div>
      </Details>
      <LoadingButton
        onClick={() => {
          toggleShowConfirmationDialog();
        }}
        small
        color="red"
        loading={loading}
      >
        <FormattedMessage
          id="Settings.OAuthTokensManagement.OAuthToken.revoke"
          defaultMessage="Revoke"
        />
      </LoadingButton>
      <ConfirmDialog
        open={showConfirmationDialog}
        onClose={() => toggleShowConfirmationDialog()}
        message={
          <div>
            <FormattedMessage
              id="Settings.OAuthTokensManagement.confirmRevoke"
              defaultMessage="You will revoke your Vicc authentication token on <b>{application}</b> application. This means <b>{application}</b> will no longer be able to let you connect with your Vicc account. Are you sure?"
              values={{
                application: oAuthAccessToken.application.name,
                b: Bold,
              }}
            />
          </div>
        }
        onConfirm={() => {
          onConfirm();
        }}
      />
    </Root>
  );
};

OAuthToken.fragments = {
  oAuthAccessToken: fragment,
};

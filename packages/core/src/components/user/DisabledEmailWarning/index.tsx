import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import Blockquote from '@core/atoms/layout/Blockquote';
import { Text16, Title6 } from '@core/atoms/typography';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useMutation from '@core/hooks/graphql/useMutation';
import { tabletAndAbove } from '@core/style/mediaQuery';

import {
  UnblockEmailMutation,
  UnblockEmailMutationVariables,
} from './__generated__/index.graphql';

export const UNBLOCK_EMAIL_MUTATION = gql`
  mutation UnblockEmailMutation($input: UnblockEmailInput!) {
    unblockEmail(input: $input) {
      currentUser {
        slug
        userSettings {
          id
          disableAllEmails
        }
      }
      errors {
        message
        code
      }
    }
  }
` as TypedDocumentNode<UnblockEmailMutation, UnblockEmailMutationVariables>;

const Content = styled.div`
  display: flex;
  gap: var(--unit);
  justify-content: space-between;
  flex-direction: column;

  @media ${tabletAndAbove} {
    flex-direction: row;
    align-items: center;
  }
`;

export const DisabledEmailWarning = () => {
  const [pending, setPending] = useState(false);
  const { currentUser } = useCurrentUserContext();

  const [unblockEmail] = useMutation(UNBLOCK_EMAIL_MUTATION);

  const requestUnblockEmail = () => {
    setPending(true);

    unblockEmail({
      variables: { input: {} },
    });
  };

  if (!currentUser) {
    return null;
  }

  const {
    userSettings: { disableAllEmails },
  } = currentUser;

  if (!disableAllEmails) {
    return null;
  }
  return (
    <Blockquote variant="red">
      <Content>
        <div>
          <Title6>
            <FormattedMessage
              id="DisabledEmailWarning.WarningTitle"
              defaultMessage="You cannot receive Sorare emails"
            />
          </Title6>
          <Text16>
            <FormattedMessage
              id="DisabledEmailWarning.WarningMessage"
              defaultMessage="You may have marked our emails as spam or your address is invalid."
            />
          </Text16>
        </div>
        {pending ? (
          <div>
            <small>
              <FormattedMessage
                id="disabledEmail.pending"
                defaultMessage="You should soon be able to receive Sorare emails."
              />
            </small>
          </div>
        ) : (
          <Button
            medium
            color="blue"
            onClick={requestUnblockEmail}
            disabled={pending}
          >
            <FormattedMessage
              id="disabledEmail.unblock"
              defaultMessage="Unblock Sorare emails"
            />
          </Button>
        )}
      </Content>
    </Blockquote>
  );
};

export default DisabledEmailWarning;

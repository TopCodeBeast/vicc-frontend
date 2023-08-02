import { TypedDocumentNode } from '@apollo/client';
import { gql } from '@apollo/client/core';
import { faBan } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { ButtonBaseWithConfirmDialog } from '@core/components/form/ButtonWithConfirmDialog';
import { Nickname } from '@core/components/user/Nickname';
import useBlockUser from '@core/hooks/users/useBlockUser';

import { BlockButton_publicUserInfoInterface } from './__generated__/index.graphql';

export interface Props {
  user: BlockButton_publicUserInfoInterface;
  disabled?: boolean;
  block?: () => Promise<void>;
  onBlock?: () => Promise<void>;
}

const messages = defineMessages({
  label: {
    id: 'User.block',
    defaultMessage: 'Block',
  },
  confirmationMessage: {
    id: 'User.blockConfirmationMessage',
    defaultMessage:
      "Blocking Managers will impact their ability to make other offers. You won't receive offers from {user} anymore.",
  },
});

const Root = styled.div`
  align-items: center;
  display: inline-flex;
`;
const Img = styled(FontAwesomeIcon)`
  color: var(--c-red-600);
`;

export const Block = ({
  user,
  disabled = false,
  onBlock = undefined,
  block = undefined,
}: Props) => {
  const blockUser = useBlockUser();
  const { slug } = user;
  const doBlock = useCallback(async () => {
    if (block) {
      return block();
    }
    return blockUser(slug);
  }, [block, blockUser, slug]);
  const onClick = useCallback(() => {
    doBlock().then(() => {
      if (onBlock) {
        onBlock();
      }
    });
  }, [onBlock, doBlock]);
  const { formatMessage } = useIntl();
  return (
    <Root>
      <ButtonBaseWithConfirmDialog
        onConfirm={onClick}
        disabled={disabled}
        message={
          <FormattedMessage
            {...messages.confirmationMessage}
            values={{ user: <Nickname user={user} /> }}
          />
        }
        cta={formatMessage(messages.label)}
      >
        <Img icon={faBan} fontSize={12} />
      </ButtonBaseWithConfirmDialog>
    </Root>
  );
};

Block.fragments = {
  user: gql`
    fragment BlockButton_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      ...Nickname_publicUserInfoInterface
    }
    ${Nickname.fragments.user}
  ` as TypedDocumentNode<BlockButton_publicUserInfoInterface>,
};

export default Block;

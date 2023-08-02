import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Nickname_publicUserInfoInterface } from './__generated__/index.graphql';

type Props = {
  user: {
    suspended: boolean;
    nickname: string;
  };
};

const messages = defineMessages({
  disabled: {
    id: 'user.UserName.disabled',
    defaultMessage: 'Disabled',
  },
});

const DisabledUserContainer = styled.span`
  color: var(--c-neutral-600);
`;

const SuspendedNickname = () => {
  const { formatMessage } = useIntl();
  return (
    <DisabledUserContainer>
      {formatMessage(messages.disabled)}
    </DisabledUserContainer>
  );
};

export const Nickname = ({ user }: Props): React.JSX.Element => {
  if (user.suspended) {
    return <SuspendedNickname />;
  }
  return <>{user.nickname}</>;
};

Nickname.fragments = {
  user: gql`
    fragment Nickname_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      suspended
      nickname
    }
  ` as TypedDocumentNode<Nickname_publicUserInfoInterface>,
};

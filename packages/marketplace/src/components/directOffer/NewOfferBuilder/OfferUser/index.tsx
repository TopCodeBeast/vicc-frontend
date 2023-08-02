import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
import ActivityIndicator from '@sorare/core/src/components/user/ActivityIndicator';
import Avatar from '@sorare/core/src/components/user/Avatar';
import { tradeLabels } from '@sorare/core/src/lib/glossary';

import {
  OfferUser_publicUserInfoInterface,
  OfferUser_user,
} from './__generated__/index.graphql';

type Props = {
  isReceiver?: boolean;
  user: OfferUser_publicUserInfoInterface | OfferUser_user;
};

const Row = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
  min-height: calc(var(--unit) * 6);
`;
const StyledText14 = styled(Text14)`
  display: flex;
  gap: var(--half-unit);
  align-items: center;
`;
const StyledSpan = styled.span`
  max-width: 120px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const OfferUser = ({ isReceiver, user }: Props) => {
  return (
    <Row>
      <ActivityIndicator user={user} enterTouchDelay={0}>
        <Avatar user={user} />
      </ActivityIndicator>
      <StyledText14 color="var(--c-neutral-600)">
        <FormattedMessage
          {...(isReceiver
            ? tradeLabels.youReceiveWithAvatar
            : tradeLabels.youSend)}
          values={{
            nickname: user?.nickname,
            br: <br />,
            span: (...chunks: string[]) => (
              <StyledSpan title={user?.nickname}>{chunks}</StyledSpan>
            ),
          }}
        />
      </StyledText14>
    </Row>
  );
};

OfferUser.fragments = {
  publicUserInfoInterface: gql`
    fragment OfferUser_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      ...Avatar_publicUserInfoInterface
      ...ActivityIndicator_user
    }
    ${Avatar.fragments.publicUserInfoInterface}
    ${ActivityIndicator.fragments.user}
  ` as TypedDocumentNode<OfferUser_publicUserInfoInterface>,
  user: gql`
    fragment OfferUser_user on User {
      slug
      ...Avatar_user
      ...ActivityIndicator_user
    }
    ${Avatar.fragments.user}
    ${ActivityIndicator.fragments.user}
  ` as TypedDocumentNode<OfferUser_user>,
};

import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
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

export const OfferUser = ({ isReceiver, user }: Props) => {
  return (
    <Row>
      <Avatar user={user} />
      <Text14 color="var(--c-neutral-600)">
        <FormattedMessage
          {...(isReceiver
            ? tradeLabels.youReceiveWithAvatar
            : tradeLabels.youSend)}
          values={{
            nickname: user?.nickname,
            br: <br />,
          }}
        />
      </Text14>
    </Row>
  );
};

OfferUser.fragments = {
  publicUserInfoInterface: gql`
    fragment OfferUser_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      ...Avatar_publicUserInfoInterface
    }
    ${Avatar.fragments.publicUserInfoInterface}
  `,
  user: gql`
    fragment OfferUser_user on User {
      slug
      ...Avatar_user
    }
    ${Avatar.fragments.user}
  `,
};

import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Block from '@sorare/core/src/atoms/layout/Block';
import { Text16, Title6 } from '@sorare/core/src/atoms/typography';
import Avatar from '@sorare/core/src/components/user/Avatar';
import UserName from '@sorare/core/src/components/user/UserName';
import { FOOTBALL_USER_GALLERY } from '@sorare/core/src/constants/routes';

import { PlayerOnVicc_player } from './__generated__/index.graphql';

interface Props {
  player: PlayerOnVicc_player;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const PlayerOnViccBlock = styled(Block)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--unit);
`;

const PlayerOnVicc = ({ player }: Props) => {
  const { user } = player;

  if (!user || user.suspended) return null;

  return (
    <Container>
      <Title6 as="h2">
        <FormattedMessage
          id="PlayerOnVicc.Title"
          defaultMessage="This player is a Vicc manager"
        />
      </Title6>

      <PlayerOnViccBlock
        to={generatePath(FOOTBALL_USER_GALLERY, {
          slug: user.slug,
        })}
      >
        <Avatar user={user} />
        <Text16 color="var(--c-neutral-1000)" bold>
          <UserName user={user} />
        </Text16>
      </PlayerOnViccBlock>
    </Container>
  );
};

PlayerOnVicc.fragments = {
  player: gql`
    fragment PlayerOnVicc_player on Player {
      slug
      user {
        slug
        ...Avatar_publicUserInfoInterface
        ...UserName_publicUserInfoInterface
      }
    }
    ${Avatar.fragments.publicUserInfoInterface}
    ${UserName.fragments.user}
  ` as TypedDocumentNode<PlayerOnVicc_player>,
};

export default PlayerOnVicc;

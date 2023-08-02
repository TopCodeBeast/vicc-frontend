import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Block from '@sorare/core/src/atoms/layout/Block';
import { Text16, Title6 } from '@sorare/core/src/atoms/typography';
import Avatar from '@sorare/core/src/components/user/Avatar';
import UserName from '@sorare/core/src/components/user/UserName';
import { FOOTBALL_USER_GALLERY } from '@sorare/core/src/constants/routes';

import { PlayerOnSorare_player } from './__generated__/index.graphql';

interface Props {
  player: PlayerOnSorare_player;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const PlayerOnSorareBlock = styled(Block)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--unit);
`;

const PlayerOnSorare = ({ player }: Props) => {
  const { user } = player;

  if (!user || user.suspended) return null;

  return (
    <Container>
      <Title6 as="h2">
        <FormattedMessage
          id="PlayerOnSorare.Title"
          defaultMessage="This player is a Sorare manager"
        />
      </Title6>

      <PlayerOnSorareBlock
        to={generatePath(FOOTBALL_USER_GALLERY, {
          slug: user.slug,
        })}
      >
        <Avatar user={user} />
        <Text16 color="var(--c-neutral-1000)" bold>
          <UserName user={user} />
        </Text16>
      </PlayerOnSorareBlock>
    </Container>
  );
};

PlayerOnSorare.fragments = {
  player: gql`
    fragment PlayerOnSorare_player on Player {
      slug
      user {
        slug
        ...Avatar_publicUserInfoInterface
        ...UserName_publicUserInfoInterface
      }
    }
    ${Avatar.fragments.publicUserInfoInterface}
    ${UserName.fragments.user}
  ` as TypedDocumentNode<PlayerOnSorare_player>,
};

export default PlayerOnSorare;

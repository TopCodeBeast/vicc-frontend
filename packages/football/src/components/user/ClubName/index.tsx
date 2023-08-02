import { TypedDocumentNode, gql } from '@apollo/client';
import { FC } from 'react';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { FOOTBALL_PLAYER_SHOW } from '@sorare/core/src/constants/routes';

import ClubShield from '@football/components/user/ClubShield';

import { ClubName_user } from './__generated__/index.graphql';

interface Props {
  user: ClubName_user;
  Wrapper: FC<React.PropsWithChildren<unknown>>;
}

const Root = styled.div`
  align-items: center;
  display: flex;
  gap: var(--half-unit);
`;

const Text = styled.div`
  text-align: left;
  display: flex;
  align-items: center;
`;

const Player = styled.span`
  color: var(--c-green-300);
`;

export const ClubName = ({ user, Wrapper }: Props) => {
  const { profile, player } = user;
  return (
    <Root>
      <ClubShield size="small" userProfile={profile} />
      <Text>
        {player ? (
          <Link to={generatePath(FOOTBALL_PLAYER_SHOW, { slug: player.slug })}>
            <Wrapper>
              <Player>{player.displayName}</Player>
            </Wrapper>
          </Link>
        ) : (
          <Wrapper>{profile.clubName}</Wrapper>
        )}
      </Text>
    </Root>
  );
};

ClubName.fragments = {
  user: gql`
    fragment ClubName_user on PublicUserInfoInterface {
      slug
      player {
        slug
        displayName
      }
      profile {
        id
        clubName
        ...ClubShield_userProfile
      }
    }
    ${ClubShield.fragments.userProfile}
  ` as TypedDocumentNode<ClubName_user>,
};

export default ClubName;

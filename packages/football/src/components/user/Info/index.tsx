import { gql } from '@apollo/client';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import ecusson from '@sorare/core/src/assets/user/ecusson.png';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import UserName from '@sorare/core/src/components/user/UserName';
import { FOOTBALL_USER_GALLERY } from '@sorare/core/src/constants/routes';
import { theme } from '@sorare/core/src/style/theme';

import Banner from '@football/components/user/Banner';
import ClubName from '@football/components/user/ClubName';

import { Info_user } from './__generated__/index.graphql';

interface Props {
  user: Info_user;
}

const Root = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: var(--intermediate-unit);
  padding: 0;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;
const Infos = styled.div`
  display: flex;
  gap: var(--double-unit);
  align-items: center;
`;
const PersonalInfos = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;
const ProfilePicture = styled.img`
  background-color: var(--c-static-neutral-100);
  border-radius: var(--unit);
  object-fit: cover;
  box-shadow: var(--shadow-400);
`;

export const Info = ({ user }: Props) => {
  const { profile, slug } = user;
  const { fullPictureUrl } = profile;

  return (
    <>
      <Banner user={user} rounded="sm" />
      <Root>
        <Infos>
          <ProfilePicture
            src={fullPictureUrl || ecusson}
            width={32}
            height={32}
          />
          <PersonalInfos>
            <Link to={generatePath(FOOTBALL_USER_GALLERY, { slug })}>
              <Text16 bold color="var(--c-static-neutral-100)">
                <UserName user={user} />
              </Text16>
            </Link>
            <ClubName
              Wrapper={props => (
                <Caption {...props} color="var(--c-static-neutral-500)" bold />
              )}
              user={user}
            />
          </PersonalInfos>
        </Infos>
      </Root>
    </>
  );
};

Info.fragments = {
  user: gql`
    fragment Info_user on PublicUserInfoInterface {
      slug
      profile {
        id
        fullPictureUrl: pictureUrl
      }
      ...ClubName_user
      ...UserName_publicUserInfoInterface
      ...Banner_user
    }
    ${UserName.fragments.user}
    ${ClubName.fragments.user}
    ${Banner.fragments.user}
  `,
};

export default Info;

import { gql } from '@apollo/client';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import ecusson from '@sorare/core/src/assets/user/ecusson.png';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import ActiveUserAvatar from '@sorare/core/src/components/user/ActiveUserAvatar';
import UserName from '@sorare/core/src/components/user/UserName';
import { FOOTBALL_USER_GALLERY } from '@sorare/core/src/constants/routes';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

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
  @media ${laptopAndAbove} {
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
  word-break: break-word;
`;

export const Info = ({ user }: Props) => {
  const { slug } = user;

  return (
    <>
      <Banner user={user} rounded />
      <Root>
        <Infos>
          <ActiveUserAvatar
            user={user}
            variant="medium"
            placeholderUrl={ecusson}
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
      ...ClubName_user
      ...UserName_publicUserInfoInterface
      ...Banner_user
      ...ActiveUserAvatar_user
    }
    ${UserName.fragments.user}
    ${ClubName.fragments.user}
    ${Banner.fragments.user}
    ${ActiveUserAvatar.fragments.user}
  `,
};

export default Info;

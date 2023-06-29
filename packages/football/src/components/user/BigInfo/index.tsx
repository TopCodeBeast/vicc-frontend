import { gql } from '@apollo/client';
import { faCamera } from '@fortawesome/pro-solid-svg-icons';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import styled, { StyledComponent } from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import ecusson from '@sorare/core/src/assets/user/ecusson.png';
import { Text14, Title2 } from '@sorare/core/src/atoms/typography';
import ActiveUserAvatar from '@sorare/core/src/components/user/ActiveUserAvatar';
import UserName from '@sorare/core/src/components/user/UserName';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import Banner from '@football/components/user/Banner';
import ClubName from '@football/components/user/ClubName';

import { BigInfo_user } from './__generated__/index.graphql';

interface Props {
  user: BigInfo_user;
  setPickingSkin?: Dispatch<
    SetStateAction<ShopItemType.BANNER | ShopItemType.SHIELD | undefined>
  >;
  Camera: StyledComponent<any, any>;
  children: ReactNode;
}

const Root = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: var(--intermediate-unit);
  padding: var(--triple-unit) 0;
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
`;

export const BigInfo = ({ user, setPickingSkin, Camera, children }: Props) => {
  return (
    <>
      <Banner user={user} />
      <Root>
        <Infos>
          <ActiveUserAvatar
            user={user}
            variant="large"
            placeholderUrl={ecusson}
          />
          <PersonalInfos>
            <Title2 color="var(--c-static-neutral-100)">
              <UserName user={user} />
            </Title2>
            <button
              type="button"
              onClick={() => setPickingSkin?.(ShopItemType.SHIELD)}
            >
              <ClubName
                Wrapper={props => (
                  <Text14 {...props} color="var(--c-static-neutral-500)" bold />
                )}
                user={user}
              />
            </button>
          </PersonalInfos>
          {setPickingSkin && (
            <Camera
              icon={faCamera}
              color="white"
              onClick={() => setPickingSkin?.(ShopItemType.BANNER)}
            />
          )}
        </Infos>
        {children}
      </Root>
    </>
  );
};

BigInfo.fragments = {
  user: gql`
    fragment BigInfo_user on PublicUserInfoInterface {
      slug
      profile {
        id
      }
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

export default BigInfo;

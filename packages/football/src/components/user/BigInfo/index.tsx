import { gql } from '@apollo/client';
import { faCamera } from '@fortawesome/pro-solid-svg-icons';
import { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react';
import styled, { StyledComponent } from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import ecusson from '@sorare/core/src/assets/user/ecusson.png';
import { Text14, Title2 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import UpdateProfile from '@sorare/core/src/components/settings/UpdateProfile';
import ActivityIndicator from '@sorare/core/src/components/user/ActivityIndicator';
import UserName from '@sorare/core/src/components/user/UserName';
import { theme } from '@sorare/core/src/style/theme';

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
  readOnly?: boolean;
}

const Root = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: var(--intermediate-unit);
  padding: var(--triple-unit) 0;
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
const UpdateProfileWrapper = styled.div`
  padding: 0 var(--double-unit) var(--double-unit);
`;

const Avatar: FC<{ onClick?: () => void }> = ({ children, onClick }) =>
  onClick ? (
    <button onClick={onClick} type="button">
      {children}
    </button>
  ) : (
    <>{children}</>
  );

export const BigInfo = ({
  user,
  setPickingSkin,
  Camera,
  children,
  readOnly,
}: Props) => {
  const { profile } = user;
  const [openUpdatingPicture, setOpenUpdatingPicture] = useState(false);
  const { fullPictureUrl } = profile;

  return (
    <>
      <Banner user={user} />
      <Root>
        <Infos>
          <Avatar
            onClick={readOnly ? undefined : () => setOpenUpdatingPicture(true)}
          >
            <ActivityIndicator user={user}>
              <ProfilePicture
                src={fullPictureUrl || ecusson}
                width={60}
                height={60}
              />
            </ActivityIndicator>
          </Avatar>
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
        <Dialog
          maxWidth="sm"
          open={openUpdatingPicture}
          onClose={() => setOpenUpdatingPicture(false)}
          body={
            <UpdateProfileWrapper>
              <UpdateProfile onSubmit={() => setOpenUpdatingPicture(false)} />
            </UpdateProfileWrapper>
          }
        />
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
        fullPictureUrl: pictureUrl
      }
      ...ClubName_user
      ...UserName_publicUserInfoInterface
      ...Banner_user
      ...ActivityIndicator_user
    }
    ${UserName.fragments.user}
    ${ClubName.fragments.user}
    ${Banner.fragments.user}
    ${ActivityIndicator.fragments.user}
  `,
};

export default BigInfo;

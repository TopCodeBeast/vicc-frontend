import { faUserFriends } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { Title4, text14 } from '@sorare/core/src/atoms/typography';

import UserGroupPicture from '@football/components/userGroup/UserGroupPicture';
import { GetPrivateUserGroupQuery } from '@football/components/userGroup/private/Dialog/Steps/Congrats/__generated__/index.graphql';

type Skin = NonNullable<
  GetPrivateUserGroupQuery['vicc5Root']['vicc5UserGroup']['logo']
>;

const GroupContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--triple-unit);
  border-radius: var(--triple-unit);
  border: 2px solid var(--c-neutral-300);
  margin: auto;
  width: 272px;
`;
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-brand-600);
  margin-right: var(--unit);
  background-color: rgba(var(--c-rgb-brand-600), 0.25);
  width: var(--triple-unit);
  height: var(--triple-unit);
  border-radius: var(--unit);
`;
const MembersCount = styled.div`
  ${text14}
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--unit);
  color: var(--c-neutral-600);
`;

type Props = {
  logo: Skin | null;
  displayName: string;
  memberCount: number;
};
const PrivateUserGroupPreview = ({ logo, displayName, memberCount }: Props) => {
  return (
    <GroupContent>
      <UserGroupPicture
        size={112}
        picture={logo?.pictureUrl}
        displayName={displayName}
      />
      <Title4>{displayName}</Title4>

      <MembersCount>
        <IconWrapper>
          <FontAwesomeIcon icon={faUserFriends} fontSize={11} />
        </IconWrapper>
        {memberCount}
      </MembersCount>
    </GroupContent>
  );
};

export default PrivateUserGroupPreview;

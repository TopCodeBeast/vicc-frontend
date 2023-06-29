import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { LinkBox, LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { Text14, Title5 } from '@sorare/core/src/atoms/typography';
import { Tag } from '@sorare/core/src/atoms/ui/Tag';
import {
  FOOTBALL_PRIVATE_LEAGUES_DETAILS,
  PrivateLeaguesTab,
} from '@sorare/core/src/constants/routes';
import { Link } from '@sorare/core/src/routing/Link';

import UserGroupRanking from '@football/pages/Lobby/Components/UserGroup/UserGroupRanking';
import UserGroupPicture from '@football/pages/Lobby/Components/UserGroupPicture';

import GroupStatus from './GroupStatus';
import { UserGroup_so5UserGroup } from './__generated__/index.graphql';

const Group = styled(LinkBox)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--triple-unit) var(--triple-unit) 0;
  width: 100%;
  border-radius: var(--triple-unit);
  isolation: isolate;
  text-align: center;
  overflow: hidden;
  background: var(--c-neutral-200);
`;
const GroupHeader = styled.div<{ color: string | undefined }>`
  &:after {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    right: 0;
    height: 65px;
    background-color: ${({ color = 'var(--c-neutral-300)' }) =>
      color === '#FFFFFF' ? 'var(--c-neutral-400)' : color};
    z-index: 0;
  }
`;
const GroupPicture = styled(UserGroupPicture)`
  position: relative;
  z-index: 1;
`;
const AdminTag = styled(Tag).attrs({ color: 'grey' })`
  position: absolute;
  top: var(--double-unit);
  right: var(--double-unit);
  z-index: 1;
  font: var(--t-12);
  color: var(--c-neutral-600);
  height: auto;
`;
const Tournament = styled(Text14)`
  color: var(--c-neutral-600);
`;

const StyledLink = styled(Link)`
  display: inline-block;
  width: 100%;
  margin-bottom: var(--unit);
  &,
  &:hover,
  &:focus {
    color: inherit;
  }
`;

const Status = styled.div`
  flex: 1;
  align-items: flex-end;
  display: flex;
  margin: var(--double-unit) 0;
`;

type Props = { group: UserGroup_so5UserGroup };

const UserGroup = ({ group }: Props) => {
  const { slug, displayName, myMembership, logo, so5TournamentType } = group;

  return (
    <Group>
      <GroupHeader color={logo?.color || undefined}>
        <GroupPicture picture={logo?.pictureUrl} displayName={displayName} />
        {myMembership?.administrator && (
          <AdminTag>
            <FormattedMessage id="UserGroup.Admin" defaultMessage="Admin" />
          </AdminTag>
        )}
      </GroupHeader>
      <Tournament>
        <strong>{so5TournamentType.displayName}</strong>
      </Tournament>
      <LinkOverlay
        as={StyledLink}
        to={generatePath(FOOTBALL_PRIVATE_LEAGUES_DETAILS, {
          slug,
          tab: PrivateLeaguesTab.LEADERBOARD,
        })}
      >
        <Title5>{displayName}</Title5>
      </LinkOverlay>
      {group && <UserGroupRanking group={group} />}
      <Status>
        <GroupStatus group={group} />
      </Status>
    </Group>
  );
};

export default UserGroup;

UserGroup.fragments = {
  so5UserGroup: gql`
    fragment UserGroup_so5UserGroup on So5UserGroup {
      slug
      displayName
      joinDisabled
      membershipsCount
      logo {
        id
        pictureUrl
        color
      }
      myMembership {
        id
        ranking
        score
        administrator
      }
      so5TournamentType {
        id
        displayName
      }
      ...GroupStatus_userGroup
      ...UserGroupRanking_userGroup
    }
    ${GroupStatus.fragments.userGroup}
    ${UserGroupRanking.fragments.userGroup}
  `,
};

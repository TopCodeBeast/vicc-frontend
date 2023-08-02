import { TypedDocumentNode, gql } from '@apollo/client';
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedDate } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { LinkBox } from '@sorare/core/src/atoms/navigation/Box';
import { Text16, Title5 } from '@sorare/core/src/atoms/typography';
import {
  FOOTBALL_PRIVATE_LEAGUES_PUBLIC_USER_DETAILS,
  PrivateLeaguesTab,
} from '@sorare/core/src/constants/routes';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import { Link } from '@sorare/core/src/routing/Link';

import UserGroupPicture from '@football/components/userGroup/UserGroupPicture';
import UserGroupStatus from '@football/components/userGroup/UserGroupStatus';
import PublicUserGroupRanking from '@football/components/userGroup/public/PublicUserGroupRanking';

import { PublicUserGroup_so5UserGroup } from './__generated__/index.graphql';

const Root = styled(LinkBox)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--half-unit) var(--half-unit) 0;
  width: 100%;
  border-radius: var(--double-unit);
  overflow: hidden;
  background: var(--c-neutral-300);
`;
const Body = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: var(--unit);
  width: 100%;
  border-radius: calc(var(--double-unit) - 2px) calc(var(--double-unit) - 2px) 0
    0;
  padding: var(--unit) var(--unit) var(--double-unit);
  background-color: var(--c-neutral-200);

  &::before {
    content: ' ';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: calc(var(--double-unit) - 2px) calc(var(--double-unit) - 2px)
      0 0;
    mask-image: linear-gradient(rgba(0, 0, 0, 0.5) 0%, transparent 100%);
  }

  &.limited::before {
    background: var(--c-gradient-limited);
  }
  &.rare::before {
    background: var(--c-gradient-rare);
  }
  &.super_rare::before {
    background: var(--c-gradient-superRare);
  }
  &.unique::before {
    background: var(--c-gradient-unique);
  }
`;
const DatesAndStatus = styled.div`
  position: absolute;
  top: var(--unit);
  right: var(--double-unit);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--half-unit);
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
const FlexColContainer = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const StyledUserGroupPicture = styled(UserGroupPicture)`
  z-index: 1;
  border-radius: 50%;
`;
const Footer = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 var(--unit);
`;

type Props = { so5UserGroup: PublicUserGroup_so5UserGroup };
const PublicUserGroup = ({ so5UserGroup }: Props) => {
  const {
    slug,
    displayName,
    logo,
    myMembership,
    so5TournamentType,
    startSo5Fixture,
    endSo5Fixture,
    rarityType,
  } = so5UserGroup;

  return (
    <Root
      as={Link}
      to={generatePath(FOOTBALL_PRIVATE_LEAGUES_PUBLIC_USER_DETAILS, {
        slug,
        tab: PrivateLeaguesTab.TEAMS,
        membershipId: idFromObject(myMembership?.id) || '',
      })}
    >
      <Body className={rarityType}>
        <StyledUserGroupPicture
          picture={logo?.pictureUrl}
          displayName={displayName}
        />
        <FlexColContainer>
          <Text16 color="var(--c-neutral-600)">
            {so5TournamentType.displayName}
          </Text16>
          <Title5 color="var(--c-neutral-1000)" bold>
            {displayName}
          </Title5>
        </FlexColContainer>
        <DatesAndStatus>
          <FlexContainer>
            <Text16 color="var(--c-neutral-600)" bold uppercase>
              <FormattedDate
                value={startSo5Fixture?.startDate}
                day="numeric"
                month="short"
              />
            </Text16>
            {endSo5Fixture?.endDate && (
              <>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  color="var(--c-neutral-600)"
                />
                <Text16 color="var(--c-neutral-600)" bold uppercase>
                  <FormattedDate
                    value={endSo5Fixture?.endDate}
                    day="numeric"
                    month="short"
                  />
                </Text16>
              </>
            )}
          </FlexContainer>
          <UserGroupStatus so5UserGroup={so5UserGroup} />
        </DatesAndStatus>
      </Body>
      <Footer>
        {so5UserGroup && <PublicUserGroupRanking so5UserGroup={so5UserGroup} />}
      </Footer>
    </Root>
  );
};

PublicUserGroup.fragments = {
  so5UserGroup: gql`
    fragment PublicUserGroup_so5UserGroup on So5UserGroup {
      slug
      displayName
      joinDisabled
      membershipsCount
      rarityType
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
      startSo5Fixture {
        slug
        startDate
      }
      endSo5Fixture {
        slug
        endDate
      }
      ...PublicUserGroupRanking_so5UserGroup
      ...UserGroupStatus_so5UserGroup
    }
    ${PublicUserGroupRanking.fragments.so5UserGroup}
    ${UserGroupStatus.fragments.so5UserGroup}
  ` as TypedDocumentNode<PublicUserGroup_so5UserGroup>,
};

export default PublicUserGroup;

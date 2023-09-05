import { TypedDocumentNode, gql } from '@apollo/client';
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedDate } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { LinkBox } from '@sorare/core/src/atoms/navigation/Box';
import { Text16, Title5 } from '@sorare/core/src/atoms/typography';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import {
  FOOTBALL_PRIVATE_LEAGUES_DETAILS,
  PrivateLeaguesTab,
} from '@sorare/core/src/constants/routes';
import { Link } from '@sorare/core/src/routing/Link';

import UserGroupPicture from '@football/components/userGroup/UserGroupPicture';
import PrivateUserGroupRanking from '@football/components/userGroup/private/PrivateUserGroupRanking';

import { PrivateUserGroup_vicc5UserGroup } from './__generated__/index.graphql';

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
const UserImage = styled.img`
  width: var(--double-unit);
  height: var(--double-unit);
  border-radius: var(--half-unit);
`;
const Body = styled.div<{ color: string | undefined }>`
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

    ${({ color }) => {
      if (!color || color === '#FFFFFF') {
        return 'background: linear-gradient(180deg, #0D0C11 0%, #22242B 100%);';
      }
      return `
        background-color: ${color};
        mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, transparent 90%);
      `;
    }}
  }
`;
const Dates = styled.div`
  position: absolute;
  top: var(--unit);
  right: var(--double-unit);
  display: flex;
  align-items: center;
  gap: var(--unit);
  text-transform: uppercase;
`;
const FlexColContainer = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const StyledUserGroupPicture = styled(UserGroupPicture)`
  z-index: 1;
`;
const User = styled(Text16)`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
const Footer = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 var(--unit);
`;

type Props = { group: PrivateUserGroup_vicc5UserGroup };
const PrivateUserGroup = ({ group }: Props) => {
  const {
    slug,
    displayName,
    logo,
    vicc5TournamentType,
    administrator,
    startVicc5Fixture,
    endVicc5Fixture,
  } = group;

  return (
    <Root
      as={Link}
      to={generatePath(FOOTBALL_PRIVATE_LEAGUES_DETAILS, {
        slug,
        tab: PrivateLeaguesTab.LEADERBOARD,
      })}
    >
      <Body color={logo?.color || undefined}>
        <StyledUserGroupPicture
          picture={logo?.pictureUrl}
          displayName={displayName}
        />
        <FlexColContainer>
          <Text16 color="var(--c-neutral-600)">
            {vicc5TournamentType.displayName}
          </Text16>
          <Title5 color="var(--c-neutral-1000)" bold>
            {displayName}
          </Title5>
          <User color="var(--c-neutral-600)">
            <UserImage src={administrator.profile.pictureUrl || ''} alt="" />
            <Nickname user={administrator} />
          </User>
        </FlexColContainer>
        <Dates>
          <Text16 color="var(--c-neutral-600)" bold>
            <FormattedDate
              value={startVicc5Fixture?.startDate}
              day="numeric"
              month="short"
            />
          </Text16>
          {endVicc5Fixture?.endDate && (
            <>
              <FontAwesomeIcon
                icon={faArrowRight}
                color="var(--c-neutral-600)"
              />
              <Text16 color="var(--c-neutral-600)" bold>
                <FormattedDate
                  value={endVicc5Fixture?.endDate}
                  day="numeric"
                  month="short"
                />
              </Text16>
            </>
          )}
        </Dates>
      </Body>
      <Footer>
        {group && <PrivateUserGroupRanking group={group} fullWidth />}
      </Footer>
    </Root>
  );
};

PrivateUserGroup.fragments = {
  vicc5UserGroup: gql`
    fragment PrivateUserGroup_vicc5UserGroup on Vicc5UserGroup {
      slug
      administrator {
        slug
        profile {
          id
          pictureUrl
        }
        ...Nickname_publicUserInfoInterface
      }
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
      vicc5TournamentType {
        id
        displayName
      }
      startVicc5Fixture {
        slug
        startDate
      }
      endVicc5Fixture {
        slug
        endDate
      }
      ...PrivateUserGroupRanking_userGroup
    }
    ${PrivateUserGroupRanking.fragments.vicc5UserGroup}
    ${Nickname.fragments.user}
  ` as TypedDocumentNode<PrivateUserGroup_vicc5UserGroup>,
};

export default PrivateUserGroup;

import { gql } from '@apollo/client';
import { faClock, faTrophy } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { LinkOther } from '@sorare/core/src/atoms/navigation/Box';
import { Text14 } from '@sorare/core/src/atoms/typography';
import {
  FOOTBALL_PRIVATE_LEAGUES_DETAILS,
  PrivateLeaguesTab,
} from '@sorare/core/src/constants/routes';
import { Link } from '@sorare/core/src/routing/Link';

import { useFootballEvents } from '@football/lib/events';
// eslint-disable-next-line sorare/no-unrendered-component-imports
// import GroupStatus, {
//   useGroupStatusLabel,
// } from '@football/pages/Lobby/Components/UserGroup/GroupStatus';

import { PrivateLeagueItem_userGroup } from './__generated__/index.graphql';

export const ITEM_HEIGHT = 48;

const Wrapper = styled(LinkOther)`
  display: flex;
  justify-content: space-between;
  padding: var(--intermediate-unit);
  height: ${ITEM_HEIGHT}px;
  width: 100%;
  gap: var(--unit);
  &:not(:last-child) {
    border-bottom: 1px solid var(--c-neutral-400);
  }
  &:hover,
  &:focus,
  &:active {
    background: var(--c-neutral-300);
    color: var(--c-neutral-1000);
  }
`;

const InfoBlock = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--half-unit);
`;

const RankingScore = styled.div`
  display: inline-flex;
  align-items: baseline;
`;

const GroupName = styled(Text14)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

type Props = {
  userGroup: PrivateLeagueItem_userGroup;
};

export const PrivateLeagueItem = ({ userGroup }: Props) => {
  const label = 'Label555';//useGroupStatusLabel(userGroup);
  const track = useFootballEvents();
  return (
    <Wrapper
      key={userGroup.slug}
      as={Link}
      to={generatePath(FOOTBALL_PRIVATE_LEAGUES_DETAILS, {
        slug: userGroup.slug,
        tab: PrivateLeaguesTab.LEADERBOARD,
      })}
      onClick={() =>
        track('Open Private League', {
          privateLeagueSlug: userGroup.slug,
        })
      }
    >
      <GroupName>{userGroup.displayName}</GroupName>
      <InfoBlock>
        {userGroup.myMembership?.score ? (
          <>
            <FontAwesomeIcon
              icon={faTrophy}
              color="var(--c-neutral-500)"
              size="xs"
            />
            <RankingScore>
              <Text14>{userGroup.myMembership?.ranking}</Text14>
              <Text14 color="var(--c-neutral-600)">
                /{userGroup.membershipsCount}
              </Text14>
            </RankingScore>
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faClock}
              color="var(--c-neutral-500)"
              size="xs"
            />
            <Text14 color="var(--c-neutral-600)">{label}</Text14>
          </>
        )}
      </InfoBlock>
    </Wrapper>
  );
};

PrivateLeagueItem.fragments = {
  userGroup: gql`
    fragment PrivateLeagueItem_userGroup on Vicc5UserGroup {
      slug
      displayName
      myMembership {
        id
        ranking
        score
      }
      membershipsCount
      #...GroupStatus_userGroup
    }

    #{GroupStatus.fragments.userGroup}
  `,
};

import { gql } from '@apollo/client';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { LinkBox, LinkOther } from '@sorare/core/src/atoms/navigation/Box';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_PRIVATE_LEAGUES } from '@sorare/core/src/constants/routes';

import DivisionLogo from '@football/components/so5/DivisionLogo';

import { ITEM_HEIGHT, PrivateLeagueItem } from './PrivateLeagueItem';
import { PrivateLeagueBlock_userGroup } from './__generated__/index.graphql';

const Wrapper = styled(LinkBox)`
  background: var(--c-neutral-200);
  color: var(--c-neutral-1000);
  border-radius: var(--intermediate-unit);
  overflow: hidden;
`;

const Header = styled(LinkOther)`
  padding: var(--unit) var(--intermediate-unit);
  display: flex;
  gap: var(--unit);
  align-items: center;
  border-bottom: 1px solid var(--c-neutral-400);
`;

const List = styled.div`
  height: calc(3 * ${ITEM_HEIGHT}px);
  overflow: auto;
`;

const DivisionPlaceholder = styled.div`
  width: 40px;
  height: 40px;
`;

type Props = {
  userGroupsList: PrivateLeagueBlock_userGroup[];
};

export const PrivateLeagueBlock = ({ userGroupsList }: Props) => {
  const leaderboard = userGroupsList[0].upcomingSo5Leaderboard;
  return (
    <Wrapper>
      <Header as={Link} to={generatePath(FOOTBALL_PRIVATE_LEAGUES)}>
        {leaderboard ? (
          <DivisionLogo so5Leaderboard={leaderboard} />
        ) : (
          <DivisionPlaceholder />
        )}
        <Text14>
          {leaderboard?.displayName ||
            userGroupsList[0].so5TournamentType.displayName}
        </Text14>
      </Header>
      <List>
        {userGroupsList.map(item => (
          <PrivateLeagueItem key={item.slug} userGroup={item} />
        ))}
      </List>
    </Wrapper>
  );
};

PrivateLeagueBlock.fragments = {
  userGroup: gql`
    fragment PrivateLeagueBlock_userGroup on So5UserGroup {
      slug
      displayName
      upcomingSo5Leaderboard {
        slug
        displayName
        ...DivisionLogo_so5Leaderboard
      }
      so5TournamentType {
        id
        displayName
      }
      ...PrivateLeagueItem_userGroup
    }
    ${DivisionLogo.fragments.so5Leaderboard}
    ${PrivateLeagueItem.fragments.userGroup}
  `,
};

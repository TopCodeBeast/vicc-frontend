import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { Link } from '@sorare/core/src/routing/Link';

import DropdownActions from '@football/components/lineup/DropdownActions';
import { LineupDate } from '@football/components/lineup/LineupDate';
import DivisionLogo from '@football/components/so5/DivisionLogo';
import { useFootballEvents } from '@football/lib/events';
import getLineupDisplayName from '@football/lib/lineup/getLineupDisplayName';

import {
  LineupHeader_so5Leaderboard,
  LineupHeader_so5Lineup,
} from './__generated__/index.graphql';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--unit);
`;

const StyledLinkOverlay = styled(LinkOverlay)`
  color: inherit;
  display: flex;
  align-items: center;
  padding: var(--unit);
  &:hover,
  &:focus {
    color: inherit;
  }
`;

const LineupInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: var(--unit);
`;

const DivisionLogoWrapper = styled.div`
  width: var(--quadruple-unit);
`;

type Props = {
  leaderboard: LineupHeader_so5Leaderboard;
  lineup?: LineupHeader_so5Lineup | null;
  hideGameWeekInfo?: boolean;
  hideActions?: boolean;
  linkToCompetitionDetails: string;
};

export const LineupHeader = ({
  leaderboard,
  lineup,
  hideGameWeekInfo,
  hideActions,
  linkToCompetitionDetails,
}: Props) => {
  const track = useFootballEvents();
  return (
    <Header>
      <StyledLinkOverlay
        as={Link}
        to={linkToCompetitionDetails}
        onClick={() => {
          track('Click Competition', {
            leaderboardSlug: leaderboard.slug,
            leaderboardName: leaderboard.displayName,
          });
        }}
      >
        {!!leaderboard && (
          <DivisionLogoWrapper>
            <DivisionLogo so5Leaderboard={leaderboard} />
          </DivisionLogoWrapper>
        )}
        <LineupInfo>
          {!hideGameWeekInfo && <LineupDate fixture={leaderboard.so5Fixture} />}
          <Text16>{getLineupDisplayName(lineup, leaderboard)}</Text16>
        </LineupInfo>
      </StyledLinkOverlay>
      {!hideActions && (
        <DropdownActions so5Leaderboard={leaderboard} so5Lineup={lineup} />
      )}
    </Header>
  );
};

LineupHeader.fragments = {
  so5Leaderboard: gql`
    fragment LineupHeader_so5Leaderboard on So5Leaderboard {
      slug
      gameWeek
      displayName
      so5Fixture {
        slug
        id
        ...LineupDate_fixture
      }
      ...DivisionLogo_so5Leaderboard
      ...DropdownActions_so5Leaderboard
      ...getLineupDisplayName_so5Leaderboard
    }
    ${DivisionLogo.fragments.so5Leaderboard}
    ${LineupDate.fragments.fixture}
    ${DropdownActions.fragments.so5Leaderboard}
    ${getLineupDisplayName.fragments.so5Leaderboard}
  ` as TypedDocumentNode<LineupHeader_so5Leaderboard>,
  so5Lineup: gql`
    fragment LineupHeader_so5Lineup on So5Lineup {
      id
      name
      ...DropdownActions_so5Lineup
      ...getLineupDisplayName_so5Lineup
    }
    ${DropdownActions.fragments.so5Lineup}
    ${getLineupDisplayName.fragments.so5Lineup}
  ` as TypedDocumentNode<LineupHeader_so5Lineup>,
};

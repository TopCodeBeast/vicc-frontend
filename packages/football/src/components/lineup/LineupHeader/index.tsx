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
  LineupHeader_vicc5Leaderboard,
  LineupHeader_vicc5Lineup,
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
  leaderboard: LineupHeader_vicc5Leaderboard;
  lineup?: LineupHeader_vicc5Lineup | null;
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
            <DivisionLogo vicc5Leaderboard={leaderboard} />
          </DivisionLogoWrapper>
        )}
        <LineupInfo>
          {!hideGameWeekInfo && <LineupDate fixture={leaderboard.vicc5Fixture} />}
          <Text16>{getLineupDisplayName(lineup, leaderboard)}</Text16>
        </LineupInfo>
      </StyledLinkOverlay>
      {!hideActions && (
        <DropdownActions vicc5Leaderboard={leaderboard} vicc5Lineup={lineup} />
      )}
    </Header>
  );
};

LineupHeader.fragments = {
  vicc5Leaderboard: gql`
    fragment LineupHeader_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      gameWeek
      displayName
      vicc5Fixture {
        slug
        id
        ...LineupDate_fixture
      }
      ...DivisionLogo_vicc5Leaderboard
      ...DropdownActions_vicc5Leaderboard
      ...getLineupDisplayName_vicc5Leaderboard
    }
    ${DivisionLogo.fragments.vicc5Leaderboard}
    ${LineupDate.fragments.fixture}
    ${DropdownActions.fragments.vicc5Leaderboard}
    ${getLineupDisplayName.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<LineupHeader_vicc5Leaderboard>,
  vicc5Lineup: gql`
    fragment LineupHeader_vicc5Lineup on Vicc5Lineup {
      id
      name
      ...DropdownActions_vicc5Lineup
      ...getLineupDisplayName_vicc5Lineup
    }
    ${DropdownActions.fragments.vicc5Lineup}
    ${getLineupDisplayName.fragments.vicc5Lineup}
  ` as TypedDocumentNode<LineupHeader_vicc5Lineup>,
};

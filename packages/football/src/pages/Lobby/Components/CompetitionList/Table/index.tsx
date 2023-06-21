import { gql } from '@apollo/client';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Table, TableHeader } from '@sorare/core/src/components/data/Table';
import { FOOTBALL_CLUB_SHOP_BOOSTS } from '@sorare/core/src/constants/routes';
import { Link } from '@sorare/core/src/routing/Link';
import { theme } from '@sorare/core/src/style/theme';

import ListItemAction from '@football/pages/Lobby/Components/CompetitionListActions/ListItemAction';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import TableRow, { Areas } from './TableRow';
import {
  CompetitionListTable_clubShopItem,
  CompetitionListTable_so5Leaderboard,
} from './__generated__/index.graphql';

const Root = styled(Table)`
  --columns: calc(5 * var(--unit)) 1fr max-content;
  --areas: '${Areas.logo} ${Areas.nameAndScarcity} ${Areas.status}'
    '${Areas.participantsAndRewards} ${Areas.participantsAndRewards} ${Areas.participantsAndRewards}'
    '${Areas.prize} ${Areas.prize} ${Areas.prize}'
    '${Areas.cta} ${Areas.cta} ${Areas.cta}';
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    --columns: var(--triple-unit) var(--quadruple-unit) 1.5fr 0.5fr 1fr 70px
      1.25fr;
    --areas: '${Areas.status} ${Areas.logo} ${Areas.name} ${Areas.scarcity} ${Areas.rewards} ${Areas.participants} ${Areas.cta}'
      '. ${Areas.prize} ${Areas.prize} ${Areas.prize} ${Areas.prize} ${Areas.prize} ${Areas.prize}';
  }
  & > :last-child {
    border: none;
  }
`;

const RowCtaWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  padding: 0 0 var(--unit) 0;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding: 0 var(--intermediate-unit);
  }
`;

type Props = {
  onSortChange: (sortBy?: { id: string; descending: boolean }) => void;
  refetch: () => void;
  defaultSortBy?: {
    id: string;
    descending: boolean;
  };
  leaderboards: CompetitionListTable_so5Leaderboard[];
  extraTeamsCapItems: Nullable<CompetitionListTable_clubShopItem[]>;
  header: TableHeader;
};

type LeaderboardTeam = {
  lineupId: number;
  leaderboard: CompetitionListTable_so5Leaderboard;
  rowCta?: ReactNode;
};

export const CompetitionListTable = ({
  onSortChange,
  defaultSortBy,
  leaderboards,
  header,
  refetch,
  extraTeamsCapItems,
}: Props) => {
  const leaderboardTeams = leaderboards.reduce<LeaderboardTeam[]>(
    (acc, leaderboard) => {
      const { teamsCap, mySo5Lineups } = leaderboard;
      const rowsNbToDisplay =
        mySo5Lineups.length + 1 < (teamsCap || 0)
          ? mySo5Lineups.length + 1
          : teamsCap;

      const teams: LeaderboardTeam[] = new Array(rowsNbToDisplay)
        .fill(0)
        .map((_, i) => ({
          leaderboard,
          lineupId: i,
        }));
      const canBuyExtraTeams = extraTeamsCapItems?.some(
        ({ myPurchasesCount }) => !myPurchasesCount
      );
      if (
        canBuyExtraTeams &&
        leaderboard.trainingCenter &&
        mySo5Lineups.length === teamsCap
      ) {
        teams.push({
          leaderboard,
          lineupId: (teamsCap || 0) + 1,
          rowCta: (
            <RowCtaWrapper>
              <ListItemAction
                color="blue"
                fullWidth
                component={Link}
                to={FOOTBALL_CLUB_SHOP_BOOSTS}
              >
                <FormattedMessage
                  id="Lobby.Upcoming.Teams.GetExtraTeam"
                  defaultMessage="Get an extra team"
                />
              </ListItemAction>
            </RowCtaWrapper>
          ),
        });
      }
      return acc.concat(teams);
    },
    []
  );

  return (
    <Root
      defaultSortBy={defaultSortBy}
      onSortChange={onSortChange}
      rows={{
        header,
        body: leaderboardTeams.map(({ leaderboard, lineupId, rowCta }) => (
          <TableRow
            key={`${leaderboard.slug}-${lineupId}`}
            so5Leaderboard={leaderboard}
            onActionSuccess={refetch}
            lineupId={lineupId}
            rowCta={rowCta}
          />
        )),
      }}
    />
  );
};

CompetitionListTable.fragments = {
  so5Leaderboard: gql`
    fragment CompetitionListTable_so5Leaderboard on So5Leaderboard {
      slug
      ...TableRow_so5Leaderboard
    }
    ${TableRow.fragments.so5Leaderboard}
  `,
  clubShopItem: gql`
    fragment CompetitionListTable_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        myPurchasesCount
      }
    }
  `,
};

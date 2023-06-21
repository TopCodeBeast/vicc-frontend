import { gql } from '@apollo/client';
import { parseISO } from 'date-fns';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16, Text20 } from '@sorare/core/src/atoms/typography';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { range } from '@sorare/core/src/lib/arrays';

import NoCardEntry from '@football/components/so5/NoCardEntry';
import { getLeaderboardInfo } from '@football/lib/so5';
import { SortAndFiltersType } from '@football/pages/Lobby/Components/CompetitionList/SortAndFilters';
import { CompetitionListTable } from '@football/pages/Lobby/Components/CompetitionList/Table';

import {
  DateGroupedSection_clubShopItem,
  DateGroupedSection_so5Fixture,
  DateGroupedSection_so5Leaderboard,
} from './__generated__/index.graphql';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--unit);
`;
const FlexColContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

export const defaultSortAndFilters = {
  sortBy: [{ id: 'scarcity', descending: false }],
  filter: { scarcity: 'all', showRecommended: true },
};

type Props = {
  startDate: string;
  so5Fixture: DateGroupedSection_so5Fixture;
  leaderboardIndex: number;
  so5Leaderboards: DateGroupedSection_so5Leaderboard[];
  sortAndFilters: SortAndFiltersType;
  setSortAndFilters: Dispatch<SetStateAction<SortAndFiltersType>>;
  header: {
    id: string;
    cell?: string;
  }[];
  refetch: () => void;
  extraTeamsCapItems: Nullable<DateGroupedSection_clubShopItem[]>;
};
const DateGroupedSection = ({
  startDate,
  so5Fixture,
  leaderboardIndex,
  so5Leaderboards,
  sortAndFilters,
  extraTeamsCapItems,
  setSortAndFilters,
  header,
  refetch,
}: Props) => {
  const { formatDate } = useIntlContext();
  const {
    flags: { enableNoCardEntry = false },
  } = useFeatureFlags();

  const sortedLeaderboards = useMemo(() => {
    const sortConfig =
      sortAndFilters?.sortBy?.[leaderboardIndex] ||
      defaultSortAndFilters.sortBy[0];
    if (!sortConfig) {
      return so5Leaderboards;
    }
    const { id: defaultId } = defaultSortAndFilters.sortBy[0];
    const sortColumnIndex = header.findIndex(
      ({ id }) => id === (sortConfig.id || defaultId)
    );
    return so5Leaderboards
      .map((leaderboard: DateGroupedSection_so5Leaderboard) => {
        const { displayName, so5LineupsCount } = leaderboard;
        const { weight: rankedScarcity, hasRewards } =
          getLeaderboardInfo(leaderboard);
        const cellValues = [
          undefined,
          undefined,
          displayName,
          rankedScarcity,
          hasRewards || 0,
          so5LineupsCount,
          undefined,
        ];
        return {
          leaderboard,
          sortingValue: cellValues[sortColumnIndex],
        };
      })
      .sort((a, b) => {
        const arr = [
          a.sortingValue?.toString() || '',
          b.sortingValue?.toString() || '',
        ];
        if (arr[0] === arr[1]) {
          const {
            leaderboard: { displayName: displayNameA },
          } = a;
          const {
            leaderboard: { displayName: displayNameB },
          } = b;
          return displayNameA.localeCompare(displayNameB, undefined, {
            numeric: true,
          });
        }
        if (sortConfig?.descending) {
          arr.reverse();
        }
        return arr[0].localeCompare(arr[1], undefined, {
          numeric: true,
        });
      })
      .map(({ leaderboard }) => leaderboard);
  }, [sortAndFilters, leaderboardIndex, header, so5Leaderboards]);

  const date = formatDate(startDate, {
    month: 'short',
    day: 'numeric',
  });

  const { cutOffDate, shortDisplayName } = so5Fixture;

  return (
    <FlexColContainer key={startDate}>
      <FlexContainer>
        <Text20 bold color="var(--c-neutral-600)">
          {date}
        </Text20>
        -
        <Text16 bold color="var(--c-neutral-600)">
          {shortDisplayName}
        </Text16>
        {leaderboardIndex === 0 && cutOffDate && (
          <Text16
            bold
            color="var(--c-red-600)"
            style={{ whiteSpace: 'nowrap' }}
          >
            <FormattedMessage
              id="Lobby.Upcoming.GW.timeleft"
              defaultMessage="Starts in {timeleft}"
              values={{
                timeleft: (
                  <TimeLeft
                    time={parseISO(cutOffDate)}
                    Layout={({ children }) => <span>{children}</span>}
                  />
                ),
              }}
            />
          </Text16>
        )}
      </FlexContainer>
      <CompetitionListTable
        header={header}
        defaultSortBy={sortAndFilters?.sortBy?.[leaderboardIndex]}
        onSortChange={sortListBy => {
          if (sortListBy) {
            setSortAndFilters(({ filter, sortBy }) => ({
              filter,
              sortBy: range(
                Math.max(leaderboardIndex + 1, sortBy?.length || 0)
              ).map(i => (i === leaderboardIndex ? sortListBy : sortBy?.[i])),
            }));
          }
        }}
        leaderboards={sortedLeaderboards}
        refetch={refetch}
        extraTeamsCapItems={extraTeamsCapItems}
      />
      {leaderboardIndex === 0 && enableNoCardEntry && <NoCardEntry />}
    </FlexColContainer>
  );
};

DateGroupedSection.fragments = {
  so5Leaderboard: gql`
    fragment DateGroupedSection_so5Leaderboard on So5Leaderboard {
      slug
      displayName
      rarityType
      so5LineupsCount
      startDate
      mySo5Lineups {
        id
      }
      ...getLeaderboardInfo_so5Leaderboard
      ...CompetitionListTable_so5Leaderboard
    }
    ${CompetitionListTable.fragments.so5Leaderboard}
    ${getLeaderboardInfo.fragments.so5Leaderboard}
  `,
  so5Fixture: gql`
    fragment DateGroupedSection_so5Fixture on So5Fixture {
      slug
      cutOffDate
      shortDisplayName
    }
  `,
  clubShopItem: gql`
    fragment DateGroupedSection_clubShopItem on ClubShopItem {
      ...CompetitionListTable_clubShopItem
    }
    ${CompetitionListTable.fragments.clubShopItem}
  `,
};

export default DateGroupedSection;

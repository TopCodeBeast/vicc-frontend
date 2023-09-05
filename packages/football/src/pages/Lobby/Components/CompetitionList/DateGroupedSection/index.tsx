import { TypedDocumentNode, gql } from '@apollo/client';
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
  DateGroupedSection_vicc5Fixture,
  DateGroupedSection_vicc5Leaderboard,
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
  vicc5Fixture: DateGroupedSection_vicc5Fixture;
  leaderboardIndex: number;
  vicc5Leaderboards: DateGroupedSection_vicc5Leaderboard[];
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
  vicc5Fixture,
  leaderboardIndex,
  vicc5Leaderboards,
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
    const sortConfig = sortAndFilters?.sortBy?.[leaderboardIndex];
    if (!sortConfig) {
      return vicc5Leaderboards;
    }
    const { id: defaultId } = defaultSortAndFilters.sortBy[0];
    const sortColumnIndex = header.findIndex(
      ({ id }) => id === (sortConfig.id || defaultId)
    );
    return vicc5Leaderboards
      .map((leaderboard: DateGroupedSection_vicc5Leaderboard) => {
        const { displayName, vicc5LineupsCount } = leaderboard;
        const { weight: rankedScarcity, hasRewards } =
          getLeaderboardInfo(leaderboard);
        const cellValues = [
          undefined,
          undefined,
          displayName,
          rankedScarcity,
          hasRewards || 0,
          vicc5LineupsCount,
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
  }, [sortAndFilters, leaderboardIndex, header, vicc5Leaderboards]);

  const date = formatDate(startDate, {
    month: 'short',
    day: 'numeric',
  });

  const { cutOffDate, shortDisplayName } = vicc5Fixture;

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
            as="div"
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
  vicc5Leaderboard: gql`
    fragment DateGroupedSection_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      displayName
      rarityType
      vicc5LineupsCount
      startDate
      myVicc5Lineups {
        id
      }
      ...getLeaderboardInfo_vicc5Leaderboard
      ...CompetitionListTable_vicc5Leaderboard
    }
    ${CompetitionListTable.fragments.vicc5Leaderboard}
    ${getLeaderboardInfo.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<DateGroupedSection_vicc5Leaderboard>,
  vicc5Fixture: gql`
    fragment DateGroupedSection_vicc5Fixture on Vicc5Fixture {
      slug
      cutOffDate
      shortDisplayName
    }
  ` as TypedDocumentNode<DateGroupedSection_vicc5Fixture>,
  clubShopItem: gql`
    fragment DateGroupedSection_clubShopItem on ClubShopItem {
      ...CompetitionListTable_clubShopItem
    }
    ${CompetitionListTable.fragments.clubShopItem}
  ` as TypedDocumentNode<DateGroupedSection_clubShopItem>,
};

export default DateGroupedSection;

import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { CurrentUserQuery_currentUser } from '@sorare/core/src/contexts/currentUser/types';
import { OneTimeDialog } from '@sorare/core/src/contexts/oneTimeDialog/Provider';
import { LIFECYCLE } from '@sorare/core/src/hooks/useLifecycle';
import useLocalStorage, {
  STORAGE,
} from '@sorare/core/src/hooks/useLocalStorage';
import { groupBy, sortBy } from '@sorare/core/src/lib/arrays';
import { cardAttributes } from '@sorare/core/src/lib/glossary';
import {
  RANKED_SCARCITY,
  RankedScarcity,
  ScarcityType,
  scarcities,
} from '@sorare/core/src/lib/scarcity';

import { getLeaderboardInfo } from '@football/lib/so5';

import CongratsDialog from './CongratsDialog';
import DateGroupedSection, {
  defaultSortAndFilters,
} from './DateGroupedSection';
import { SortAndFilters, SortAndFiltersType } from './SortAndFilters';
import {
  CompetitionList_clubShopItem,
  CompetitionList_so5Leaderboard,
} from './__generated__/index.graphql';

type CurrentUserQuery_currentUser_cardCounts =
  CurrentUserQuery_currentUser['cardCounts'];

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
`;

const getAvailableKickoffsRarity = (
  cardCounts?: CurrentUserQuery_currentUser_cardCounts
) => {
  if (!cardCounts) {
    return Rarity.limited;
  }
  if (cardCounts.unique > 0) {
    return Rarity.unique;
  }
  if (cardCounts.superRare > 0) {
    return Rarity.unique;
  }
  if (cardCounts.rare > 0) {
    return Rarity.super_rare;
  }
  if (cardCounts.limited > 0) {
    return Rarity.rare;
  }
  return Rarity.limited;
};

type Props = {
  so5Leaderboards: CompetitionList_so5Leaderboard[];
  extraTeamsCapItems: Nullable<CompetitionList_clubShopItem[]>;
  refetch: () => void;
};

const messages = defineMessages({
  tabsName: {
    id: 'CompetitionList.sortHeader.Name',
    defaultMessage: 'Name',
  },
  tabsRewards: {
    id: 'CompetitionList.sortHeader.Rewards',
    defaultMessage: 'Rewards',
  },
  tabsParticipants: {
    id: 'CompetitionList.sortHeader.Participants',
    defaultMessage: 'Participants',
  },
});

export const CompetitionList = ({
  so5Leaderboards,
  extraTeamsCapItems,
  refetch,
}: Props) => {
  const { formatMessage } = useIntl();
  const { currentUser } = useCurrentUserContext();

  const displayComposeTeamCongrats = so5Leaderboards.some(
    ({ commonDraftCampaign, mySo5Lineups }) =>
      !!mySo5Lineups.length &&
      commonDraftCampaign?.slug === 'global_cup_group_phase'
  );

  const [sortAndFilters, setSortAndFilters] =
    useLocalStorage<SortAndFiltersType>(
      STORAGE.lobby.sortFilterPreference,
      defaultSortAndFilters
    );
  const header = useMemo(
    () => [
      { id: 'badge' },
      {
        id: 'logo',
      },
      {
        id: 'name',
        cell: formatMessage(messages.tabsName),
      },
      {
        id: 'scarcity',
        cell: formatMessage(cardAttributes.scarcity),
      },
      {
        id: 'rewards',
        cell: formatMessage(messages.tabsRewards),
      },

      {
        id: 'players',
        cell: formatMessage(messages.tabsParticipants),
      },
      { id: 'cta' },
    ],
    [formatMessage]
  );

  const filteredLeaderboards = useMemo(() => {
    if (!sortAndFilters?.filter) {
      return so5Leaderboards;
    }

    return so5Leaderboards.filter(leaderboard => {
      const { backgroundScarcity } = getLeaderboardInfo(leaderboard);
      const { cardsCountOfCurrentUser } = leaderboard?.rules || {};
      const { showRecommended, scarcity = 'all' } = sortAndFilters.filter!;
      const filteredByScarcity = ['all', backgroundScarcity].includes(scarcity);
      const { hasFeaturedStarterPacks, canCompose, rarityType } = leaderboard;

      if (!showRecommended) {
        return filteredByScarcity;
      }

      if (
        hasFeaturedStarterPacks ||
        canCompose.value ||
        rarityType === Rarity.common
      ) {
        return filteredByScarcity;
      }

      const availableKickoff =
        cardsCountOfCurrentUser?.maximumCards === 10 &&
        getAvailableKickoffsRarity(currentUser?.cardCounts) ===
          cardsCountOfCurrentUser?.scarcity;

      return availableKickoff && filteredByScarcity;
    });
  }, [currentUser?.cardCounts, so5Leaderboards, sortAndFilters.filter]);

  const groupedLeaderboardsEntries = useMemo(
    () =>
      sortBy(
        element => element[0],
        Object.entries(
          groupBy(({ startDate }) => startDate, filteredLeaderboards)
        )
      ),
    [filteredLeaderboards]
  );

  const rarities = useMemo(
    () =>
      sortBy(
        el => RANKED_SCARCITY[el as RankedScarcity],
        Array.from(
          new Set(
            so5Leaderboards
              .map(
                sl =>
                  scarcities.includes(sl.rarityType as ScarcityType) &&
                  sl.rarityType
              )
              .filter(Boolean)
          )
        )
      ),
    [so5Leaderboards]
  );

  return (
    <Root>
      <SortAndFilters
        defaultValues={{ ...defaultSortAndFilters, ...sortAndFilters }}
        sortLabel={header}
        onChange={values => {
          setSortAndFilters(filter => ({
            ...filter,
            ...values,
          }));
        }}
        values={rarities as ScarcityType[]}
      />
      {groupedLeaderboardsEntries.map(([startDate, leaderboards], i) => {
        return (
          <DateGroupedSection
            key={startDate}
            so5Fixture={leaderboards[0].so5Fixture}
            leaderboardIndex={i}
            so5Leaderboards={leaderboards}
            sortAndFilters={sortAndFilters}
            setSortAndFilters={setSortAndFilters}
            startDate={startDate}
            header={header}
            refetch={refetch}
            extraTeamsCapItems={extraTeamsCapItems}
          />
        );
      })}
      <OneTimeDialog
        dialogId={LIFECYCLE.sawComposeTeamCongrats}
        show={displayComposeTeamCongrats}
      >
        {({ onClose, open }) => (
          <CongratsDialog onClose={onClose} open={open} />
        )}
      </OneTimeDialog>
    </Root>
  );
};

CompetitionList.fragments = {
  so5Leaderboard: gql`
    fragment CompetitionList_so5Leaderboard on So5Leaderboard {
      slug
      hasFeaturedStarterPacks
      so5Fixture {
        slug
        ...DateGroupedSection_so5Fixture
      }
      rules {
        id
        cardsCountOfCurrentUser {
          maximumCards
          scarcity
        }
      }
      ...DateGroupedSection_so5Leaderboard
      ...getLeaderboardInfo_so5Leaderboard
    }
    ${DateGroupedSection.fragments.so5Leaderboard}
    ${DateGroupedSection.fragments.so5Fixture}
    ${getLeaderboardInfo.fragments.so5Leaderboard}
  `,
  clubShopItem: gql`
    fragment CompetitionList_clubShopItem on ClubShopItem {
      ...DateGroupedSection_clubShopItem
    }
    ${DateGroupedSection.fragments.clubShopItem}
  `,
};

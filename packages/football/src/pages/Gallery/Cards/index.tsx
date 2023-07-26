import { useMemo } from 'react';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import { useUseCustomLists } from '@sorare/core/src/lib/featureFlags';

import useDefaultFilters from '@sorare/marketplace/src/hooks/useDefaultFilters';
import {
  // CustomDecksFilter,
  FavoriteFilter,
  LeagueFilter,
  // NotInLineupFilter,
  PlayingNextGameweekFilter,
  RefineActiveClub,
  RefineActiveNationalTeam,
  RefineAppearances,
  RefineAverageScore,
  RefineCardEdition,
  RefineCardLevel,
  RefineCardPlayerAge,
  RefineCustomDeck,
  RefineLeague,
  RefineNationality,
  // RefineOnSale,
  RefinePlayer,
  RefineRarity,
  RefineSeason,
  RefineSerialNumber,
  RefineTeam,
} from '@sorare/marketplace/src/searchCards';

// import LongLiveTheSquads from '@football/components/dialogs/LongLiveTheSquads';
import AdvancedCardSearch from '@football/components/searchCards/AdvancedCardSearch';
import { RefineFootballPosition } from '@football/components/searchCards/RefinePosition';
// import ReferralBar from '@football/components/user/ReferralBar';

interface Props {
  user: {
    id: string;
    slug: string;
  };
  readOnly?: boolean;
}

export const Cards = ({ user, readOnly }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const useCustomLists = useUseCustomLists();
  const isCurrentUser = currentUser?.id === user.id;
  const includeCommonCards = isCurrentUser
    ? !currentUser?.userSettings?.hideCommonCards
    : false;

  const cardFilters = useMemo(() => {
    return [
      RefineRarity(),
      // RefineOnSale(),
      // NotInLineupFilter,
      PlayingNextGameweekFilter,
      FavoriteFilter,
      // useCustomLists ? CustomDecksFilter : RefineCustomDeck,
      RefineFootballPosition,
      LeagueFilter,
      RefineLeague,
      RefineCardEdition,
      RefineCardLevel,
      RefineTeam,
      RefineSeason,
      RefinePlayer,
      RefineCardPlayerAge,
      RefineActiveClub,
      RefineActiveNationalTeam,
      RefineNationality,
      RefineSerialNumber({ withJerseySerial: true }),
      RefineAverageScore(),
      RefineAppearances(),
    ].filter(Boolean);
  }, [useCustomLists]);

  const filters = useDefaultFilters({ userId: idFromObject(user.id) });

  return (
    <>
      <AdvancedCardSearch
        analyticsTags={['Gallery', 'Football']}
        defaultFilters={filters}
        cardFilters={cardFilters}
        sorts={[
          'Cards New',
          'Cards Highest Average Score',
          'Cards Highest Price',
          'Cards Lowest Price',
          'Cards Player Name',
        ]}
        includeCommonCards={includeCommonCards}
        hideOwner
        galleryOwnerSlug={user.slug}
        editableLists={!readOnly}
      >
        <>ReferralBar6666666</>
        {/* {!readOnly && <ReferralBar context="gallery" smallBorder />} */}
      </AdvancedCardSearch>
      {/* <LongLiveTheSquads /> */}
    </>
  );
};

export default Cards;

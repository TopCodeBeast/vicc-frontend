import { So5LeaderboardType } from '@sorare/core/src/__generated__/globalTypes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

import { SEMI_PRO_TOURNAMENT_TYPES } from '@football/lib/leaderboard';
import { isFreeUser } from '@football/lib/user';

export const useDisplaySemiProIncentive = (
  so5LeaderboardType: Nullable<So5LeaderboardType>
) => {
  const {
    flags: {
      useDisplaySemiProIncentiveNew = 'out',
      useDisplaySemiProIncentiveFree = 'out',
    },
  } = useFeatureFlags();

  const { currentUser } = useCurrentUserContext();

  return (
    (useDisplaySemiProIncentiveNew === 'treatment' ||
      useDisplaySemiProIncentiveFree === 'treatment') &&
    isFreeUser(currentUser) &&
    !!so5LeaderboardType &&
    SEMI_PRO_TOURNAMENT_TYPES.includes(so5LeaderboardType)
  );
};

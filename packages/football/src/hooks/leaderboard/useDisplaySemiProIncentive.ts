import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

import { SEMI_PRO_TOURNAMENT_TYPES } from '@football/lib/leaderboard';
import { isFreeUser } from '@football/lib/user';

export const useDisplaySemiProIncentive = (
  vicc5LeaderboardType?: string
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
    !!vicc5LeaderboardType &&
    SEMI_PRO_TOURNAMENT_TYPES.includes(vicc5LeaderboardType)
  );
};

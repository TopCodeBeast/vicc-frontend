import { Sport } from '__generated__/globalTypes';
import idFromObject from '@core/gql/idFromObject';

export const useLocalStorageKey = (
  s: Sport,
  currentUserId: string | undefined
) => {
  if (!currentUserId) {
    return `onboarding_anonymous`; // doesn't matter
  }
  return `onboarding_${s}_${idFromObject(currentUserId)}`;
};

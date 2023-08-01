import { differenceInSeconds } from 'date-fns';

export const alreadyJoinedUserGroup = (joinDate?: string) => {
  if (!joinDate) return false;
  return differenceInSeconds(new Date(), new Date(joinDate)) >= 30;
};

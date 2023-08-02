import { differenceInYears } from 'date-fns';

export const useIsNotMajor = (dob: Date | undefined) => {
  const now = new Date();
  return dob && differenceInYears(now, new Date(dob)) < 18;
};

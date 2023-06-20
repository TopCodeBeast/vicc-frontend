import {
  add,
  fromUnixTime,
  getUnixTime,
  intervalToDuration,
  parseISO,
  sub,
} from 'date-fns';

let now: Date | undefined;

const getNow = () => {
  if (now === undefined) {
    now = new Date();
  }
  return now;
};

export const fromBirthDateToAge = (
  value: number | string,
  {
    seasonYear = undefined,
    singleCivilYearSeason = false,
  }: {
    seasonYear?: number;
    singleCivilYearSeason?: boolean;
  } = {}
) => {
  let from;
  if (typeof value === 'number') {
    if (value === Infinity || value === -Infinity) from = fromUnixTime(0);
    else from = fromUnixTime(value);
  } else {
    from = parseISO(value);
  }
  // We're assuming that seasons end before the 1st day of the starting month and start after
  // the 1st of that month. So that the age of a player for a given season is his
  // age at the start of the season.
  // Season on 2 civil years start on July 1st, those on 1 civil year on January 1st
  if (seasonYear) {
    const seasonStartingMonth = singleCivilYearSeason ? 0 : 6;

    return intervalToDuration({
      start: from,
      end: new Date(seasonYear, seasonStartingMonth, 1),
    }).years!;
  }
  return intervalToDuration({
    start: from,
    end: getNow(),
  }).years!;
};

export const fromAgeToMinBirthDate = (value: number) => {
  return getUnixTime(add(sub(getNow(), { years: value + 1 }), { days: 1 }));
};
export const fromAgeToMaxBirthDate = (value: number) => {
  return getUnixTime(sub(getNow(), { years: value }));
};

export const format = (
  season: { startYear: number },
  {
    separator = '-',
    singleCivilYear = false,
  }: {
    separator?: string;
    singleCivilYear?: boolean;
  } = {}
) => {
  if (singleCivilYear) return season.startYear.toString();

  const next = (season.startYear + 1).toString().slice(-2);
  return `${season.startYear}${separator}${next}`;
};

export const formatFilter = (season: string) =>
  format({ startYear: parseInt(season, 10) });

const TOP_5_COMPETITIONS = [
  'premier-league-gb-eng',
  'laliga-santander',
  'laliga-es',
  'serie-a-it',
  'bundesliga-de',
  'ligue-1-fr',
];

const sortCompetition = (
  competition1: {
    slug: string;
    displayName: string;
  } | null,
  competition2: {
    slug: string;
    displayName: string;
  } | null
) => {
  if (!competition1 && !competition2) {
    return 0;
  }
  if (!competition1) {
    return 1;
  }
  if (!competition2) {
    return -1;
  }

  const index1 = TOP_5_COMPETITIONS.indexOf(competition1.slug);
  const index2 = TOP_5_COMPETITIONS.indexOf(competition2.slug);

  if (index1 === -1 && index2 === -1) {
    return competition1.displayName.localeCompare(competition2.displayName);
  }
  if (index1 === -1) {
    return 1;
  }
  if (index2 === -1) {
    return -1;
  }
  return index1 - index2;
};

export default sortCompetition;

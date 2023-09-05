import { FunctionComponent, useState } from 'react';

import { Sport } from '__generated__/globalTypes';
import { AlgoliaIndexes } from '@core/contexts/config';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { Lifecycle } from '@core/hooks/useLifecycle';
import { useAppBarContext } from '@core/routing/MultiSportAppBar/context';

import { InstantSearch } from '../InstantSearch';
import SearchBar, { MAX_RESULTS } from '../SearchBar';

const makeSearchBar = (sport: Sport, indexes: (keyof AlgoliaIndexes)[]) =>
  function InstantSearchSearchBar(
    props: React.ComponentProps<typeof SearchBar> & {
      getOptionalFilters: (index: string) => string[];
    }
  ) {
    const { getOptionalFilters } = props;
    const [displayLatestSearchItem, setDisplayLatestSearchItem] =
      useState(true);
    return (
      <InstantSearch
        indexes={indexes}
        defaultHitsPerPage={MAX_RESULTS}
        analyticsTags={['SearchBar']}
        sport={sport}
        distinct={false}
        {...(displayLatestSearchItem ? { getOptionalFilters } : {})}
      >
        <SearchBar
          {...props}
          setDisplayLatestSearchItem={setDisplayLatestSearchItem}
        />
      </InstantSearch>
    );
  };

interface Props {
  onExit: boolean;
  onSelect: () => void;
}

const SPORTS = Object.keys(Sport) as Sport[];

const SearchBarComponents: {
  [key in Sport]: FunctionComponent<
    React.PropsWithChildren<
      React.ComponentProps<typeof SearchBar> & {
        getOptionalFilters: (index: string) => string[];
      }
    >
  >;
} = {
  [Sport.BASEBALL]: makeSearchBar(Sport.BASEBALL, ['Player', 'Club', 'User']),
  [Sport.CRICKET]: makeSearchBar(Sport.CRICKET, [
    'Player',
    'Club',
    'Country',
    'Competition',
    'User',
  ]),
  [Sport.NBA]: makeSearchBar(Sport.NBA, ['Player', 'Club', 'User']),
};

const MultiSportSearchBar = ({ onExit, onSelect }: Props) => {
  const { sport: currentSport = Sport.CRICKET } = useAppBarContext();
  const { currentUser } = useCurrentUserContext();
  const [presetSearch, setPresetSearch] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState(currentSport);
  const selectSport = (sportInput: Sport, search: string) => {
    setSelectedSport(sportInput);
    setPresetSearch(search);
  };

  const lifecycle = currentUser?.userSettings?.lifecycle as Lifecycle;
  const latestSearchedItems = lifecycle?.latestSearchedItems;

  const sortedSports = [
    currentSport,
    ...SPORTS.filter(s => s !== currentSport),
  ];

  const SearchBarComponent = SearchBarComponents[selectedSport];

  const getOptionalFilters = (index: string) =>
    latestSearchedItems
      ? (latestSearchedItems[selectedSport] || [])
          .filter(item => item.index === index)
          .map((item, i) => `objectID:${item.objectID}<score=${1000 - i}>`)
      : [];

  return (
    <SearchBarComponent
      onExit={onExit}
      onSelect={onSelect}
      selectSport={selectSport}
      selectedSport={selectedSport}
      sortedSports={sortedSports}
      getOptionalFilters={getOptionalFilters}
      {...(presetSearch && { presetSearch })}
    />
  );
};

export default MultiSportSearchBar;

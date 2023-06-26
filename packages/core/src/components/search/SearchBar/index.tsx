import { useEffect, useMemo, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { useInstantSearch, useSearchBox } from 'react-instantsearch-hooks-web';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { generatePath, useNavigate } from 'react-router-dom';
import { useDebounce } from 'react-use';
import styled, { css } from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import SearchInput from '@core/atoms/inputs/SearchInput';
import { Caption } from '@core/atoms/typography';
import {
  FOOTBALL_CLUB_SHOW_CARDS,
  FOOTBALL_USER_GALLERY_OVERVIEW,
  LEGACY_COUNTRY_SHOW,
  LEGACY_LEAGUE_SHOW_CARDS,
  LEGACY_PLAYER_SHOW_CARDS,
  MLB_TEAM_CARDS,
  MLB_USER_GALLERY,
  NBA_TEAM_CARDS,
  NBA_USER_GALLERY,
} from '@core/constants/routes';
import { useConfigContext } from '@core/contexts/config';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSportContext } from '@core/contexts/sport';
import useLifecycle, { LIFECYCLE, Lifecycle } from '@core/hooks/useLifecycle';
import useEvents from '@core/lib/events/useEvents';
import { glossary, sportsLabelsMessages } from '@core/lib/glossary';
import { sportFromJSON } from '@core/protos/events/shared/events';
import { theme } from '@core/style/theme';
import { OverrideClasses } from '@core/style/utils';

import ClubSuggestion from '../ClubSuggestion';
import CompetitionSuggestion from '../CompetitionSuggestion';
import CountrySuggestion from '../CountrySuggestion';
import EmptyResult from '../EmptyResult';
import { buildFilterQuery } from '../InstantSearch';
import { SEARCH_PARAMS } from '../InstantSearch/types';
import PlayerSuggestion from '../PlayerSuggestion';
import UserSuggestion from '../UserSuggestion';

export const MAX_RESULTS = 9;

const getSectionSuggestions = (section: any) => {
  section.hits.forEach((h: any) => {
    h.index = section.index;
  });
  return section.hits;
};

interface Props {
  onExit: boolean;
  onSelect?: () => void;
  selectedSport: Sport;
  sortedSports: Sport[];
  selectSport: (sportInput: Sport, searchTerm: string) => void;
  presetSearch?: string;
  setDisplayLatestSearchItem?: (value: boolean) => void;
}

const messages = defineMessages({
  tabsTitle: {
    id: 'MultiSportAutosuggestSearchInput.tabsTitle',
    defaultMessage: 'I’m looking for',
  },
  players: {
    id: 'SearchBar.players',
    defaultMessage: 'Players',
  },
  countries: {
    id: 'SearchBar.countries',
    defaultMessage: 'Countries',
  },
  clubs: {
    id: 'SearchBar.clubs',
    defaultMessage: 'Clubs',
  },
  teams: {
    id: 'SearchBar.teams',
    defaultMessage: 'Teams',
  },
  managers: {
    id: 'SearchBar.managers',
    defaultMessage: 'Managers',
  },
  leagues: {
    id: 'SearchBar.leagues',
    defaultMessage: 'Leagues',
  },
});

const SectionTitle = styled(Caption)`
  padding: var(--unit) var(--unit) 0px 0px;
`;

const [StyledAutosuggest, classes] = OverrideClasses(Autosuggest, null, {
  container: css`
    position: relative;
    line-height: 1;
    flex-grow: 1;
    width: 100%;
  `,
  suggestionsContainerOpen: css`
    margin: 10px -50px;
    width: 100%;
    left: 0;
    right: 0;
    box-shadow: none;
    @media (min-width: ${theme.breakpoints.values.desktop}px) {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      margin: 10px 0px;
    }
  `,
  suggestionsList: css`
    margin: 0;
    padding: 0;
    list-style-type: none;
  `,
  suggestion: css`
    display: block;
  `,
});
const AutosuggestContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TabsContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  margin-left: -50px;
  @media (min-width: ${theme.breakpoints.values.desktop}px) {
    margin-left: 0;
  }
`;
const Tabs = styled.div`
  display: flex;
  gap: 10px;
`;

export const SearchBar = ({
  onExit,
  onSelect = () => {},
  selectSport: doSelectSport,
  selectedSport,
  sortedSports,
  presetSearch,
  setDisplayLatestSearchItem,
}: Props) => {
  const [suggestionValue, setSuggestionValue] = useState<string>();
  const { currentUser } = useCurrentUserContext();
  const { update } = useLifecycle();
  const { refine, query: currentSearch } = useSearchBox();
  const { scopedResults, results: searchResults } = useInstantSearch();
  const track = useEvents();
  const lifecycle = currentUser?.userSettings?.lifecycle as Lifecycle;
  const latestSearchedItems = lifecycle?.latestSearchedItems;

  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [search, setSearch] = useState(presetSearch || currentSearch);
  const { algoliaIndexes } = useConfigContext();
  const { generateSportPath } = useSportContext();
  const handleSuggestionsClearRequested = () => {};
  const shouldRenderSuggestions = () => true;
  const [hasNotClickedResult, setHasNotClickedResult] = useState<boolean>(true);

  const searchWithOnSale = buildFilterQuery({
    [SEARCH_PARAMS.ON_SALE]: true,
  });
  // Select sport & ensure we do not deal with more than MAX_RESULTS items
  const truncatedLatestSearchedItems = latestSearchedItems
    ? (latestSearchedItems[selectedSport] || []).slice(0, MAX_RESULTS)
    : [];

  const getMaxResults = (index: string, defaultValue = 2) => {
    return Math.max(
      truncatedLatestSearchedItems.filter(
        latestSearchedItem => latestSearchedItem.index === index
      ).length,
      defaultValue
    );
  };

  const indexConfig = {
    [algoliaIndexes.Player]: {
      route: LEGACY_PLAYER_SHOW_CARDS,
      search: searchWithOnSale,
      title: formatMessage(messages.players),
      suggestion: PlayerSuggestion,
      maxResults: getMaxResults(algoliaIndexes.Player, 6),
    },
    [algoliaIndexes.Country]: {
      route: LEGACY_COUNTRY_SHOW,
      title: formatMessage(messages.countries),
      suggestion: CountrySuggestion,
      maxResults: getMaxResults(algoliaIndexes.Country),
    },
    [algoliaIndexes.Club]: {
      routes: {
        [Sport.FOOTBALL]: FOOTBALL_CLUB_SHOW_CARDS,
        [Sport.BASEBALL]: MLB_TEAM_CARDS,
        [Sport.NBA]: NBA_TEAM_CARDS,
      },
      search: searchWithOnSale,
      titles: {
        [Sport.FOOTBALL]: formatMessage(messages.clubs),
        [Sport.BASEBALL]: formatMessage(messages.teams),
        [Sport.NBA]: formatMessage(messages.teams),
      },
      suggestion: ClubSuggestion,
      maxResults: getMaxResults(algoliaIndexes.Club, 3),
    },
    [algoliaIndexes.User]: {
      routes: {
        [Sport.FOOTBALL]: FOOTBALL_USER_GALLERY_OVERVIEW,
        [Sport.BASEBALL]: MLB_USER_GALLERY,
        [Sport.NBA]: NBA_USER_GALLERY,
      },
      title: formatMessage(messages.managers),
      suggestion: UserSuggestion,
      maxResults: getMaxResults(algoliaIndexes.User),
      hideWithoutQuery:
        truncatedLatestSearchedItems.findIndex(
          truncatedLatestSearchedItem =>
            truncatedLatestSearchedItem.index === algoliaIndexes.User
        ) === -1,
    },
    [algoliaIndexes.Competition]: {
      route: LEGACY_LEAGUE_SHOW_CARDS,
      search: searchWithOnSale,
      title: formatMessage(messages.leagues),
      suggestion: CompetitionSuggestion,
      maxResults: getMaxResults(algoliaIndexes.Competition),
    },
  };

  const getConfig = (index: keyof typeof indexConfig) => {
    const result = indexConfig[index];
    if (result) {
      return result!;
    }
    throw new Error(`Missing config for ${index}`);
  };

  const getLink = (s: any) => {
    const config = getConfig(s.index);

    // sport-agnostic routes
    if (config.route) {
      const path = generateSportPath(
        generatePath(config.route, {
          slug: s.objectID,
        }),
        { sport: selectedSport }
      );
      return `${path}${config.search ? `?${config.search}` : ''}`;
    }

    // sport-specific routes
    const route = config.routes?.[selectedSport];
    if (!route) {
      throw new Error(`Missing route config for ${s.index}/${selectedSport}`);
    }
    const path = generatePath(route, { slug: s.objectID });
    return `${path}${config.search ? `?${config.search}` : ''}`;
  };

  const renderSectionTitle = (section: any) => {
    const config = getConfig(section.index);
    const title = config.title || config.titles?.[selectedSport];

    return section.hits.length > 0 ? (
      <SectionTitle color="var(--c-neutral-600)">{title}</SectionTitle>
    ) : null;
  };

  // First iteration, we stick to legacy search inputs
  const hits = scopedResults.map(result => {
    const config = getConfig(result.results.index);

    return {
      index: result.indexId,
      hits:
        config.hideWithoutQuery && !search
          ? []
          : result.results.hits.slice(0, config.maxResults).map(h => ({
              ...h,
              index: result.indexId,
            })),
    };
  });

  // since we are querying multiple indexes, hits has the following structure:
  // [
  //    { index: 'Player', hits: [{ display_name: 'Kylian Mbappé' }, { display_name: 'Antoine Griezmann' }]},
  //    { index: 'Club', hits: [{ name: 'PSG' }]}
  // ]
  const results: typeof hits = JSON.parse(JSON.stringify(hits));
  const nbIndex = results.length;
  let nbResults = results.reduce((acc, index) => acc + index.hits.length, 0);
  let iteration = 0;
  // remove the last hit from each index alternatively until the number of results is correct
  while (nbResults > MAX_RESULTS) {
    const indexHits = results[iteration % nbIndex].hits;
    if (indexHits.length > 0) {
      if (
        !truncatedLatestSearchedItems.find(
          latestSearchedItem =>
            latestSearchedItem.objectID ===
              indexHits[indexHits.length - 1].objectID &&
            indexHits[indexHits.length - 1].index === latestSearchedItem.index
        )
      ) {
        (indexHits as any).splice(-1);
        nbResults -= 1;
      }
    }
    iteration += 1;
  }

  const isLoadingAfterChangingTab = useMemo(
    () => presetSearch && !searchResults?.query,
    [presetSearch, searchResults?.query]
  );

  const emptyResult = useMemo(() => {
    if (isLoadingAfterChangingTab) return false;
    if (nbResults === 0) return true;
    return false;
  }, [isLoadingAfterChangingTab, nbResults]);

  const selectSport = (sport: Sport, searchTerm: string) => {
    track('Click Filter In Search', {
      searchTerm,
      context: sportFromJSON(selectedSport),
      sport,
    });
    doSelectSport(sport, searchTerm);
  };

  useEffect(() => {
    return () => {
      if (hasNotClickedResult && onExit) {
        track('Exit Search Without Clicking Result', {
          searchTerm: search,
          context: sportFromJSON(selectedSport),
        });
      }
    };
    // do not include `search` in the dependencies, we don't want this to be
    // triggered at each keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onExit, hasNotClickedResult, track]);

  useDebounce(
    () => {
      if (suggestionValue !== undefined) {
        setDisplayLatestSearchItem?.(
          suggestionValue === '' || suggestionValue === undefined
        );
        refine(suggestionValue);
      }
    },
    300,
    [suggestionValue, setDisplayLatestSearchItem]
  );

  const addItemToLatestSearch = (s: any) => {
    if (!currentUser) return;
    const alreadyExist = truncatedLatestSearchedItems.find(
      latestSearchedItem =>
        latestSearchedItem.objectID === s.objectID &&
        s.index === latestSearchedItem.index
    );
    if (alreadyExist) {
      return;
    }
    const newArray = [
      {
        objectID: s.objectID,
        sport: selectedSport,
        index: s.index,
      },
      ...truncatedLatestSearchedItems,
    ];
    const itemToUpdate = {
      ...latestSearchedItems,
      ...{ [selectedSport]: newArray.slice(0, MAX_RESULTS) },
    };
    update(LIFECYCLE.latestSearchedItems, itemToUpdate);
  };
  return (
    <StyledAutosuggest
      highlightFirstSuggestion
      multiSection
      alwaysRenderSuggestions
      theme={classes}
      suggestions={isLoadingAfterChangingTab ? [] : results}
      onSuggestionsFetchRequested={({ value }) => setSuggestionValue(value)}
      onSuggestionsClearRequested={handleSuggestionsClearRequested}
      onSuggestionSelected={(event, { suggestion }) => {
        const destination = getLink(suggestion);
        setHasNotClickedResult(false);
        track('Click Search Result', {
          resultCategory: suggestion.index,
          resultDestination: destination,
          searchTerm: search,
          context: sportFromJSON(selectedSport),
        });
        addItemToLatestSearch(suggestion);
        navigate(destination);
        onSelect();
      }}
      getSuggestionValue={() => search}
      shouldRenderSuggestions={shouldRenderSuggestions}
      renderSuggestion={(hit: any, { isHighlighted }) => {
        const { index } = hit;
        const SuggestionComponent = getConfig(index).suggestion;

        return (
          <SuggestionComponent
            key={hit.objectID}
            hit={hit}
            isHighlighted={isHighlighted}
          />
        );
      }}
      inputProps={{
        value: search,
        placeholder: formatMessage(glossary.search),
        onChange: (event, { newValue }) => {
          setSearch(newValue);
        },
        autoFocus: true,
      }}
      renderInputComponent={({
        onChange,
        value,
        withIcon = false,
        ...rest
      }) => (
        <AutosuggestContainer>
          <SearchInput
            withIcon={withIcon}
            fullWidth
            onChange={event =>
              onChange(event, {
                newValue: event.target.value,
                method: 'type',
              })
            }
            {...rest}
            value={value}
          />
          {sortedSports && sortedSports.length > 0 && (
            <TabsContainer>
              <div>
                <Caption color="var(--c-neutral-600)">
                  <FormattedMessage {...messages.tabsTitle} />
                </Caption>
              </div>
              <Tabs>
                {sortedSports.map((sport: Sport) => (
                  <Button
                    key={sport}
                    medium
                    color={sport === selectedSport ? 'black' : 'white'}
                    onClick={() => selectSport(sport, value)}
                  >
                    <FormattedMessage {...sportsLabelsMessages[sport]} />
                  </Button>
                ))}
              </Tabs>

              {emptyResult && (
                <Tabs>
                  <EmptyResult sport={selectedSport} />
                </Tabs>
              )}
            </TabsContainer>
          )}
        </AutosuggestContainer>
      )}
      renderSectionTitle={renderSectionTitle}
      getSectionSuggestions={getSectionSuggestions}
      focusInputOnSuggestionClick={false}
    />
  );
};

export default SearchBar;

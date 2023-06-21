import { AlgoliaSearchHelper } from 'algoliasearch-helper';
import qs from 'qs';
import { useEffect, useState } from 'react';
import {
  InstantSearch as AlgoliaInstantSearch,
  Configure,
  Index,
  useInstantSearch,
} from 'react-instantsearch-hooks-web';
import {
  useLocation,
  useNavigate,
  useNavigationType,
  useSearchParams,
} from 'react-router-dom';

import { AlgoliaIndexes, useConfigContext } from '@core/contexts/config';
import { useSearchCardsContext } from '@core/contexts/searchCards';
import useSearchClient from '@core/hooks/search/useSearchClient';
import { useMarketplaceLifecycle } from '@core/hooks/useMarketplaceLifecycle';
import { useVirtualToggleManager } from '@core/hooks/useVirtualToggleManager';
import { joinFiltersWithAnd, sportFilter } from '@core/lib/algolia';
import {
  APPEARANCES_15_MAX,
  APPEARANCES_5_MAX,
  APPEARANCES_MIN,
  LEVEL_MAX,
  LEVEL_MIN,
} from '@core/lib/cards';
import { FILTERS } from '@core/lib/filters';

import InstantSearchRefresh from './Refresh';
import {
  ExtendedIndexUIState,
  ExtendedUIState,
  Props,
  RouteState,
  SEARCH_PARAMS,
  SearchProps,
} from './types';

export const buildFilterQuery = (filters: { [key in SEARCH_PARAMS]?: any }) =>
  qs.stringify(filters, { arrayFormat: 'comma' });

export const decodeRefinements = (refinements: any): any => {
  if (!refinements) {
    return undefined;
  }
  if (Array.isArray(refinements)) {
    return refinements.length === 0 ? undefined : refinements;
  }
  if (typeof refinements === 'string') {
    return refinements.split(',');
  }
  // we don't know this kind of refinements
  return undefined;
};

const compactRefinements = (refinements: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(refinements).filter(e => {
      const v = e[1];
      if (v === undefined) {
        return false;
      }
      if (typeof v === 'object') {
        return Object.keys(v).length > 0;
      }
      return true;
    })
  );

const stringifyParams = (
  params: Record<
    SEARCH_PARAMS,
    string | string[] | boolean | number | undefined
  >
): RouteState => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value ? String(value) : undefined,
    }),
    {}
  ) as RouteState;
};

export const indexStateToRoute = (
  indexState: ExtendedIndexUIState,
  algoliaIndexes?: AlgoliaIndexes
): RouteState => {
  const {
    query,
    sortBy,
    page,
    refinementList: {
      'domestic_league.display_name': domesticLeague,
      'team.long_name': team,
      rarity,
      position,
      'player.display_name': playerName,
      'active_national_team.long_name': nationalTeam,
      season,
      'active_league.display_name': league,
      'active_club.long_name': club,
      'active_team.long_name': activeTeam,
      'card_edition.display_name': edition,
      'sale.bundled': bundled,
      'custom_decks.name': decks,
      'country.name_en': nationality,
    } = {},
    range: {
      grade,
      'player.birth_date_i': age,
      'baseball_stats.last_fifteen_average_score': mlb15Avg,
      'baseball_stats.season_average_score': mlbSAvg,
      'so5.last_five_so5_average_score': so55Avg,
      'so5.last_fifteen_so5_average_score': so515Avg,
      'so5.last_five_so5_appearances': so5L5App,
      'so5.last_fifteen_so5_appearances': so5L15App,
      'sale.price': pr,
      serial_number: sn,
      'nba_stats.ten_game_average': nba10Avg,
    } = {},
    toggle: {
      on_sale: onSale,
      latest_season: latestSeason,
      jersey_serial: jerseySrial,
    } = {},
    virtualToggle: {
      co,
      legend,
      ff,
      lf,
      pn,
      promo,
      sgc: globalCup,
      unstacked,
      deck: custom_decks,
      nl,
    } = {},
  } = indexState;

  const sort =
    (algoliaIndexes &&
      Object.entries(algoliaIndexes).find(v => v[1] === sortBy)?.[0]) ||
    sortBy;

  return stringifyParams({
    [SEARCH_PARAMS.QUERY]: query,
    [SEARCH_PARAMS.SORT]: sort,
    [SEARCH_PARAMS.PAGE]: page,
    [SEARCH_PARAMS.DOMESTIC_LEAGUE]: domesticLeague,
    [SEARCH_PARAMS.PROMOTION]: promo,
    [SEARCH_PARAMS.TEAM]: team,
    [SEARCH_PARAMS.RARITY]: rarity,
    [SEARCH_PARAMS.POSITION]: position,
    [SEARCH_PARAMS.PLAYER_NAME]: playerName,
    [SEARCH_PARAMS.NATIONAL_TEAM]: nationalTeam,
    [SEARCH_PARAMS.NATIONALITY]: nationality,
    [SEARCH_PARAMS.SEASON]: season,
    [SEARCH_PARAMS.LEAGUE]: league,
    [SEARCH_PARAMS.CLUB]: club,
    [SEARCH_PARAMS.ACTIVE_TEAM]: activeTeam,
    [SEARCH_PARAMS.EDITION]: edition,
    [SEARCH_PARAMS.BUNDLED]: bundled,
    [SEARCH_PARAMS.DECK]: decks || custom_decks,
    // Work-around range bug: forcing the min/max of the connectRange triggers a refinement
    [SEARCH_PARAMS.GRADE]:
      grade === `${LEVEL_MIN}:${LEVEL_MAX}` ? undefined : grade,
    [SEARCH_PARAMS.AGE]: age,
    [SEARCH_PARAMS.ON_SALE]: onSale,
    [SEARCH_PARAMS.LATEST_SEASON]: latestSeason,
    [SEARCH_PARAMS.FAVORITE_FILTER]: ff,
    [SEARCH_PARAMS.NON_PLAYABLE_CARDS]: co,
    [SEARCH_PARAMS.LEGEND]: legend,
    [SEARCH_PARAMS.LEAGUE_FILTER]: lf,
    [SEARCH_PARAMS.PLAYING_NEXT]: pn,
    [SEARCH_PARAMS.PRICE]: pr,
    [SEARCH_PARAMS.SERIAL_NUMBER]: sn,
    [SEARCH_PARAMS.MLB_15_AVERAGE]: mlb15Avg,
    [SEARCH_PARAMS.MLB_SEASON_AVG]: mlbSAvg,
    [SEARCH_PARAMS.SO5_15_AVERAGE]: so515Avg,
    [SEARCH_PARAMS.SO5_5_AVERAGE]: so55Avg,
    [SEARCH_PARAMS.NBA_10_AVERAGE]: nba10Avg,
    // Work-around range bug: forcing the min/max of the connectRange triggers a refinement
    [SEARCH_PARAMS.SO5_5_APPEARANCES]:
      so5L5App === `${APPEARANCES_MIN}:${APPEARANCES_5_MAX}`
        ? undefined
        : so5L5App,
    [SEARCH_PARAMS.SO5_15_APPEARANCES]:
      so5L15App === `${APPEARANCES_MIN}:${APPEARANCES_15_MAX}`
        ? undefined
        : so5L15App,
    [SEARCH_PARAMS.GLOBAL_CUP]: globalCup,
    [SEARCH_PARAMS.UNSTACKED]: unstacked,
    [SEARCH_PARAMS.NOT_IN_LINEUP]: nl,
    [SEARCH_PARAMS.JERSEY_SERIAL]: jerseySrial,
  });
};

const stateToRoute = (
  uiState: ExtendedUIState,
  mainIndex: string,
  algoliaIndexes: AlgoliaIndexes
): RouteState => indexStateToRoute(uiState[mainIndex] || {}, algoliaIndexes);

const routeToState = (
  routeState: RouteState,
  mainIndex: string,
  algoliaIndexes: AlgoliaIndexes
): ExtendedUIState => {
  // backward compatibility with former routes built by react-instantsearch
  if (routeState.refinementList || routeState.range) {
    const {
      refinementList,
      range: legacyRange = {},
      page,
      sortBy,
    } = routeState;

    const range = Object.entries(legacyRange).reduce(
      (
        res: Record<string, string>,
        entry: [string, { min?: string; max?: string }]
      ) => {
        const [attribute, { min, max }] = entry;

        if (min || max) {
          res[attribute] = `${min}:${max}`;
        }
        return res;
      },
      {}
    );

    return {
      [mainIndex]: {
        sortBy,
        page,
        range,
        refinementList,
      },
    };
  }

  const {
    [SEARCH_PARAMS.QUERY]: query,
    [SEARCH_PARAMS.SORT]: sort,
    [SEARCH_PARAMS.PAGE]: page,
    [SEARCH_PARAMS.DOMESTIC_LEAGUE]: domesticLeague,
    [SEARCH_PARAMS.PROMOTION]: promo,
    [SEARCH_PARAMS.TEAM]: team,
    [SEARCH_PARAMS.RARITY]: rarity,
    [SEARCH_PARAMS.POSITION]: position,
    [SEARCH_PARAMS.PLAYER_NAME]: playerName,
    [SEARCH_PARAMS.NATIONAL_TEAM]: nationalTeam,
    [SEARCH_PARAMS.NATIONALITY]: nationality,
    [SEARCH_PARAMS.SEASON]: season,
    [SEARCH_PARAMS.LEAGUE]: league,
    [SEARCH_PARAMS.CLUB]: club,
    [SEARCH_PARAMS.ACTIVE_TEAM]: activeTeam,
    [SEARCH_PARAMS.EDITION]: edition,
    [SEARCH_PARAMS.BUNDLED]: bundled,
    [SEARCH_PARAMS.DECK]: deck,
    [SEARCH_PARAMS.GRADE]: grade,
    [SEARCH_PARAMS.AGE]: age,
    [SEARCH_PARAMS.ON_SALE]: onSale,
    [SEARCH_PARAMS.LATEST_SEASON]: latestSeason,
    [SEARCH_PARAMS.FAVORITE_FILTER]: favoriteFilter,
    [SEARCH_PARAMS.NON_PLAYABLE_CARDS]: nonPlayableCards,
    [SEARCH_PARAMS.LEGEND]: legend,
    [SEARCH_PARAMS.LEAGUE_FILTER]: leagueFilter,
    [SEARCH_PARAMS.PLAYING_NEXT]: playingNext,
    [SEARCH_PARAMS.PRICE]: price,
    [SEARCH_PARAMS.SERIAL_NUMBER]: serialNumber,
    [SEARCH_PARAMS.MLB_15_AVERAGE]: mlb15Avg,
    [SEARCH_PARAMS.MLB_SEASON_AVG]: mlbSAvg,
    [SEARCH_PARAMS.SO5_15_AVERAGE]: so515Avg,
    [SEARCH_PARAMS.SO5_5_AVERAGE]: so55Avg,
    [SEARCH_PARAMS.SO5_15_APPEARANCES]: so5L15App,
    [SEARCH_PARAMS.SO5_5_APPEARANCES]: so5L5App,
    [SEARCH_PARAMS.NBA_10_AVERAGE]: nba10Avg,
    [SEARCH_PARAMS.GLOBAL_CUP]: globalCup,
    [SEARCH_PARAMS.UNSTACKED]: unstacked,
    [SEARCH_PARAMS.NOT_IN_LINEUP]: notInLineupFilter,
    [SEARCH_PARAMS.JERSEY_SERIAL]: jerseySerial,
  } = routeState;

  const sortBy =
    Object.entries(algoliaIndexes).find(v => v[0] === sort)?.[1] || sort;

  return {
    [mainIndex]: compactRefinements({
      query,
      sortBy,
      page,
      refinementList: compactRefinements({
        'domestic_league.display_name': decodeRefinements(domesticLeague),
        'team.long_name': decodeRefinements(team),
        rarity: decodeRefinements(rarity),
        position: decodeRefinements(position),
        'player.display_name': decodeRefinements(playerName),
        'active_national_team.long_name': decodeRefinements(nationalTeam),
        season: decodeRefinements(season),
        'active_league.display_name': decodeRefinements(league),
        'active_club.long_name': decodeRefinements(club),
        'active_team.long_name': decodeRefinements(activeTeam),
        'card_edition.display_name': decodeRefinements(edition),
        'sale.bundled': decodeRefinements(bundled),
        'custom_decks.name': decodeRefinements(deck),
        'country.name_en': decodeRefinements(nationality),
      }),
      range: compactRefinements({
        grade,
        'player.birth_date_i': age,
        'baseball_stats.last_fifteen_average_score': mlb15Avg,
        'baseball_stats.season_average_score': mlbSAvg,
        'so5.last_five_so5_average_score': so55Avg,
        'so5.last_fifteen_so5_average_score': so515Avg,
        'so5.last_five_so5_appearances': so5L5App,
        'so5.last_fifteen_so5_appearances': so5L15App,
        'sale.price': price,
        serial_number: serialNumber,
        'nba_stats.ten_game_average': nba10Avg,
      }),
      toggle: compactRefinements({
        on_sale: onSale === 'true',
        latest_season: latestSeason === 'true',
        jersey_serial: jerseySerial === 'true',
      }),
      virtualToggle: compactRefinements({
        ff: favoriteFilter === 'true',
        nl: notInLineupFilter === 'true',
        co: nonPlayableCards === 'true',
        legend: legend === 'true',
        lf: leagueFilter || false,
        pn: playingNext === 'true',
        promo: promo || false,
        sgc: globalCup,
        unstacked: unstacked === 'true',
        deck: deck || false,
      }),
    }),
  };
};

const cleanInitialIndexUiState = (
  initialIndexUIState: ExtendedIndexUIState | undefined,
  queryParams: Record<SEARCH_PARAMS, any>
): ExtendedIndexUIState => {
  const queryParamsKeys = Object.keys(queryParams);
  const deleteQueryParamsKeys = (obj?: Record<string, any>) =>
    obj
      ? Object.fromEntries(
          Object.entries(obj).filter(([filterKey]) => {
            return !queryParamsKeys.includes(filterKey);
          })
        )
      : {};

  return {
    ...(!queryParamsKeys.includes(SEARCH_PARAMS.SORT) &&
    initialIndexUIState?.sortBy
      ? { sortBy: initialIndexUIState?.sortBy }
      : {}),
    refinementList: deleteQueryParamsKeys(initialIndexUIState?.refinementList),
    range: deleteQueryParamsKeys(initialIndexUIState?.range),
    toggle: {
      ...(!queryParamsKeys.includes(SEARCH_PARAMS.LATEST_SEASON)
        ? { latest_season: !!initialIndexUIState?.toggle?.latest_season }
        : {}),
      ...(!queryParamsKeys.includes(SEARCH_PARAMS.ON_SALE)
        ? { on_sale: !!initialIndexUIState?.toggle?.on_sale }
        : {}),
    },
    virtualToggle: deleteQueryParamsKeys(initialIndexUIState?.virtualToggle),
  };
};

const NavigationHandler = ({
  mainIndex,
  lastRouteState,
}: {
  mainIndex: string;
  lastRouteState: RouteState;
}) => {
  const { algoliaIndexes } = useConfigContext();
  const { setIndexUiState } = useInstantSearch<ExtendedUIState>();
  const [searchParams] = useSearchParams();
  const setVirtualToggleFilters = useVirtualToggleManager();
  const navigationType = useNavigationType();

  useEffect(() => {
    const algoliaParamsValues = Object.values(SEARCH_PARAMS) as string[];
    const filteredSearchParams = Object.fromEntries(
      Array.from(searchParams).filter(([key]) =>
        algoliaParamsValues.includes(key)
      )
    ) as Record<SEARCH_PARAMS, string>;

    // Serialize + Deserialize filteredSearchParams to ensure a consistent order of properties
    const stateFromRoute = routeToState(
      filteredSearchParams,
      mainIndex,
      algoliaIndexes
    );
    const routeState = stateToRoute(stateFromRoute, mainIndex, algoliaIndexes);
    const strLastRouteState = JSON.stringify(lastRouteState);
    const strCurrentRouteState = JSON.stringify(routeState);
    if (strLastRouteState !== strCurrentRouteState) {
      const indexUiState = stateFromRoute[mainIndex];
      if (indexUiState.virtualToggle) {
        setVirtualToggleFilters(indexUiState.virtualToggle, false);
      }
      setIndexUiState({ ...indexUiState, shouldReplace: true });
    }
  }, [
    searchParams,
    algoliaIndexes,
    mainIndex,
    lastRouteState,
    setIndexUiState,
    setVirtualToggleFilters,
    navigationType,
  ]);

  return null;
};

const InitialVirtualToggleHandler = ({
  initialIndexUIState,
}: {
  initialIndexUIState: ExtendedIndexUIState;
}) => {
  const [defaultStateProcessed, setDefaultStateProcessed] = useState(
    initialIndexUIState === undefined
  );
  const setVirtualToggle = useVirtualToggleManager();

  useEffect(() => {
    if (!defaultStateProcessed) {
      setDefaultStateProcessed(true);
      setVirtualToggle({ ...initialIndexUIState.virtualToggle }, false);
    }
  }, [defaultStateProcessed, setVirtualToggle, initialIndexUIState]);

  return null;
};

// Work-around range bug: forcing the min/max of the connectRange triggers a refinement
const cleanFixedRangeRefinements = (helper: AlgoliaSearchHelper) => {
  [
    { attribute: FILTERS.cardLevel.attribute, min: LEVEL_MIN, max: LEVEL_MAX },
    {
      attribute: FILTERS.lastFiveAppearances.attribute,
      min: APPEARANCES_MIN,
      max: APPEARANCES_5_MAX,
    },
    {
      attribute: FILTERS.lastFifteenAppearances.attribute,
      min: APPEARANCES_MIN,
      max: APPEARANCES_15_MAX,
    },
  ].forEach(c => {
    const refinements = helper.getRefinements(c.attribute);

    if (
      refinements.length === 2 &&
      refinements[0].operator === '>=' &&
      refinements[0].value?.[0] === c.min &&
      refinements[1].operator === '<=' &&
      refinements[1].value?.[0] === c.max
    ) {
      const { numericRefinements } = helper.state;
      delete numericRefinements?.[c.attribute];
      helper.setState({
        ...helper.state,
        numericRefinements,
      });
    }
  });
};

export const InstantSearch: React.FC<Props> = ({
  children,
  indexes,
  defaultHitsPerPage,
  attributesToRetrieve,
  distinct,
  urlState = false,
  analyticsTags,
  sport,
  getOptionalFilters = () => [],
  defaultFilters,
  initialIndexUIState,
}) => {
  const { algoliaIndexes } = useConfigContext();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchClient = useSearchClient();

  const { filters: cardContextFilters } = useSearchCardsContext() || {
    // when not in a search cards context, this doesn't exist
    filters: [],
  };

  const actualIndexes = indexes.map(i => algoliaIndexes[i]);
  const [mainIndex, ...otherIndexes] = actualIndexes;

  const queryParams = Object.fromEntries(searchParams) as Record<
    SEARCH_PARAMS,
    any
  >;

  const stateFromRoute = urlState
    ? routeToState(queryParams, mainIndex, algoliaIndexes)
    : {};

  const { sort: lifecycleMarketplaceSort } = useMarketplaceLifecycle();
  const cleanedInitialIndexUIState = cleanInitialIndexUiState(
    {
      ...initialIndexUIState,
      ...(lifecycleMarketplaceSort
        ? { sortBy: algoliaIndexes[lifecycleMarketplaceSort] }
        : {}),
    },
    queryParams
  );

  const initialUiState: ExtendedUIState = {
    [mainIndex]: {
      ...stateFromRoute[mainIndex],
      ...cleanedInitialIndexUIState,
      refinementList: {
        ...stateFromRoute[mainIndex]?.refinementList,
        ...cleanedInitialIndexUIState?.refinementList,
      },
      range: {
        ...stateFromRoute[mainIndex]?.range,
        ...cleanedInitialIndexUIState?.range,
      },
      toggle: {
        ...stateFromRoute[mainIndex]?.toggle,
        ...cleanedInitialIndexUIState?.toggle,
      },
      virtualToggle: {
        ...stateFromRoute[mainIndex]?.virtualToggle,
        ...cleanedInitialIndexUIState?.virtualToggle,
      },
    },
  };

  const initialRouteState = stateToRoute(
    initialUiState,
    mainIndex,
    algoliaIndexes
  );
  const [lastRouteState, setLastRouteState] =
    useState<RouteState>(initialRouteState);

  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (urlState && !processed) {
      const algoliaParamsValues = Object.values(SEARCH_PARAMS) as string[];
      const notAlgoliaSearchParams = Object.fromEntries(
        Array.from(searchParams).filter(
          ([key]) => !algoliaParamsValues.includes(key)
        )
      );

      const queryString = qs.stringify(
        { ...notAlgoliaSearchParams, ...lastRouteState },
        {
          format: 'RFC1738',
          arrayFormat: 'comma',
          encodeValuesOnly: true,
          skipNulls: true,
          addQueryPrefix: true,
        }
      );

      setSearchParams(new URLSearchParams(queryString), { replace: true });
      setProcessed(true);
    }
  }, [lastRouteState, processed, searchParams, setSearchParams, urlState]);

  return (
    <AlgoliaInstantSearch<ExtendedUIState, RouteState>
      searchClient={searchClient as any} // work-around a typing bug
      indexName={mainIndex}
      initialUiState={initialUiState}
      onStateChange={({ uiState, setUiState }) => {
        if (urlState) {
          const routeState: RouteState = stateToRoute(
            uiState,
            mainIndex,
            algoliaIndexes
          );

          const algoliaParamsValues = Object.values(SEARCH_PARAMS) as string[];
          const notAlgoliaSearchParams = Object.fromEntries(
            Array.from(searchParams).filter(
              ([key]) => !algoliaParamsValues.includes(key)
            )
          );

          const queryString = routeState
            ? qs.stringify(
                { ...notAlgoliaSearchParams, ...routeState },
                {
                  format: 'RFC1738',
                  arrayFormat: 'comma',
                  encodeValuesOnly: true,
                  skipNulls: true,
                  addQueryPrefix: true,
                }
              )
            : '';

          const strLastRouteState = JSON.stringify(lastRouteState);
          const strRouteState = JSON.stringify(routeState);
          if (strRouteState !== strLastRouteState) {
            navigate(`${location.pathname}${queryString}`, {
              replace: !!uiState[mainIndex]?.shouldReplace,
            });
            setLastRouteState(routeState);
          }
        }
        setUiState(uiState);
      }}
      // Work-around range bug: forcing the min/max of the connectRange triggers a refinement
      searchFunction={helper => {
        cleanFixedRangeRefinements(helper);
        helper.search();
      }}
      // End work-around
    >
      {urlState && (
        <NavigationHandler
          mainIndex={mainIndex}
          lastRouteState={lastRouteState}
        />
      )}
      <InitialVirtualToggleHandler
        initialIndexUIState={initialUiState[mainIndex]}
      />
      <Configure
        distinct={distinct}
        optionalFilters={getOptionalFilters(mainIndex)}
        filters={joinFiltersWithAnd([
          ...(defaultFilters || []),
          ...(sport ? [sportFilter(sport)] : []),
          ...cardContextFilters,
        ])}
        hitsPerPage={defaultHitsPerPage}
        attributesToRetrieve={attributesToRetrieve}
        attributesToHighlight={[]}
        analyticsTags={analyticsTags}
        allowTyposOnNumericTokens={false}
      />
      <InstantSearchRefresh interval={60_000} />
      {otherIndexes.map(i => (
        <Index indexName={i} key={i} indexId={i}>
          <Configure
            optionalFilters={getOptionalFilters(i)}
            filters={joinFiltersWithAnd([
              ...(defaultFilters || []),
              ...(sport ? [sportFilter(sport)] : []),
            ])}
          />
        </Index>
      ))}
      {children}
    </AlgoliaInstantSearch>
  );
};

export const InstantCardSearch: React.FC<SearchProps> = ({
  children,
  analyticsTags,
  defaultHitsPerPage = 40,
  sport,
  defaultFilters,
  urlState,
  initialIndexUIState,
}) => (
  <InstantSearch
    indexes={['Cards New']}
    defaultHitsPerPage={defaultHitsPerPage}
    urlState={urlState}
    analyticsTags={analyticsTags}
    sport={sport}
    defaultFilters={defaultFilters}
    distinct={false}
    initialIndexUIState={initialIndexUIState}
  >
    {children}
  </InstantSearch>
);

export const InstantBlockchainCardSearch: React.FC<
  SearchProps & { attributesToRetrieve?: string[]; distinct?: number | boolean }
> = ({
  children,
  indexes = ['Ending Soon'],
  defaultHitsPerPage = 40,
  analyticsTags,
  sport,
  defaultFilters,
  urlState,
  attributesToRetrieve = ['sale'],
  distinct = false,
  initialIndexUIState,
}) => (
  <InstantSearch
    indexes={indexes}
    defaultHitsPerPage={defaultHitsPerPage}
    urlState={urlState}
    analyticsTags={analyticsTags}
    sport={sport}
    defaultFilters={defaultFilters}
    distinct={distinct}
    attributesToRetrieve={attributesToRetrieve}
    initialIndexUIState={initialIndexUIState}
  >
    {children}
  </InstantSearch>
);

export const InstantPlayerSearch: React.FC<SearchProps> = ({
  children,
  indexes = ['Player'],
  defaultHitsPerPage = 20,
  analyticsTags,
  sport,
  defaultFilters,
}) => (
  <InstantSearch
    indexes={indexes}
    defaultHitsPerPage={defaultHitsPerPage}
    analyticsTags={analyticsTags}
    sport={sport}
    defaultFilters={defaultFilters}
    distinct={false}
  >
    {children}
  </InstantSearch>
);

export const InstantClubSearch: React.FC<SearchProps> = ({
  children,
  indexes = ['Club'],
  defaultHitsPerPage = 64,
  analyticsTags,
  sport,
  defaultFilters,
}) => (
  <InstantSearch
    indexes={indexes}
    defaultHitsPerPage={defaultHitsPerPage}
    analyticsTags={analyticsTags}
    sport={sport}
    defaultFilters={defaultFilters}
    distinct={false}
  >
    {children}
  </InstantSearch>
);

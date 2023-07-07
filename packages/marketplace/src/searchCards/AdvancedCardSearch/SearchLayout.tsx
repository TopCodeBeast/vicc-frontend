import { createRef, useMemo } from 'react';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled, { createGlobalStyle } from 'styled-components';

import { Portal } from '@sorare/core/src/atoms/layout/Portal';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { FilterIconButton } from '@sorare/core/src/components/search/FilterIconButton';
import {
  LeftFilters,
  SearchLayoutContainer,
  SearchLayoutMain,
} from '@sorare/core/src/components/search/SearchLayout/ui';
import { AlgoliaCardIndexesNames } from '@sorare/core/src/contexts/config';
// import Highlightable from '@sorare/core/src/contexts/highlight/Highlightable';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { FILTERS, FilterWidget } from '@sorare/core/src/lib/filters';
// import useBottomBarNavItems from '@sorare/core/src/routing/MultiSportBottomNavBar/useBottomBarNavItems';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

// import { ActiveFilters } from '@marketplace/search/ActiveFilters';
// import { SavedFilters } from '@marketplace/search/SavedFilters';
// import StackedSwitch from '@marketplace/searchCards/StackedSwitch';

// import FiltersManager from '../../search/FiltersManager';
// import FiltersManagerDialog from '../../search/FiltersManagerDialog';
// import SearchBox from '../../search/SearchBox';
// import ToggleFiltersManager from '../../search/ToggleFiltersManager';
// import Pagination from '../Pagination';
// import SortCards from '../SortCards';
import { Props } from './types';

const messages = defineMessages({
  defaultPlaceholder: {
    id: 'AdvancedCardSearch.placeholder',
    defaultMessage: 'Filter by player, team or rarity',
  },
  playerPlaceholder: {
    id: 'AdvancedCardSearch.playerPlaceholder',
    defaultMessage: 'Filter cards of {name} by rarity or team',
  },
  teamPlaceholder: {
    id: 'AdvancedCardSearch.teamPlaceholder',
    defaultMessage: 'Filter cards of {name} by player or rarity',
  },
  leaguePlaceholder: {
    id: 'AdvancedCardSearch.leaguePlaceholder',
    defaultMessage: 'Filter cards of {name} by player, team or rarity',
  },
  countryPlaceholder: {
    id: 'AdvancedCardSearch.countryPlaceholder',
    defaultMessage: 'Filters cards of {name} by player, team or rarity',
  },
  stackPlaceholder: {
    id: 'AdvancedCardSearch.stackPlaceholder',
    defaultMessage: 'Filters cards of {name}',
  },
  favoriteCardsPlaceholder: {
    id: 'AdvancedCardSearch.favoriteCardsPlaceholder',
    defaultMessage: 'Filters favorite cards by player, team or rarity',
  },
});

const NoSmoothScrollStyle = createGlobalStyle`
  html {
    /* overrides the default scroll behavior we have in global style.css */
    scroll-behavior: initial;
  }
`;

const Root = styled.div`
  gap: var(--triple-unit);
  display: flex;
  flex-direction: column;
`;
const Heading = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--c-neutral-1000);
`;

const TitleContainer = styled.div`
  display: inline;
  & > *:not(:last-child) {
    display: inline;
    margin-right: var(--unit);
  }
  @media ${laptopAndAbove} {
    display: inline-flex;
    align-items: baseline;
    gap: var(--unit);
    & > *:not(:last-child) {
      display: inline-flex;
      margin-right: 0;
    }
  }
`;

const ResultsCount = styled(Text16)`
  display: inline;
`;
const Cards = styled.div`
  position: relative;
  border-radius: 8px;
`;
const StyledPagination = styled.div`
  padding: 20px 0px;
`;
const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);
`;

const ToggleFiltersWrapper = styled.div`
  position: fixed;
  z-index: 2;
  bottom: var(--triple-unit);
  left: var(--double-unit);
  right: var(--double-unit);
  gap: var(--double-unit);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SearchLayout = (props: Props) => {
  const {
    CardResultsComponent,
    topic,
    stackable,
    favPlayerHit,
    toggleDesktopFilter = true,
    hideSavedFilters = false,
    alwaysShowFavoriteButton = false,
  } = props;
  const { up: isLaptop } = useScreenSize('laptop');
  const [showDesktopFilter, toggleShowDesktopFilters] =
    useToggle(toggleDesktopFilter);
  // const bottomNavBarItems = useBottomBarNavItems();
  const [filtersOpen, toggleFilters] = useToggle(false);
  const { formatMessage, formatNumber } = useIntlContext();

  // We compute the number of results by summing the counts of the `rarity` facet items
  // to work-around the distinct side-effects, which results in the number of distinct hits
  // instead of total number of hits (before distinct).
  // This goes hand-in-hand with us NOT using `facetingAfterDistinct=true`.
  const { results } = useInstantSearch();
  // eslint-disable-next-line no-underscore-dangle
  const facet = results._rawResults[0]?.facets?.[FILTERS.rarity.attribute];
  const nbHits =
    (facet && Object.values(facet).reduce((acc, count) => acc + count, 0)) ||
    results.nbHits;

  const {
    cardFilters,
    advancedCardFilters,
    sorts = [
      'Newly Listed',
      'Ending Soon',
      'Highest Price',
      'Lowest Price',
    ] as AlgoliaCardIndexesNames,
    children,
    hideOwner = false,
    galleryOwnerSlug,
    filtersTour = false,
    cardsTour = false,
    removeFinishedAuctions = false,
    removeEndedSingleSaleOffers = false,
    title,
    subtitle,
    banner,
    hideSorareUser,
  } = props;

  const responsiveFilters = !isLaptop;

  const ref = useMemo(() => createRef<HTMLDivElement>(), []);
  const onPageChange = () => {
    if (ref.current) {
      // We should use EnsureTopVisibleOnMount to handle this
      // but Algolia components do not handle navigation through
      // React router so we can not detected pagination change
      // on router level
      window.scrollTo({ top: ref.current.offsetTop - 100, behavior: 'auto' });
    }
  };

  const searchBoxPlaceholder = topic
    ? {
        player: messages.playerPlaceholder,
        team: messages.teamPlaceholder,
        league: messages.leaguePlaceholder,
        country: messages.countryPlaceholder,
        stack: messages.stackPlaceholder,
        favoriteCards: messages.favoriteCardsPlaceholder,
      }[topic.type]
    : messages.defaultPlaceholder;

  return (
    <Root ref={ref}>
      <NoSmoothScrollStyle />
      {(title || subtitle) && (
        <Heading>
          {title && (
            <TitleContainer>
              {title}
              {!!nbHits && (
                <ResultsCount color="var(--c-neutral-500)">
                  (
                  {isLaptop ? (
                    <FormattedMessage
                      id="SearchLayout.results"
                      defaultMessage="{nbResults} {nbResults, plural, one {result} other {results}}"
                      values={{
                        nbResults: formatNumber(nbHits),
                      }}
                    />
                  ) : (
                    formatNumber(nbHits)
                  )}
                  )
                </ResultsCount>
              )}
            </TitleContainer>
          )}
          {subtitle}
        </Heading>
      )}
      {banner}
      <SearchRow>
        {!responsiveFilters && (
          <FilterIconButton onClick={toggleShowDesktopFilters} />
        )}
        {/* <SearchBox
          withClearIcon
          placeholder={formatMessage(searchBoxPlaceholder, {
            name: topic?.label,
          })}
          favPlayerHit={favPlayerHit}
        />
        {stackable && <StackedSwitch />}
        {isLaptop && <SortCards indexes={sorts} />}
        {!hideSavedFilters && <SavedFilters />} */}
      </SearchRow>
      <SearchLayoutContainer>
        {/* {!responsiveFilters && (
          <Highlightable {...filtersTour} disabled={!filtersTour}>
            <LeftFilters visible={showDesktopFilter}>
              <FiltersManager
                filters={cardFilters}
                advancedFilters={advancedCardFilters}
                skipClearAllButton
              />
            </LeftFilters>
          </Highlightable>
        )} */}
        <SearchLayoutMain>
          {children}
          {/* <ActiveFilters />
          <Highlightable {...cardsTour} position="left" disabled={!cardsTour}>
            <Cards>
              <CardResultsComponent
                hideOwner={hideOwner}
                galleryOwnerSlug={galleryOwnerSlug}
                removeFinishedAuctions={removeFinishedAuctions}
                removeEndedSingleSaleOffers={removeEndedSingleSaleOffers}
                topic={topic}
                hideSorareUser={hideSorareUser}
                stackable={stackable}
                showDesktopFilter={showDesktopFilter}
                alwaysShowFavoriteButton={alwaysShowFavoriteButton}
              />
            </Cards>
          </Highlightable>
          <StyledPagination>
            <Pagination onPageChange={onPageChange} />
          </StyledPagination> */}
        </SearchLayoutMain>
      </SearchLayoutContainer>
      {/* {responsiveFilters && (
        <>
          {bottomNavBarItems ? (
            <Portal id="above-bottom-bar-portal">
              <Highlightable {...filtersTour} disabled={!filtersTour}>
                <ToggleFiltersManager toggleFilters={toggleFilters} />
              </Highlightable>
            </Portal>
          ) : (
            <ToggleFiltersWrapper>
              <Highlightable {...filtersTour} disabled={!filtersTour}>
                <ToggleFiltersManager toggleFilters={toggleFilters} />
              </Highlightable>
            </ToggleFiltersWrapper>
          )}
          <FiltersManagerDialog
            open={filtersOpen}
            onClose={toggleFilters}
            widgets={
              [...cardFilters, ...(advancedCardFilters || [])].filter(
                widget => widget.type !== 'separator'
              ) as FilterWidget[]
            }
            sorts={sorts}
          />
        </>
      )} */}
    </Root>
  );
};

export default SearchLayout;

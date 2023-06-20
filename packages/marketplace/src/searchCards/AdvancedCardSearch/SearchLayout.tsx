import { createRef, useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { FilterIconButton } from '@sorare/core/src/components/search/FilterIconButton';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { theme } from '@sorare/core/src/style/theme';

import StackedSwitch from '@sorare/marketplace/src/searchCards/StackedSwitch';

import SearchBox from '../../search/SearchBox';
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
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: inline-flex;
    align-items: baseline;
    gap: var(--unit);
    & > *:not(:last-child) {
      display: inline-flex;
      margin-right: 0;
    }
  }
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);
`;

export const SearchLayout = (props: Props) => {
  const {
    stackable,
    toggleDesktopFilter = true,
  } = props;
  const { up: isLaptop } = useScreenSize('laptop');
  const [showDesktopFilter, toggleShowDesktopFilters] = useToggle(toggleDesktopFilter);
  const { formatMessage, formatNumber } = useIntlContext();
  const {
    title,
    subtitle,
  } = props;

  const responsiveFilters = !isLaptop;

  const ref = useMemo(() => createRef<HTMLDivElement>(), []);
  
  const searchBoxPlaceholder = messages.defaultPlaceholder;

  return (
    <Root ref={ref}>
      {(title || subtitle) && (
        <Heading>
          {title && (
            <TitleContainer>
              {title}
            </TitleContainer>
          )}
          {subtitle}
        </Heading>
      )}
      <SearchRow>
        {!responsiveFilters && (
          <FilterIconButton onClick={toggleShowDesktopFilters} />
        )}
        <SearchBox
          withClearIcon
          placeholder={formatMessage(searchBoxPlaceholder, {
            name: 'topic?.label',
          })}
          favPlayerHit={{} as any}
        />
        {stackable && <StackedSwitch />}
        {/* {isLaptop && <SortCards indexes={sorts} />}
        {!hideSavedFilters && <SavedFilters />} */}
      </SearchRow>
      <>SearchLayout2</>
    </Root>
  );
};

export default SearchLayout;

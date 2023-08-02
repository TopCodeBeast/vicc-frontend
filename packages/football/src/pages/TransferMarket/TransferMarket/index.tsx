import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Title2 } from '@sorare/core/src/atoms/typography';
import { SEARCH_PARAMS } from '@sorare/core/src/components/search/InstantSearch/types';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useManagerTaskContext } from '@sorare/core/src/contexts/managerTask';
import useQueryString from '@sorare/core/src/hooks/useQueryString';
import { useTitleAndDescription } from '@sorare/core/src/hooks/useTitleAndDescription';
import {
  TOKENS_STACKED_LIMIT,
  createCardSorts,
} from '@sorare/core/src/lib/algolia';
import { transferMarket } from '@sorare/core/src/lib/glossary';
import { metadatas } from '@sorare/core/src/lib/seo/football';

import useDefaultFilters from '@sorare/marketplace/src/hooks/useDefaultFilters';
import {
  RefineLatestSeason,
  filterSeparator,
} from '@sorare/marketplace/src/searchCards';
import { useLatestSeasonLocalStorage } from '@sorare/marketplace/src/searchCards/RefineLatestSeason';

import AdvancedCardSearch from '@football/components/searchCards/AdvancedCardSearch';
import useFavPlayer from '@football/hooks/useFavPlayer';
import ManagersSales from '@football/pages/TransferMarket/OnboardingDialog/ManagersSales';
import PageTemplate from '@football/pages/TransferMarket/PageTemplate';
import { SelectedLeaderboardBanner } from '@football/pages/TransferMarket/SelectedLeaderboardBanner';
import {
  advancedSecondaryMarketFilters,
  secondaryMarketFilters,
} from '@football/pages/TransferMarket/cardFilters';

const cardSortsWithBestValue = createCardSorts({
  withBestValue: true,
  withHighestPrice: false,
  withHighestAverageScore: true,
  withPopularPlayer: true,
  withEndingSoon: false,
});

const TransferMarket = () => {
  useTitleAndDescription(
    metadatas.transfers.title,
    metadatas.transfers.description
  );
  const { task } = useManagerTaskContext();
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(true);
  const [forceShowOnboardingDialog, setForceShowOnboardingDialog] =
    useState(false);
  const unstacked = useQueryString(SEARCH_PARAMS.UNSTACKED);
  const { algoliaCardIndexes } = useConfigContext();
  const favPlayerHit = useFavPlayer({ skip: !task });

  const displayStackedView = !unstacked;
  const [latestSeason] = useLatestSeasonLocalStorage();

  if (showOnboardingDialog && task) setShowOnboardingDialog(false);

  const filters = useDefaultFilters({
    secondary: true,
    onlySettlableCards: true,
  });

  return (
    <PageTemplate showBack>
      {showOnboardingDialog && (
        <ManagersSales
          open={forceShowOnboardingDialog}
          onClick={() => setForceShowOnboardingDialog(false)}
        />
      )}
      <AdvancedCardSearch
        cardFilters={
          displayStackedView
            ? [RefineLatestSeason, filterSeparator, ...secondaryMarketFilters]
            : secondaryMarketFilters
        }
        advancedCardFilters={advancedSecondaryMarketFilters}
        analyticsTags={['TransferMarket', 'Football']}
        sorts={cardSortsWithBestValue}
        defaultSort="Popular Player"
        defaultFilters={filters}
        togglePrimary
        removeEndedSingleSaleOffers
        initialIndexUIState={{
          ...(displayStackedView && {
            toggle: {
              latest_season: latestSeason,
            },
          }),
          sortBy: displayStackedView
            ? algoliaCardIndexes['Popular Player']
            : algoliaCardIndexes['Newly Listed'],
        }}
        title={
          <>
            <Title2>
              <FormattedMessage {...transferMarket.transfer} />
            </Title2>
            <FontAwesomeIcon
              onClick={() => {
                setForceShowOnboardingDialog(true);
              }}
              icon={faInfoCircle}
            />
          </>
        }
        isBlockchain
        distinct={displayStackedView ? TOKENS_STACKED_LIMIT : false}
        stackable
        attributesToRetrieve={['sale', 'player', 'rarity', 'season']}
        banner={<SelectedLeaderboardBanner />}
        {...(task ? { favPlayerHit } : {})}
      />
    </PageTemplate>
  );
};

export default TransferMarket;

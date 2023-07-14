import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { Title2 } from '@sorare/core/src/atoms/typography';
import { ConversionCreditBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditBanner';
import { useTitleAndDescription } from '@sorare/core/src/hooks/useTitleAndDescription';
import { createCardSorts } from '@sorare/core/src/lib/algolia';
import { transferMarket } from '@sorare/core/src/lib/glossary';
import { metadatas } from '@sorare/core/src/lib/seo/nba';

import useDefaultFilters from '@sorare/marketplace/src/hooks/useDefaultFilters';
import { AdvancedBlockchainCardSearch } from '@sorare/marketplace/src/searchCards/AdvancedCardSearch';

// import PrimaryOfferResultsFromGraphQL from '@football/components/starterBundle/PrimaryOfferResultsFromGraphQL';
import StartersPacks from '@football/pages/TransferMarket/OnboardingDialog/StarterPacks';
import PageTemplate from '@football/pages/TransferMarket/PageTemplate';
import { starterBundlesMarketFilters } from '@football/pages/TransferMarket/cardFilters';

const cardSorts = createCardSorts({ withHighestAverageScore: true });

export const StarterBundles = () => {
  const [forceShowOnboardingDialog, setForceShowOnboardingDialog] =
    useState(false);
  useTitleAndDescription(
    metadatas.starterPacks.title,
    metadatas.starterPacks.description
  );

  const filters = useDefaultFilters({ starterPacks: true });

  return (
    <>
      <ConversionCreditBanner />
      <PageTemplate>
        {/* <AdvancedBlockchainCardSearch
          sport={Sport.FOOTBALL}
          CardResultsComponent={PrimaryOfferResultsFromGraphQL}
          sorts={cardSorts}
          defaultSort="Ending Soon"
          cardFilters={starterBundlesMarketFilters}
          defaultFilters={filters}
          analyticsTags={['StarterBundles', 'Football']}
          togglePrimary
          distinct
          title={
            <>
              <Title2>
                <FormattedMessage {...transferMarket.starterPacks} />
              </Title2>
              <FontAwesomeIcon
                role="button"
                icon={faInfoCircle}
                onClick={() => setForceShowOnboardingDialog(true)}
              />
            </>
          }
          defaultHitsPerPage={20}
        /> */}
      </PageTemplate>
      <StartersPacks
        open={forceShowOnboardingDialog}
        onClick={() => setForceShowOnboardingDialog(false)}
      />
    </>
  );
};
export default StarterBundles;

import { gql } from '@apollo/client';
import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Title2 } from '@sorare/core/src/atoms/typography';
import Carousel from '@sorare/core/src/components/content/banners/Carousel';
import { ConversionCreditBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditBanner';
import { useTitleAndDescription } from '@sorare/core/src/hooks/useTitleAndDescription';
import { createCardSorts } from '@sorare/core/src/lib/algolia';
import { transferMarket } from '@sorare/core/src/lib/glossary';
import { metadatas } from '@sorare/core/src/lib/seo/football';

import useDefaultFilters from '@sorare/marketplace/src/hooks/useDefaultFilters';

import AdvancedCardSearch from '@football/components/searchCards/AdvancedCardSearch';
// import NewsSignings from '@football/pages/TransferMarket/OnboardingDialog/NewsSignings';
import PageTemplate from '@football/pages/TransferMarket/PageTemplate';
// import { SelectedLeaderboardBanner } from '@football/pages/TransferMarket/SelectedLeaderboardBanner';
// import {
//   advancedPrimaryMarketFilters,
//   primaryMarketFilters,
// } from '@football/pages/TransferMarket/cardFilters';

const cardSorts = createCardSorts({ withHighestAverageScore: true });

const NewSignings = () => {
  const [forceShowOnboardingDialog, setForceShowOnboardingDialog] =
    useState(false);
  useTitleAndDescription(
    metadatas.newSignings.title,
    metadatas.newSignings.description
  );

  const filters = useDefaultFilters({ primary: true });

  return (
    <>
      {/* <NewsSignings
        open={forceShowOnboardingDialog}
        onClick={() => setForceShowOnboardingDialog(false)}
      /> */}
      <ConversionCreditBanner />
      <PageTemplate>
        <Carousel slotName="so5_primary_market" />
        <AdvancedCardSearch
          // cardFilters={primaryMarketFilters}
          cardFilters={[]}
          // advancedCardFilters={advancedPrimaryMarketFilters}
          advancedCardFilters={[]}
          sorts={cardSorts}
          defaultSort="Ending Soon"
          defaultFilters={filters}
          analyticsTags={['NewSignings', 'Football']}
          togglePrimary
          removeFinishedAuctions
          hideSorareUser
          title={
            <>
              <Title2>
                <FormattedMessage {...transferMarket.new} />
              </Title2>
              <FontAwesomeIcon
                role="button"
                icon={faInfoCircle}
                onClick={() => setForceShowOnboardingDialog(true)}
              />
            </>
          }
          // banner={<SelectedLeaderboardBanner />}
          banner={<>SelectedLeaderboardBanner</>} //TODO****
          isBlockchain
          distinct
        />
      </PageTemplate>
    </>
  );
};

// NewSignings.fragments = {
//   card: gql`
//     fragment NewSignings_card on Card {
//       slug
//       assetId
//       ...AdvancedCardSearch_card
//     }
//     ${AdvancedCardSearch.fragments.card}
//   `,
// };

export default NewSignings;
